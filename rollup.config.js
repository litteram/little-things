import { nodeResolve } from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"
import sourcemaps from "rollup-plugin-include-sourcemaps"

export default {
  input: "src/index.js",
  output: {
    sourcemap: true,
    file: "module.js",
  },
  plugins: [nodeResolve(), sourcemaps(), json()],
}
