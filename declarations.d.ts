declare module 'next/server' {
  export { NextRequest, NextResponse } from 'next/dist/server/web/spec-extension/adapters/next-request';
  export * from 'next/dist/server/web/exports/index';
}

declare module 'canvas-confetti';
