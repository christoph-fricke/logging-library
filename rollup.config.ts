import typescript from "rollup-plugin-typescript2";
import fileSize from "rollup-plugin-filesize";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      sourcemap: true,
      name: "logging-library",
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
      // We don't want to ship declarations for the test files but excluding them
      // in tsconfig.json destroys intellisense for vscode.
      tsconfigOverride: { exclude: ["**/test-helper/**/*", "**/*.test.*"] },
    }),
    fileSize(),
  ],
};
