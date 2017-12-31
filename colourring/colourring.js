function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "preset-manager.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);

                var canvas = yoob.makeCanvas(container, 800, 800);
                canvas.style.display = 'inline-block';

                var gewgaw = new Colourring().init(canvas);

                var panelContainer = yoob.makeDiv(container);
                panelContainer.style.display = 'inline-block';
                panelContainer.style.textAlign = 'right';
                panelContainer.style.verticalAlign = 'top';
                var panel = panelContainer; // yoob.makePanel(panelContainer, "Settings", true);

                var presetSelect = yoob.makeSelect(panel, "MODE", []);
                var p = new yoob.PresetManager().init({ 'selectElem': presetSelect });
                var modes = gewgaw.getModes();
                for (var i = 0; i < modes.length; i++) {
                    (function() {
                        var v = modes[i];
                        p.add(v, function(n) { gewgaw.setMode(v); })
                    }());
                }
                yoob.makeLineBreak(panel);

                yoob.makeRangeControl(panel, {
                    label: "# of radial segments",
                    min: 1,
                    max: 500,
                    value: 100,
                    callback: function(v) {
                        gewgaw.setNumRadialSegments(v);
                    }
                });
                yoob.makeLineBreak(panel);

                yoob.makeRangeControl(panel, {
                    label: "# of levels",
                    min: 1,
                    max: 100,
                    value: 3,
                    callback: function(v) {
                        gewgaw.setNumLevels(v);
                    }
                });
                yoob.makeLineBreak(panel);

                yoob.makeRangeControl(panel, {
                    label: "Randomness on even levels",
                    min: 0,
                    max: 100,
                    value: 0,
                    callback: function(v) {
                        gewgaw.setRandomnessOn(0, v / 100);
                    }
                });
                yoob.makeLineBreak(panel);

                yoob.makeRangeControl(panel, {
                    label: "Randomness on odd levels",
                    min: 0,
                    max: 100,
                    value: 100,
                    callback: function(v) {
                        gewgaw.setRandomnessOn(1, v / 100);
                    }
                });
                yoob.makeLineBreak(panel);

                yoob.makeRangeControl(panel, {
                    label: "Segment width",
                    min: 0,
                    max: 1000,
                    value: 10,
                    callback: function(v) {
                        gewgaw.setSegmentWidth(v / 1000);
                    }
                });
                yoob.makeLineBreak(panel);

                yoob.makeRangeControl(panel, {
                    label: "Luminance variability",
                    min: 0,
                    max: 100,
                    callback: function(v) {
                        gewgaw.setLuminanceVariability(v / 100);
                    }
                });
                yoob.makeLineBreak(panel);

                var resetButton = yoob.makeButton(panel, 'Reset', function() { gewgaw.reset(); });

                gewgaw.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}


var QUADRANT = Math.PI / 2;
var TWO_PI = Math.PI * 2;

