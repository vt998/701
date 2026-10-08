import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { photosInCollection, centerLastAnnouncement, weekdayShortNames } from './gallery-rules';
test('The unnamed home collection excludes named folders', () => {
  const photos = [
    { id: 'home', group_slug: 'romashka', section: 'groups:Свята', folder_id: null },
    { id: 'album', group_slug: 'romashka', section: 'groups:Свята', folder_id: 'folder-a' },
    { id: 'other', group_slug: 'sonechko', section: 'groups:Свята', folder_id: null },
  ];
  assert.deepEqual(photosInCollection(photos, 'romashka', 'groups:Свята', null).map(p => p.id), ['home']);
});
test('A named folder shows only its own photos in its category', () => {
  const photos = [
    { id: 'a', group_slug: 'romashka', section: 'groups:Свята', folder_id: 'a' },
    { id: 'b', group_slug: 'romashka', section: 'groups:Свята', folder_id: 'b' },
    { id: 'c', group_slug: 'romashka', section: 'groups:Заняття', folder_id: 'a' },
  ];
  assert.deepEqual(photosInCollection(photos, 'romashka', 'groups:Свята', 'a').map(p => p.id), ['a']);
});
test('Only the last announcement of an odd count is centered', () => {
  assert.equal(centerLastAnnouncement(2, 3), true);
  assert.equal(centerLastAnnouncement(1, 3), false);
  assert.equal(centerLastAnnouncement(3, 4), false);
});
test('Weekdays use the requested Ukrainian abbreviations', () => {
  assert.deepEqual(weekdayShortNames, ['пн', 'вт', 'ср', 'чт', 'пт']);
});