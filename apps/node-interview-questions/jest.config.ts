import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "esbuild-jest"
  }
};

export default config;