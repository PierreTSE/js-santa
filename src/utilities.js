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

/**
 * Checks if two rectangles intersect one another.
 * The implementation of this function is inspired by the SFML Rect#intersects function :
 * https://www.sfml-dev.org/documentation/2.0-fr/classsf_1_1Rect.php#a566740c8f58e01bb052266f47e7e1011
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
    interLeft = Math.max(r1MinX, r2MinX);
    interTop = Math.max(r1MinY, r2MinY);
    interRight = Math.min(r1MaxX, r2MaxX);
    interBottom = Math.min(r1MaxY, r2MaxY);

    // If the intersection is valid (positive non zero area), then there is an intersection
    return (interLeft < interRight) && (interTop < interBottom);
}