/*
 * This file is part of yoob.js version 0.5-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Pretty standard shim to get window.{request,cancelRequest}AnimationFrame
 * functions, synthesized from the theory and the many examples I've seen.
 */

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(f, elem) {
        return setTimeout(function() {
            f(Date.now());
        }, 1000 / 60);
    };

window.cancelRequestAnimationFrame =
    window.cancelRequestAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout;

/*
 * Convenience function for using requestAnimationFrame.  Calls the
 * object's draw() method on each frame, and calls update() as necessary.
 */
yoob.setUpQuantumAnimationFrame = function(object, cfg) {
    cfg = cfg || {};
    cfg.lastTime = cfg.lastTime || null;
    cfg.accumDelta = cfg.accumDelta || 0;
    cfg.frameTime = cfg.frameTime || (1000.0 / 60.0);
    var animFrame = function(time) {
        object.draw();
        if (cfg.lastTime === null) {
            cfg.lastTime = time;
        }
        cfg.accumDelta += (time - cfg.lastTime);
        while (cfg.accumDelta > cfg.frameTime) {
            cfg.accumDelta -= cfg.frameTime;
            object.update();
        }
        cfg.lastTime = time;
        cfg.request = requestAnimationFrame(animFrame);
    };
    cfg.request = requestAnimationFrame(animFrame);
};
