module.exports = {
  testEnvironment: 'node',
  verbose: true,
  projects: [
    {
      displayName: 'Unit',
      testMatch: [
        '**/__tests__/**/*test.js?(x)', 
        '!**/.aws-sam/**/*test.js?(x)'
      ],
    },
  ],
};
