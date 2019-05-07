import assert from 'assert';
import { formatDuration } from './time';


describe('formatDuration', () => {
    it('works for known sub-hour examples', () => {
        assert.equal(formatDuration(0), '0:00');
        assert.equal(formatDuration(2 * 60 + 35), '2:35');
        assert.equal(formatDuration(17 * 60 + 5), '17:05');
    });

    it('works for known long examples', () => {
        assert.equal(formatDuration(6 * 60 * 60 + 3 * 60 + 42), '6:03:42');
        assert.equal(formatDuration(39 * 60 * 60 + 15 * 60 + 7), '39:15:07');
    });

    it('handles negative numbers', () => {
        assert.equal(formatDuration(-1), '-0:01');
        assert.equal(formatDuration(-(3 * 60 + 7)), '-3:07');
        assert.equal(formatDuration(-(22 * 60 * 60 + 30 * 60 + 11)), '-22:30:11');
    });
});
