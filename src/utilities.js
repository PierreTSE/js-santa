/**
 * Returns a number whose value is limited to the given range.
 *
 * @param num The input number to clamp.
 * @param {Number} min The lower boundary of the output range.
 * @param {Number} max The upper boundary of the output range.
 * @returns number number in the range [min, max].
 */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}