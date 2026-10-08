import { readFileSync } from 'node:fs';
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
    addDoc,
    collection,
    deleteDoc,
    deleteField,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
    type Firestore,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// src/lib/db.ts uses `db` from ./firebase; point it at the emulator instead.
const app = vi.hoisted(() => ({ db: undefined as unknown }));
vi.mock('../../src/lib/firebase', () => ({
    get db() {
        return app.db;
    },
}));
import * as appDb from '../../src/lib/db';

const LEO = 'leo-uid';
const LEO_EMAIL = 'miyahira1@gmail.com';
const BOB = 'bob-uid';
const COLLECTIONS = ['tasks', 'stocks', 'automations', 'ideas'];

let env: RulesTestEnvironment;

beforeAll(async () => {
    // Host/port come from FIRESTORE_EMULATOR_HOST, set by `firebase emulators:exec`.
    // RULES_FILE lets the same tests run against another rules file (e.g. the old live rules).
    env = await initializeTestEnvironment({
        projectId: 'demo-lifeai',
        firestore: { rules: readFileSync(process.env.RULES_FILE ?? 'firestore.rules', 'utf8') },
    });
});

afterAll(async () => {
    await env?.cleanup();
});

beforeEach(async () => {
    await env.clearFirestore();
});

// rules-unit-testing returns a compat instance; the modular API accepts it.
const asDb = (f: unknown) => f as Firestore;
const google = (email: string, verified = true) => ({
    email,
    email_verified: verified,
    firebase: { sign_in_provider: 'google.com' as const },
});
const leoDb = () => asDb(env.authenticatedContext(LEO, google(LEO_EMAIL)).firestore());
const bobDb = () => asDb(env.authenticatedContext(BOB, google('bob@example.com')).firestore());
const unverifiedLeoDb = () => asDb(env.authenticatedContext(LEO, google(LEO_EMAIL, false)).firestore());
const anonDb = () => asDb(env.unauthenticatedContext().firestore());

