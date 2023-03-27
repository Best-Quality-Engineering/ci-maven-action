/* eslint-disable no-unused-vars */
import {expect} from "@jest/globals";
import {ExpectationResult, MatcherContext} from "expect";
import Command from "./Command";

expect.extend({
    toHaveArguments(this: MatcherContext, command: Command, expected: string[]): ExpectationResult {
        // TODO: Read first line from buffer
        expect(command.args)
            .toEqual(expected);
        return {
            pass: true,
            message(): string {
                return "";
            }
        };
    }
});

declare module "expect" {
    interface AsymmetricMatchers {
        toHaveArguments(expected: string[]): void;
    }

    interface Matchers<R> {
        toHaveArguments(expected: string[]): R;
    }
}
