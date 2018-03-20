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

                var canvas = yoob.makeCanvas(container, 600, 600);

                var gewgaw = new BezierKnots().init({
                    canvas: canvas,
                    lineWidth: 10,
                });

                var panel = yoob.makeDiv(container);
                var thicknessControl = yoob.makeRangeControl(panel, {
                    label: 'Line thickness:',
                    min: 1,
                    max: 30,
                    value: 10,
                    callback: function(v) {
                        gewgaw.lineWidth = v;
                        gewgaw.reset();
                    }
                });
                yoob.makeLineBreak(panel);
                var numSidesControl = yoob.makeRangeControl(panel, {
                    label: 'Number of nodes:',
                    min: 1,
                    max: 20,
                    value: 6,
                    callback: function(v) {
                        gewgaw.numSides = v;
                        gewgaw.reset();
                    }
                });
                yoob.makeLineBreak(panel);
                var numRadiiControl = yoob.makeRangeControl(panel, {
                    label: 'Number of rings:',
                    min: 1,
                    max: 20,
                    value: 6,
                    callback: function(v) {
                        gewgaw.numRadii = v;
                        gewgaw.reset();
                    }
                });
                yoob.makeLineBreak(panel);
                var resetButton = yoob.makeButton(panel, 'Reset', function() { gewgaw.reset(); });
            }
        };
        document.body.appendChild(elem);
    }
}


var QUADRANT = Math.PI / 2;
var TWO_PI = Math.PI * 2;

BezierKnots = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.lineWidth = cfg.lineWidth;
        this.numSides = cfg.numSides || 6;
        this.numRadii = cfg.numRadii || 6;

        this.reset();

        return this;
    };

    this.reset = function() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.draw();
    };

    /* Utilities */

    this.shuffled = function(a) {
        var b = [];
        while (a.length > 0) {
            b.push(a.splice(Math.random() * a.length, 1)[0]);
        }
        return b;
    };

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

    this.bezierConnect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
        // the arguments represent 2 lines, (x1,y1)-(x2,y2) and (x3,y3)-(x4,y4)

        // find their midpoints:
        var xm1 = (x1 + x2) / 2;
        var ym1 = (y1 + y2) / 2;

        var xm2 = (x3 + x4) / 2;
        var ym2 = (y3 + y4) / 2;

        this.ctx.moveTo(xm1, ym1);
        this.ctx.bezierCurveTo(
            x2, y2,
            x3, y3,
            xm2, ym2);
    };

    this.bezierConnectLines = function(l1, l2) {
        // the arguments represent 2 lines, (x1,y1)-(x2,y2) and (x3,y3)-(x4,y4)

        var x1 = l1[0][0];
        var y1 = l1[0][1];

        var x2 = l1[1][0];
        var y2 = l1[1][1];

        var x3 = l2[0][0];
        var y3 = l2[0][1];

        var x4 = l2[1][0];
        var y4 = l2[1][1];

        this.bezierConnect(x1, y1, x2, y2, x3, y3, x4, y4);
    };

    this.createRandomLine = function() {
        var x1 = Math.floor(Math.random() * this.canvas.width);
        var y1 = Math.floor(Math.random() * this.canvas.height);
        var x2 = Math.floor(Math.random() * this.canvas.width);
        var y2 = Math.floor(Math.random() * this.canvas.height);
        return [[x1, y1], [x2, y2]];
    };

    this.createLine = function(cx, cy, radius, angle1, angle2) {
        var x1 = cx + Math.cos(angle1) * radius;
        var y1 = cy + Math.sin(angle1) * radius;
        var x2 = cx + Math.cos(angle2) * radius;
        var y2 = cy + Math.sin(angle2) * radius;
        return [[x1, y1], [x2, y2]];
    };

    this.createLineSets = function(cx, cy, numSides, numRadii) {
        var sets = [];

        for (var i = 0; i < numSides; i++) {
            var lines = [];

            for (var pos = 0; pos < numRadii; pos++) {
                radius = (cx / numRadii) * (pos + 1);
                lines.push(this.createLine(
                    cx, cy, radius,
                    (i / numSides) * TWO_PI - Math.PI/2,
                    ((i + 1) / numSides) * TWO_PI - Math.PI/2
                ));
            }

            sets.push(lines);
        }

        // Now shuffle the sets.
        for (var i = 0; i < sets.length; i++) {
            sets[i] = this.shuffled(sets[i]);
        }

        return sets;
    };

    this.draw = function() {
        var cx = this.canvas.width / 2;
        var cy = this.canvas.height / 2;

        var lineSets = this.createLineSets(cx, cy, this.numSides, this.numRadii);

        var colours = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange'];

        for (var j = 0; j < lineSets.length; j++) {

            // shuffle the indexes so we don't always draw the same colours over other colours
            var indexes = [];
            for (var i = 0; i < lineSets[j].length; i++) {
                indexes.push(i);
            }
            indexes = this.shuffled(indexes);

            for (var n = 0; n < lineSets[j].length; n++) {

                i = indexes[n];

                var l1 = lineSets[j][i];
                var l2;

                if (j + 1 >= lineSets.length) {
                    l2 = lineSets[0][i];
                } else {
                    l2 = lineSets[j+1][i];
                }

                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = this.lineWidth + 3;

                this.ctx.beginPath();
                this.bezierConnectLines(l1, l2);
                this.ctx.stroke();

                this.ctx.strokeStyle = colours[i % colours.length];
                this.ctx.lineWidth = this.lineWidth;

                this.ctx.beginPath();
                this.bezierConnectLines(l1, l2);
                this.ctx.stroke();
            }
        }
    };
};
