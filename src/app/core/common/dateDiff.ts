import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class DateDiff {
    static diffDays(d1: Date, d2: Date) {
        let t2 = d2.getTime();
        let t1 = d1.getTime();

        let day = (t2 - t1) / (24 * 3600 * 1000);

        return parseInt(day.toString());
    };

    diffWeeks(d1: Date, d2: Date) {
        let t2 = d2.getTime();
        let t1 = d1.getTime();

        let week = (t2 - t1) / (24 * 3600 * 1000 * 7);

        return parseInt(week.toString());
    };

    diffMonths(d1: Date, d2: Date) {
        let d1Y = d1.getFullYear();
        let d2Y = d2.getFullYear();
        let d1M = d1.getMonth();
        let d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    };

    diffYears(d1: Date, d2: Date) {
        return d2.getFullYear() - d1.getFullYear();
    };
}

