import typescript from "rollup-plugin-typescript2";
import fileSize from "rollup-plugin-filesize";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "Logger",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  plugins: [
    typescript({ clean: true, useTsconfigDeclarationDir: true }),
    fileSize(),
  ],
};
