import { MomentInputObject } from "moment";
import { twoDigits } from "../utils";
import { Check } from "./Check";

export class TimeSpan extends Check implements MomentInputObject {
    seconds: number = 0;
    minutes: number = 0;
    hours: number = 0;

    public static now(): TimeSpan {
        let now: Date = new Date();
        return TimeSpan.fromObject({
            seconds: now.getSeconds(),
            minutes: now.getMinutes(),
            hours: now.getHours()
        }, TimeSpan);
    }

    public static fromDate(date: Date): TimeSpan {
        return TimeSpan.fromObject({
            seconds: date.getSeconds(),
            minutes: date.getMinutes(),
            hours: date.getHours()
        }, TimeSpan);
    }

    public toString(): string {
        const hh = twoDigits(this.hours);
        const mm = twoDigits(this.minutes);
        const ss = twoDigits(this.seconds);
        return `${hh}:${mm}:${ss}`;
    }
}