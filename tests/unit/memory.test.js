const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory/index.js');

describe('memory test', () => {
  test('test writeFragment(fragment), should return nothing/undefined', async () => {
    const fragment = { ownerId: 'testId', id: 'T1', fragment: 'TFragment' };

    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('test readFragment(ownerId, id), should return what we write into db', async () => {
    const fragment = { ownerId: 'testId', id: 'T1', fragment: 'TFragment' };

    await writeFragment(fragment);
    const result = await readFragment('testId', 'T1');
    expect(result).toBe(fragment);
  });

  test('test readFragment(ownerId, id), should return nothing when passed an incorrect id', async () => {
    const fragment = { ownerId: 'testId', id: 'T1', fragment: 'TFragment' };
    await writeFragment(fragment);
    const result = await readFragment('testId', 'wrongId');
    expect(result).toBe(undefined);
  });

  test('test writeFragmentData(ownerId, id, value), should return nothing', async () => {
    const value = 'TFragment';

    const result = await writeFragmentData('testId', 'tId', value);
    expect(result).toBe(undefined);
  });

  test('readFragmentData(ownerId, id) returns the value for the given user', async () => {
    const value = 'TFragment';

    await writeFragmentData('testId', 'tId', value);
    const result = await readFragmentData('testId', 'tId');
    expect(result).toBe('TFragment');
  });
});
