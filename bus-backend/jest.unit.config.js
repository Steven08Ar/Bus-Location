
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\.spec\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.ts'],
  coveragePathIgnorePatterns: ['main.ts', '.*\.module\.ts$'],
};