Colourring = function() {
    this.init = function(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.mode = "Complementary Rings";
        this.scale = 0.0;
        this.numSegments = 100;
        this.numLevels = 3;
        this.randomnessOn = [0.0, 1.0];
        this.segmentWidth = 0.01;

        this.modes = {};
        this.modeNames = [];

        this.addMode("Complementary Rings", function(cx, cy, rz, step) {
            for (var i = 0.0; i < 1.0; i += step) {
                var baseHue = 360 * i;
                var levelDepth = (rz / this.numLevels) * 3;
                for (var d = this.numLevels - 1; d >= 0; d--) {
                    var hue;
                    if (d % 2 === 0) {
                        hue = Math.random() > this.randomnessOn[0] ? baseHue : baseHue + 180;
                    } else {
                        hue = Math.random() > this.randomnessOn[1] ? baseHue : baseHue + 180;
                    }
                    this.setFillHSL(hue, 1.0, -1);
                    this.fillSegment(this.ctx,
                        cx, cy,
                        rz + levelDepth * (d + 1) + 1, rz + levelDepth * d,
                        i * TWO_PI, (i + step + 0.001) * TWO_PI
                    );
                }
            }
        });

        this.addMode("Spurious Spokes", function(cx, cy, rz, step) {
            for (var i = 0; i < this.numSegments; i += 1) {
                var ang = Math.random();
                this.setFillHSL(360 * ang, 1.0, -1);
                this.fillSegment(
                    this.ctx, cx, cy,
                    rz * 4, rz * 1,
                    ang * TWO_PI, (ang + this.segmentWidth) * TWO_PI
                );
            }
        });

        this.addMode("Random ArcAreas", function(cx, cy, rz, step) {
            for (var i = 0; i < this.numSegments; i += 1) {

                // Pick angle.  (I'd call this theta, but it's not in radians.  It is in range 0.0 — 1.0.
                var ang = Math.random();

                // Pick (1/2) width of segment, in same units as angle.
                var spread = this.segmentWidth / 2;

                // Pick radii
                var r1 = Math.random();
                var r2 = Math.random();
                if (r1 < r2) { var t = r1; r1 = r2; r2 = t; }

                this.setFillHSL(360 * ang, 1.0, -1);
                this.fillSegment(
                    this.ctx, cx, cy,
                    r1 * (rz * 4), r2 * (rz * 4),
                    (ang - spread) * TWO_PI, (ang + spread) * TWO_PI
                );
            }
        });

        this.addMode("Complementary Randompatch Rings", function(cx, cy, rz, step) {
            for (var i = 0; i < this.numSegments; i += 1) {

                // Pick angle.  (I'd call this theta, but it's not in radians.  It is in range 0.0 — 1.0.
                var ang = Math.random();

                // Pick width of segment, in same units as angle.
                var width = this.segmentWidth;

                // Pick distance from centre.
                var dist = Math.random() * (rz * 3) + rz;

                // Pick thickness of segment.
                var thickness = rz / 2;

                // Pick hue, saturation, luminance.
                var hue = 360 * ang;
                if (dist > rz * 2 && dist < rz * 3) {
                    hue = 360 * ang + 180;
                }
                var sat = 1.0;

                this.setFillHSL(hue, sat, -1);
                this.fillSegment(
                    this.ctx, cx, cy,
                    dist - thickness / 2, dist + thickness / 2,
                    (ang - width / 2) * TWO_PI, (ang + width / 2) * TWO_PI
                );
            }
        });

        this.addMode("Complementary Spokes", function(cx, cy, rz, step) {
            for (var i = 0.0; i < 1.0; i += step) {
                var hue = (Math.floor(360 * i) % 2 === 0) ? 360 * i : 360 * i + 180;
                this.setFillHSL(hue, 1.0, -1);
                this.fillSegment(this.ctx, cx, cy, rz * 4 + 1, rz * 1, i * TWO_PI, (i + step + 0.001) * TWO_PI);
            }
        });

        this.reset();

        return this;
    };

    this.reset = function() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.draw();
    };

    this.addMode = function(modeName, modeFun) {
        this.modeNames.push(modeName);
        this.modes[modeName] = modeFun;
    };

    this.getModes = function() {
        return this.modeNames;
    };

    this.setMode = function(mode) {
        this.mode = mode;
        this.reset();
    };

    this.setLuminanceVariability = function(scale) {
        this.scale = scale;
        this.reset();
    };

    this.setNumRadialSegments = function(n) {
        this.numSegments = n;
        this.reset();
    };

    this.setNumLevels = function(n) {
        this.numLevels = n;
        this.reset();
    };

    this.setRandomnessOn = function(index, value) {
        this.randomnessOn[index] = value;
        this.reset();
    };

    this.setSegmentWidth = function(n) {
        this.segmentWidth = n;
        this.reset();
    };

    /* Utilities */

    this.pathSegment = function(ctx, cx, cy, r1, r2, th1, th2) {
        ctx.arc(cx, cy, r1, th1, th2, false);
        ctx.arc(cx, cy, r2, th2, th1, true);
    };

    this.fillSegment = function(ctx, cx, cy, r1, r2, th1, th2) {
        ctx.beginPath();
        this.pathSegment(ctx, cx, cy, r1, r2, th1, th2);
        ctx.fill();
    };

    this.setFillColour = function(r, g, b) {
        this.ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    };

    this.setFillHSL = function(h, s, l) {
        if (l === -1) {
            l = 0.5 + (Math.random() - 0.5) * this.scale;
        }
        h = Math.floor(h) % 360;
        s = '' + (s * 100) + '%';
        l = '' + (l * 100) + '%';
        this.ctx.fillStyle = 'hsl(' + h + ',' + s + ',' + l + ')';
    };

    /* Draw */

    this.draw = function() {
        var cx = this.canvas.width / 2;
        var cy = this.canvas.height / 2;
        var rz = this.canvas.width / 10;
        var step = 1.0 / this.numSegments;

        var fun = this.modes[this.mode];
        fun.call(this, cx, cy, rz, step);
    };
};
