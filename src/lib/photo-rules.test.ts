import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { isApprovedEmail, gallerySection, weeklyIndex } from './photo-rules';
test('Only dnz701@ukr.net is the approved email', () => { assert.equal(isApprovedEmail('DNZ701@ukr.net'), true); assert.equal(isApprovedEmail('zdo701@ukr.net'), false); assert.equal(isApprovedEmail('other@example.com'), false); });
test('Each category keeps its own photos', () => { assert.equal(gallerySection('Заняття'), 'groups:Заняття'); assert.equal(gallerySection('Свята'), 'groups:Свята'); });
test('Featured photo rotates once per week', () => { assert.equal(weeklyIndex(5, 604799999), 0); assert.equal(weeklyIndex(5, 604800000), 1); });
