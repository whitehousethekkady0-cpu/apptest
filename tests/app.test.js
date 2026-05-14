// ===========================
// DevFlow — app.test.js
// Tests for utility functions in src/js/main.js
// Run with: node tests/app.test.js
// ===========================

const { isValidEmail, sanitiseInput, formatDate, truncate } = require('../src/js/main.js');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    → ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// ---- isValidEmail ----
console.log('\nisValidEmail');
test('accepts a standard email', () => {
  assert(isValidEmail('hello@example.com') === true);
});
test('rejects missing @', () => {
  assert(isValidEmail('helloexample.com') === false);
});
test('rejects empty string', () => {
  assert(isValidEmail('') === false);
});
test('rejects non-string', () => {
  assert(isValidEmail(null) === false);
  assert(isValidEmail(42)   === false);
});
test('accepts subdomain email', () => {
  assert(isValidEmail('user@mail.company.com') === true);
});

// ---- sanitiseInput ----
console.log('\nsanitiseInput');
test('trims leading and trailing whitespace', () => {
  assert(sanitiseInput('  hello  ') === 'hello');
});
test('strips HTML tags', () => {
  assert(sanitiseInput('<b>hello</b>') === 'hello');
  assert(!sanitiseInput('<script>alert(1)</script>hello').includes('<'));
});
test('returns empty string for non-string input', () => {
  assert(sanitiseInput(null)      === '');
  assert(sanitiseInput(undefined) === '');
  assert(sanitiseInput(42)        === '');
});
test('leaves clean strings unchanged', () => {
  assert(sanitiseInput('Clean input') === 'Clean input');
});

// ---- formatDate ----
console.log('\nformatDate');
test('formats a valid date string', () => {
  const result = formatDate('2024-01-15');
  assert(result.includes('2024'), `Expected year in output, got: ${result}`);
});
test('returns Invalid date for a bad input', () => {
  assert(formatDate('not-a-date') === 'Invalid date');
});
test('accepts a Date object', () => {
  const result = formatDate(new Date('2023-06-01'));
  assert(result.includes('2023'), `Expected year in output, got: ${result}`);
});

// ---- truncate ----
console.log('\ntruncate');
test('truncates a string longer than maxLen', () => {
  const result = truncate('Hello, world!', 5);
  assert(result.startsWith('Hello'), `Got: ${result}`);
  assert(result.includes('…'), `Missing ellipsis: ${result}`);
});
test('does not truncate a short string', () => {
  assert(truncate('Hi', 10) === 'Hi');
});
test('returns empty string for non-string input', () => {
  assert(truncate(null, 5) === '');
});
test('handles maxLen equal to string length', () => {
  assert(truncate('Hello', 5) === 'Hello');
});

// ---- Summary ----
console.log(`\n${'─'.repeat(40)}`);
console.log(`  Passed: ${passed}   Failed: ${failed}`);
console.log(`${'─'.repeat(40)}\n`);

if (failed > 0) {
  process.exit(1); // Non-zero exit code = CI pipeline fails
}
