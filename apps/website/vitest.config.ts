<<<<<<< HEAD
<<<<<<< HEAD
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
=======
import { defineConfig } from "vitest/config";
=======
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
>>>>>>> b2ea271 (chore(ci): finalize doctor verification and guardrail health)

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    globals: true,
<<<<<<< HEAD
    setupFiles: "./tests/setup.ts",
>>>>>>> 7a98f0c (chore(ci): finalize guardrails + husky modernization)
=======
    css: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
>>>>>>> b2ea271 (chore(ci): finalize doctor verification and guardrail health)
  },
});
