// Temporary shim to smooth over type incompatibilities between @geist-ui/core and React 19
// This keeps runtime behavior intact while relaxing compile-time types.
declare module "@geist-ui/core" {
  const GeistProvider: React.ComponentType<{ children?: React.ReactNode }>;
  const CssBaseline: React.ComponentType<Record<string, never>>;
  const Button: React.ComponentType<any>;
  export { GeistProvider, CssBaseline, Button };
}


