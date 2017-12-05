import {dateIntervals, isValidEmail, isValidPassword} from "../HelperFunctions";
import moment = require("moment");
import {expect} from "chai";

describe("it should test helper functions", () => {

    it("should correctly send date intervals in increments of 15 minutes", (done) => {
        const startTime = new Date();
        const endTime = new Date();
        startTime.setHours(1, 0);
        endTime.setHours(3, 0);
        const initialMoment = moment(startTime);
        const intervals = dateIntervals(startTime, endTime);

        expect(intervals[0], "didn't equal first interval correctly").to.eql(initialMoment.format("hh:mma"));
        for (let i = 1, j = intervals.length; i < j; i++) {
            expect(intervals[i], `didn't equal ${i} interval correctly`).to.eql(initialMoment.add(15, "m").format("hh:mma"));
        }
        done();
    });

    it("should send true for valid email", () => {
        expect(isValidEmail("mikey@tester.com"), "should be valid email").to.eql(true);
    });

    it("should send false for invalid email", () => {
        expect(isValidEmail("mikey"), "should be invalid email").to.eql(false);
    });

    it("should send true for valid password", () => {
        expect(isValidPassword("YothatsCool98"), "should be valid password").to.eql(true);
    });

    it("should send false for invalid email", () => {
        expect(isValidPassword("12"), "should be invalid password").to.eql(false);
    });

});

