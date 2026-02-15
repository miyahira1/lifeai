import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    onSnapshot,
    type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

// Task types
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    recurrence?: string[]; // Array of days, e.g., ['Mon', 'Tue']
    reminderTime?: string; // Time string, e.g., '09:00'
}

// Automation types
export interface Automation {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'paused';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Stock types
export interface Stock {
    id: string;
    symbol: string;
    name: string;
    userId: string;
    createdAt: Date;
}

// Idea types
export interface Idea {
    id: string;
    title: string;
    description: string;
    status: 'new' | 'mockup' | 'contacted' | 'sold';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    refinement?: string;
    implementationPlan?: string;
}

// ============ TASKS ============

export const subscribeToTasks = (
    userId: string,
    callback: (tasks: Task[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text,
                completed: data.completed,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                recurrence: data.recurrence || [],
                reminderTime: data.reminderTime || '',
            };
        });
        callback(tasks);
    });
};

export const addTask = async (
    userId: string,
    text: string,
    recurrence: string[] = [],
    reminderTime: string = ''
): Promise<void> => {
    await addDoc(collection(db, 'tasks'), {
        text,
        completed: false,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        recurrence,
        reminderTime,
    });
};

export const updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await deleteDoc(doc(db, 'tasks', taskId));
};

// ============ AUTOMATIONS ============

export const subscribeToAutomations = (
    userId: string,
    callback: (automations: Automation[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, 'automations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const automations: Automation[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                description: data.description,
                status: data.status,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
        callback(automations);
    });
};

export const addAutomation = async (
    userId: string,
    name: string,
    description: string,
    status: 'active' | 'paused' = 'active'
): Promise<void> => {
    await addDoc(collection(db, 'automations'), {
        name,
        description,
        status,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const updateAutomation = async (
    automationId: string,
    updates: Partial<Omit<Automation, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
    const automationRef = doc(db, 'automations', automationId);
    await updateDoc(automationRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
};

export const deleteAutomation = async (automationId: string): Promise<void> => {
    await deleteDoc(doc(db, 'automations', automationId));
};

// ============ STOCKS ============

export const subscribeToStocks = (
    userId: string,
    callback: (stocks: Stock[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, 'stocks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const stocks: Stock[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                symbol: data.symbol,
                name: data.name,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
            };
        });
        callback(stocks);
    });
};

export const addStock = async (
    userId: string,
    symbol: string,
    name: string
): Promise<void> => {
    await addDoc(collection(db, 'stocks'), {
        symbol,
        name,
        userId,
        createdAt: Timestamp.now(),
    });
};

export const deleteStock = async (stockId: string): Promise<void> => {
    await deleteDoc(doc(db, 'stocks', stockId));
};

// ============ IDEAS ============

export const subscribeToIdeas = (
    userId: string,
    callback: (ideas: Idea[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, 'ideas'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const ideas: Idea[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description,
                status: data.status,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                refinement: data.refinement,
                implementationPlan: data.implementationPlan,
            };
        });
        callback(ideas);
    });
};

export const addIdea = async (
    userId: string,
    title: string,
    description: string,
    implementationPlan: string = '',
    status: 'new' | 'mockup' | 'contacted' | 'sold' = 'new'
): Promise<void> => {
    await addDoc(collection(db, 'ideas'), {
        title,
        description,
        implementationPlan,
        status,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const updateIdea = async (
    ideaId: string,
    updates: Partial<Omit<Idea, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
    await deleteDoc(doc(db, 'ideas', ideaId));
};
