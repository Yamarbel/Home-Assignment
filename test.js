const test = require('ava');
const app = require('./app')

test('Test empty array sorting', (t) => {
	const items = []
	var sortedItems = app.sortShowResults(items);

	t.deepEqual(items, sortedItems);
});

test('Test single array sorting', (t) => {
	const items = [new app.ShowResult()]
	var sortedItems = app.sortShowResults(items);

	t.deepEqual(items, sortedItems);
});

test('Test multiple array sorting', (t) => {
	const res0 = new app.ShowResult("First", "running", 5, "", "");
	const res1 = new app.ShowResult("Second", "running", 10, "", "");
	const res2 = new app.ShowResult("Third", "running", 6, "", "");
	const res3 = new app.ShowResult("Fourth", "running", 3, "", "");

	const items = [res0, res1, res2, res3];
	var sortedItems = app.sortShowResults(items);

	t.deepEqual([res1, res2, res0, res3], sortedItems);
});
