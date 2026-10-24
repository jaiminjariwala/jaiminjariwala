import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Compiled third-party runtimes are preserved, not authored source.
    "public/vendor/**",
    "src/components/reference-paper/gpuKernel.js",
    "src/components/reference-paper/pageEngine.js",
    "src/components/reference-paper/paperMath.js",
  ]),
]);

export default eslintConfig;