const newDoc = (userId: string) => ({ userId, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
const ownQuery = (db: Firestore, name: string, uid: string) =>
    query(collection(db, name), where('userId', '==', uid), orderBy('createdAt', 'desc'));

// Seed bypassing rules so each test only checks the operation under test.
async function seed(name: string, userId = LEO): Promise<string> {
    let id = '';
    await env.withSecurityRulesDisabled(async (ctx) => {
        id = (await addDoc(collection(asDb(ctx.firestore()), name), newDoc(userId))).id;
    });
    return id;
}

async function expectAllDenied(db: Firestore, name: string, id: string, uid: string) {
    const ref = doc(db, name, id);
    await assertFails(getDoc(ref));
    await assertFails(getDocs(ownQuery(db, name, LEO)));
    await assertFails(addDoc(collection(db, name), newDoc(uid)));
    await assertFails(updateDoc(ref, { updatedAt: Timestamp.now() }));
    await assertFails(deleteDoc(ref));
}

describe.each(COLLECTIONS)('%s', (name) => {
    it('Leo can create, query (where userId == uid orderBy createdAt), get, update and delete his docs', async () => {
        const db = leoDb();
        const ref = await assertSucceeds(addDoc(collection(db, name), newDoc(LEO)));
        const snap = await assertSucceeds(getDocs(ownQuery(db, name, LEO)));
        expect(snap.docs.map((d) => d.id)).toEqual([ref.id]);
        await assertSucceeds(getDoc(ref));
        await assertSucceeds(updateDoc(ref, { updatedAt: Timestamp.now() }));
        await assertSucceeds(deleteDoc(ref));
    });

    it('a different verified Google user is denied everything, including their own docs', async () => {
        const db = bobDb();
        await expectAllDenied(db, name, await seed(name), BOB);
        const bobsId = await seed(name, BOB);
        await assertFails(getDocs(ownQuery(db, name, BOB)));
        await assertFails(getDoc(doc(db, name, bobsId)));
        await assertFails(updateDoc(doc(db, name, bobsId), { updatedAt: Timestamp.now() }));
        await assertFails(deleteDoc(doc(db, name, bobsId)));
    });

    it('unauthenticated users are denied', async () => {
        await expectAllDenied(anonDb(), name, await seed(name), LEO);
    });

    it("Leo's email with email_verified false is denied", async () => {
        await expectAllDenied(unverifiedLeoDb(), name, await seed(name), LEO);
    });

    it("Leo can't create a doc with someone else's userId (or none)", async () => {
        const db = leoDb();
        await assertFails(addDoc(collection(db, name), newDoc(BOB)));
        await assertFails(addDoc(collection(db, name), { createdAt: Timestamp.now() }));
    });

    it("Leo can't change or remove userId on update", async () => {
        const ref = doc(leoDb(), name, await seed(name));
        await assertFails(updateDoc(ref, { userId: BOB }));
        await assertFails(updateDoc(ref, { userId: deleteField() }));
        await assertFails(setDoc(ref, newDoc(BOB)));
    });
});

describe('unknown collections', () => {
    it('are denied, even for Leo', async () => {
        const db = leoDb();
        await assertFails(addDoc(collection(db, 'notes'), newDoc(LEO)));
        await assertFails(setDoc(doc(db, 'users', LEO), newDoc(LEO)));
        await assertFails(getDocs(ownQuery(db, 'notes', LEO)));
        await assertFails(getDoc(doc(db, 'users', LEO)));
        await assertFails(addDoc(collection(db, 'tasks', 'x', 'sub'), newDoc(LEO)));
    });
});

// The exact calls the app makes (src/lib/db.ts), signed in as Leo.
describe('app data layer (src/lib/db.ts) as Leo', () => {
    beforeEach(() => {
        app.db = leoDb();
    });

    // db.ts subscriptions have no error callback, so a denied query would never call back.
    const firstSnapshot = <T>(subscribe: (uid: string, cb: (items: T[]) => void) => () => void) =>
        new Promise<T[]>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('no snapshot (query denied?)')), 5000);
            const unsubscribe = subscribe(LEO, (items) => {
                clearTimeout(timer);
                unsubscribe();
                resolve(items);
            });
        });

    it('tasks: addTask, subscribeToTasks, updateTask, deleteTask', async () => {
        await appDb.addTask(LEO, 'Test task', ['Mon'], '09:00');
        const [task] = await firstSnapshot(appDb.subscribeToTasks);
        expect(task).toMatchObject({ text: 'Test task', userId: LEO });
        await appDb.updateTask(task.id, { completed: true });
        await appDb.deleteTask(task.id);
    });

    it('automations: addAutomation, subscribeToAutomations, updateAutomation, deleteAutomation', async () => {
        await appDb.addAutomation(LEO, 'Test automation', 'desc');
        const [a] = await firstSnapshot(appDb.subscribeToAutomations);
        expect(a).toMatchObject({ name: 'Test automation', userId: LEO });
        await appDb.updateAutomation(a.id, { status: 'paused' });
        await appDb.deleteAutomation(a.id);
    });

    it('stocks: addStock, subscribeToStocks, deleteStock', async () => {
        await appDb.addStock(LEO, 'TEST', 'Test stock');
        const [s] = await firstSnapshot(appDb.subscribeToStocks);
        expect(s).toMatchObject({ symbol: 'TEST', userId: LEO });
        await appDb.deleteStock(s.id);
    });

    it('ideas: addIdea, subscribeToIdeas, updateIdea, deleteIdea', async () => {
        await appDb.addIdea(LEO, 'Test idea', 'desc');
        const [idea] = await firstSnapshot(appDb.subscribeToIdeas);
        expect(idea).toMatchObject({ title: 'Test idea', userId: LEO });
        await appDb.updateIdea(idea.id, { status: 'mockup' });
        await appDb.deleteIdea(idea.id);
    });
});
