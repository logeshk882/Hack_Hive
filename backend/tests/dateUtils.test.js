const assert = require('assert');
const { parseDeadlineDate, isHackathonClosed } = require('../src/utils/dateUtils');

console.log('--- Running backend dateUtils tests ---');

const refDate = new Date('2026-07-20T00:00:00Z'); // Reference date: July 20, 2026

// Test 1: Future ISO date
const d1 = '2026-12-31';
assert.strictEqual(isHackathonClosed(d1, refDate), false, '2026-12-31 should be active');

// Test 2: Past ISO date
const d2 = '2026-05-15';
assert.strictEqual(isHackathonClosed(d2, refDate), true, '2026-05-15 should be closed');

// Test 3: Date range ending in future
const d3 = 'Jun 01 - Aug 15, 2026';
assert.strictEqual(isHackathonClosed(d3, refDate), false, 'Range ending Aug 15, 2026 should be active');

// Test 4: Date range ending in past
const d4 = 'May 01 - Jun 30, 2026';
assert.strictEqual(isHackathonClosed(d4, refDate), true, 'Range ending Jun 30, 2026 should be closed');

// Test 5: Explicitly ended / closed strings
assert.strictEqual(isHackathonClosed('Registration Closed', refDate), true, 'Closed string should be closed');
assert.strictEqual(isHackathonClosed('Ended', refDate), true, 'Ended string should be closed');

// Test 6: Ordinals and text noise
const d6 = '25th July 2026';
assert.strictEqual(isHackathonClosed(d6, refDate), false, '25th July 2026 should be active');

const d7 = 'Starts 10th May 2026';
assert.strictEqual(isHackathonClosed(d7, refDate), true, 'Starts 10th May 2026 should be closed');

console.log('✅ All backend dateUtils tests passed successfully!');
