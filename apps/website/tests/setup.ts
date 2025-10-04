import '@testing-library/jest-dom/vitest';

// Safety shim in case any TSX is compiled without the automatic JSX transform.
import * as React from 'react';
// @ts-ignore
(globalThis as any).React = React;
