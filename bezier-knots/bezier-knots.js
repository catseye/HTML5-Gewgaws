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
var DEGREE = TWO_PI / 360.0;


Segment = function() {
    this.init = function(cx, cy, radius, angle1, angle2) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.angle1 = angle1;
        this.angle2 = angle2;
        return this;
    }

    this.getLine = function(tweak) {
        var angle1 = this.angle1 + tweak;
        var angle2 = this.angle2 + tweak;
        var x1 = this.cx + Math.cos(angle1) * this.radius;
        var y1 = this.cy + Math.sin(angle1) * this.radius;
        var x2 = this.cx + Math.cos(angle2) * this.radius;
        var y2 = this.cy + Math.sin(angle2) * this.radius;
        return [[x1, y1], [x2, y2]];
    };

    this.drawConnectTo = function(ctx, nextSegment) {
        var l1 = this.getLine(DEGREE * -0.5);
        var l2 = nextSegment.getLine(DEGREE * 0.5);

        // the arguments represent 2 lines, (x1,y1)-(x2,y2) and (x3,y3)-(x4,y4)

        var x1 = l1[0][0];
        var y1 = l1[0][1];

        var x2 = l1[1][0];
        var y2 = l1[1][1];

        var x3 = l2[0][0];
        var y3 = l2[0][1];

        var x4 = l2[1][0];
        var y4 = l2[1][1];

        // find their midpoints:
        var xm1 = (x1 + x2) * 0.50;
        var ym1 = (y1 + y2) * 0.50;

        var xm2 = (x3 + x4) * 0.50;
        var ym2 = (y3 + y4) * 0.50;

        ctx.moveTo(xm1, ym1);
        ctx.bezierCurveTo(
            x2, y2,
            x3, y3,
            xm2, ym2
        );
    };
};


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

    this.shuffled = function(a) {
        var b = [];
        while (a.length > 0) {
            b.push(a.splice(Math.random() * a.length, 1)[0]);
        }
        return b;
    };

    this.createSegmentSets = function(cx, cy, numSides, numRadii) {
        var sets = [];

        for (var i = 0; i < numSides; i++) {
            var segments = [];

            for (var pos = 0; pos < numRadii; pos++) {
                radius = (cx / numRadii) * (pos + 1);

                segments.push((new Segment()).init(
                    cx, cy, radius,
                    (i / numSides) * TWO_PI - Math.PI/2,
                    ((i + 1) / numSides) * TWO_PI - Math.PI/2
                ));

            }

            sets.push(segments);
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

        var segmentSets = this.createSegmentSets(cx, cy, this.numSides, this.numRadii);

        var colours = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange'];

        var minJ = 0;
        var maxJ = segmentSets.length - 1;
        //minJ = 5; maxJ = 5;
        for (var j = minJ; j <= maxJ; j++) {
            var segmentSet = segmentSets[j];

            // shuffle the indexes so we don't always draw the same colours over other colours
            var indexes = [];
            for (var i = 0; i < segmentSet.length; i++) {
                indexes.push(i);
            }
            indexes = this.shuffled(indexes);

            for (var n = 0; n < segmentSet.length; n++) {

                i = indexes[n];

                var segment = segmentSets[j][i];
                var nextSegment = segmentSets[(j+1) % segmentSets.length][i];

                drawBg = false;
                if (drawBg) {
                    this.ctx.strokeStyle = 'black';
                    this.ctx.lineWidth = this.lineWidth + 3;

                    this.ctx.beginPath();
                    segment.drawConnectTo(this.ctx, nextSegment);
                    this.ctx.stroke();
                }

                this.ctx.strokeStyle = colours[i % colours.length];
                this.ctx.lineWidth = this.lineWidth;

                this.ctx.beginPath();
                segment.drawConnectTo(this.ctx, nextSegment);
                this.ctx.stroke();
            }
        }
    };
};
