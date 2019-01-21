/**
 * Clamps the given number into the given range.
 *
 * @param num The input number to clamp.
 * @param {Number} min The lower boundary of the output range.
 * @param {Number} max The upper boundary of the output range.
 * @returns number number in the range [min, max].
 */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Checks if two rectangles intersect one another.
 * The implementation of this function is inspired by the SFML Rect#intersects function :
 * https://www.sfml-dev.org/documentation/2.5.1/classsf_1_1Rect.php#ac77531698f39203e4bbe023097bb6a13
 * @param x1 abscissa of the top-left point of the first rectangle
 * @param y1 ordinate of the top-left point of the first rectangle
 * @param dx1 width of the first rectangle
 * @param dy1 height of the first rectangle
 * @param x2 abscissa of the top-left point of the second rectangle
 * @param y2 ordinate of the top-left point of the second rectangle
 * @param dx2 width of the second rectangle
 * @param dy2 height of the second rectangle
 * @returns {boolean} true if the two rectangles intersect one another.
 */
function intersects(x1, y1, dx1, dy1, x2, y2, dx2, dy2) {
    // Compute the min and max of the first rectangle on both axes
    const r1MinX = Math.min(x1, (x1 + dx1));
    const r1MaxX = Math.max(x1, (x1 + dx1));
    const r1MinY = Math.min(y1, (y1 + dy1));
    const r1MaxY = Math.max(y1, (y1 + dy1));

    // Compute the min and max of the second rectangle on both axes
    const r2MinX = Math.min(x2, (x2 + dx2));
    const r2MaxX = Math.max(x2, (x2 + dx2));
    const r2MinY = Math.min(y2, (y2 + dy2));
    const r2MaxY = Math.max(y2, (y2 + dy2));

    // Compute the intersection boundaries
    const interLeft = Math.max(r1MinX, r2MinX);
    const interTop = Math.max(r1MinY, r2MinY);
    const interRight = Math.min(r1MaxX, r2MaxX);
    const interBottom = Math.min(r1MaxY, r2MaxY);

    // If the intersection is valid (positive non zero area), then there is an intersection
    return (interLeft < interRight) && (interTop < interBottom);
}

/**
 * Checks if a rectangle contains another.
 * @param x1 abscissa of the top-left point of the first rectangle
 * @param y1 ordinate of the top-left point of the first rectangle
 * @param dx1 width of the first rectangle
 * @param dy1 height of the first rectangle
 * @param x2 abscissa of the top-left point of the second rectangle
 * @param y2 ordinate of the top-left point of the second rectangle
 * @param dx2 width of the second rectangle
 * @param dy2 height of the second rectangle
 * @returns {boolean} true if the first rectangle contains the second.
 */
function contains(x1, y1, dx1, dy1, x2, y2, dx2, dy2) {
    return (x2 >= x1) && (x2 + dx2 <= x1 + dx1) && (y2 >= y1) && (y2 + dy2 <= y1 + dy1);
}

/**
 * Generates a random number in the given range.
 * @param min lower boundary of the range.
 * @param max upper boundary of the range.
 * @returns {number} A random number.
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer in the given range.
 * @param min lower boundary of the range.
 * @param max upper boundary of the range.
 * @returns {number} A random integer.
 */
function randint(min, max) {
    return Math.floor(random(min, max + 1));
}