import assert from 'node:assert/strict';
import test from 'node:test';

import { formatDateForApi } from '../src/utils/dateFormatters.ts';

function withTimeZone(timeZone, run) {
    const previousTimeZone = process.env.TZ;
    process.env.TZ = timeZone;

    try {
        run();
    } finally {
        if (previousTimeZone === undefined) {
            delete process.env.TZ;
        } else {
            process.env.TZ = previousTimeZone;
        }
    }
}

const timeZones = [
    ['UTC', '2026-02-27T02:30:45'],
    ['America/Santiago', '2026-02-26T23:30:45'],
    ['Asia/Tokyo', '2026-02-27T11:30:45'],
];

for (const [timeZone, zonedTimestamp] of timeZones) {
    test(`date-only inputs keep their calendar date at midnight in ${timeZone}`, () => {
        withTimeZone(timeZone, () => {
            for (const date of ['2026-02-27', '2026-01-01', '2024-02-29', '2026-07-01']) {
                assert.equal(formatDateForApi(date), `${date}T00:00:00`, date);
            }
        });
    });

    test(`timestamps and Date objects retain local-time formatting in ${timeZone}`, () => {
        withTimeZone(timeZone, () => {
            assert.equal(formatDateForApi('2026-02-27T10:30'), '2026-02-27T10:30:00');
            assert.equal(formatDateForApi('2026-02-27T10:30:45'), '2026-02-27T10:30:45');
            assert.equal(formatDateForApi(new Date(2026, 1, 27, 10, 30, 45)), '2026-02-27T10:30:45');
            assert.equal(formatDateForApi('2026-02-27T02:30:45Z'), zonedTimestamp);
        });
    });
}
