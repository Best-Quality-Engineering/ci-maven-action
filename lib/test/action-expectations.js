expect.extend({
    /**
     * @param {Buffer} actual
     * @param {string} expected
     */
    toHaveRunCommand(actual, expected) {
        // TODO: Read first line from buffer
        expect(actual.toString("utf-8"))
            .toEqual(`[command]/usr/local/bin/${expected}`);
        return {
            pass: true
        };
    }
});
