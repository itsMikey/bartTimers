// get increments between two times
import moment = require("moment");

// return every 15 minutes between two times
export function dateIntervals(startDate: Date, endDate: Date): string[] {
    let start = moment(startDate, "YYYY-MM-DD hh:mma");
    let end = moment(endDate, "YYYY-MM-DD hh:mma");

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    let result = [];

    let current = moment(start);

    while (current <= end) {
        result.push(current.format("hh:mma"));
        current.add(15, "minutes");
    }

    return result;
}

export function isValidEmail(email: string) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

// Minimum eight characters, at least one letter and one number:
export function isValidPassword(password: string) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}
