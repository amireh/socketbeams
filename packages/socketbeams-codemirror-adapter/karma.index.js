var tests;

// Run all the tests.
tests = require.context("./lib", true, /__tests__\/.*\.test\.js/);
tests.keys().forEach(tests);
