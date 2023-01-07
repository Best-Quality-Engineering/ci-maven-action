expect.extend({
    /**
     * @param {Command} command
     * @param {string[]} expected
     */
    toHaveArguments(command, expected) {
        // TODO: Read first line from buffer
        expect(command.args)
            .toEqual(expected);
        return {
            pass: true
        };
    }
});
