import { test, expect } from 'bun:test';
import { isApprovedEmail, gallerySection, weeklyIndex } from './photo-rules';
test('Only dnz701@ukr.net is the approved email', () => { expect(isApprovedEmail('DNZ701@ukr.net')).toBe(true); expect(isApprovedEmail('zdo701@ukr.net')).toBe(false); expect(isApprovedEmail('other@example.com')).toBe(false); });
test('Each category keeps its own photos', () => { expect(gallerySection('Заняття')).toBe('groups:Заняття'); expect(gallerySection('Свята')).toBe('groups:Свята'); });
test('Featured photo rotates once per week', () => { expect(weeklyIndex(5, 604799999)).toBe(0); expect(weeklyIndex(5, 604800000)).toBe(1); });
