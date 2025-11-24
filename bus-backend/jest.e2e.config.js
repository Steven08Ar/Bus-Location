
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'test',
  testRegex: '.*\.e2e-spec\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: '../coverage-e2e',
};
