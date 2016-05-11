function CustomMath() {}

/**
 * Find the angle of a segment from (x1, y1) -> (x2, y2).
 * @method Phaser.Math#angleBetween
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {number} The angle, in radians.
 */
CustomMath.angleBetween = function (x1, y1, x2, y2)
{
    return Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
};

CustomMath.degToRad = function (degrees)
{
    return degrees * (Math.PI / 180);
};

CustomMath.radToDeg = function (radians)
{
    return radians * (180 / Math.PI);
};

CustomMath.normalizeAngle = function (angleRad) 
{
    angleRad = angleRad % (2 * Math.PI);
    
    return angleRad >= 0 ? angleRad : angleRad + 2 * Math.PI;
};

CustomMath.getRandom = function(min, max) {
    return (Math.random() * (max - min)) + min;
};