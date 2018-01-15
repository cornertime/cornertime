import {
    decodeBase64,
    deserialize,
    deserializePreset,
    deserializeReport,
    encodeBase64,
    serialize,
    serializePreset,
    serializeReport,
    wrapLines,
} from './serialization';
import * as assert from 'assert';
import PunishmentStateMachine from './state';
import { defaultPreset } from './models';


describe('wrapLines', () => {
    it('survives the empty string', () => {
        assert.equal(wrapLines(''), '');
    });

    it('splits a long string into lines', () => {
        assert.equal(wrapLines('123456789', 4), '1234\n5678\n9');
    });

    it('does not insert a trailing newline', () => {
        assert.equal(wrapLines('123456', 3), '123\n456');
    });
});


describe('encodeBase64 and decodeBase64', () => {
    it('are the reverse of each other while respecting Unicode characters', () => {
        const str = '✓ à la mode';
        assert.equal(decodeBase64(encodeBase64(str)), str);
    });
});


// single field only to avoid failures with key ordering
const knownObject = {a: 5};
const knownSerialized = '-----BEGIN CORNERTIME REPORT-----\neyJhIjo1fQ==\n-----END CORNERTIME REPORT-----';


describe('serialize', () => {
    it('serializes a known input into a known output', () => {
        assert.equal(serialize(knownObject, 'REPORT'), knownSerialized);
    });
});


describe('deserialize', () => {
    it('deserializes a known input into a known output', () => {
        assert.deepEqual(deserialize(knownSerialized, 'REPORT'), knownObject);
    });

    it('complains loudly if header/footer are missing', () => {
        assert.throws(() => deserialize('eyJhIjo1fQ==\n-----END CORNERTIME REPORT-----', 'REPORT'));
        assert.throws(() => deserialize('-----BEGIN CORNERTIME REPORT-----\neyJhIjo1fQ==', 'REPORT'));
    });
});


describe('serializeReport and deserializeReport', () => {
    it('are reverse of each other', () => {
        const sm = new PunishmentStateMachine();
        sm.getReady();
        while (sm.state !== 'finished') {
            sm.tick();
        }

        const report = sm.report();

        assert.deepEqual(deserializeReport(serializeReport(report)), report);
    });
});


describe('serializePreset and deserializePreset', () => {
    it('are the reverse of each other', () => {
        assert.deepEqual(deserializePreset(serializePreset(defaultPreset)), defaultPreset);
    });
});
