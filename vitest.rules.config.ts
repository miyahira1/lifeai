import { defineConfig } from 'vitest/config';

// Firestore rules tests. Run via `npm run test:rules`, which starts the emulator
// (firebase emulators:exec sets FIRESTORE_EMULATOR_HOST for the test process).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/rules/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 60_000,
  },
});
