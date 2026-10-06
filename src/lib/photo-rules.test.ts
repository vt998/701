import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { isApprovedEmail, gallerySection, weeklyIndex, isAllowedImage, photoStoragePath, moveItem } from './photo-rules';
test('Only dnz701@ukr.net is the approved email', () => { assert.equal(isApprovedEmail('DNZ701@ukr.net'), true); assert.equal(isApprovedEmail('zdo701@ukr.net'), false); });
test('Each category keeps its own photos', () => { assert.equal(gallerySection('Заняття'), 'groups:Заняття'); });
test('Featured photo rotates once per week', () => { assert.equal(weeklyIndex(5, 604799999), 0); assert.equal(weeklyIndex(5, 604800000), 1); });
test('A 59 KB JPG is accepted, 11 MB is not', () => { assert.equal(isAllowedImage('image/jpeg', 59000), true); assert.equal(isAllowedImage('image/jpeg', 11 * 1048576), false); });
test('Storage path has only latin characters', () => { assert.equal(photoStoragePath('groups:Свята', 'romashka', 'image/jpeg', 'x'), 'groups/holidays/romashka/x.jpg'); });
test('Dragging moves a photo to the new place', () => { assert.deepEqual(moveItem(['a', 'b', 'c'], 0, 2), ['b', 'c', 'a']); });
