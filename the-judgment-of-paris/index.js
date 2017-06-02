function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var canvas = yoob.makeCanvas(container, 500, 500);
                (new JudgmentOfParis()).init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

var twopi = Math.PI * 2;
var degrees = twopi / 360;

var points = [];

Ball = function() {
    this.init = function(pt1, pt2, rate, radius, style) {
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.style = style;
        this.radius = radius;
        this.rate = rate;
        return this;
    };

    this.getX = function(p, t) {
        // p is between 0.0 (at pt1) and 1.0 (at pt2)
        var x1 = points[this.pt1][0] + Math.cos(t / 10) * 50;
        var x2 = points[this.pt2][0] + Math.sin(t / 10) * 50;
        return (x2 - x1) * p + x1;
    };

    this.getY = function(p, t) {
        // p is between 0.0 (at pt1) and 1.0 (at pt2)
        var y1 = points[this.pt1][1] + Math.sin(t / 18) * 50;
        var y2 = points[this.pt2][1] + Math.cos(t / 18) * 50;
        return (y2 - y1) * p + y1;
    };

    this.draw = function(ctx, t) {
        ctx.beginPath();
        ctx.fillStyle = this.style;
        var p = (Math.sin(t / this.rate) + 1) / 2;
        var x = this.getX(p, t);
        var y = this.getY(p, t);
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    };
};

JudgmentOfParis = function() {
    var ctx = undefined;
    var canvas = undefined;
    var info;
    var balls = [];
    var numPoints = 10;
    var numBalls = 50;

    var t = 0;

    this.init = function(c) {
        canvas = c;
        ctx = canvas.getContext("2d");
        info = document.getElementById('info');
        var $this = this;

        points = [];
        for (var i = 0; i < numPoints; i++) {
            var pt = [Math.random() * canvas.width, Math.random() * canvas.height];
            points.push(pt);
        }

        balls = [];
        for (var i = 0; i < numBalls; i++) {
            var pt1 = Math.floor(Math.random() * points.length);
            var pt2 = pt1;
            while (pt2 === pt1) {
                pt2 = Math.floor(Math.random() * points.length);
            }
            var rate = Math.floor(Math.random() * 100) + 10;
            var radius = Math.floor(Math.random() * 10) + 5;
            var style = "hsl(" + Math.floor(Math.random() * 256) + ",33%,66%)";
            var ball = new Ball().init(pt1, pt2, rate, radius, style);
            balls.push(ball);
        }

        this.animation = (new yoob.Animation).init({
            object: this
        });
        this.animation.start();

        return this;
    };

    this.gradFill = function(x, y, w, h, gx1, gy1, gx2, gy2, t1, t2) {
        var linGrad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
        linGrad.addColorStop(0, "hsl(" + (t1 % 360) + ",50%,50%)");
        linGrad.addColorStop(1, "hsl(" + (t2 % 360) + ",50%,50%)");
        ctx.fillStyle = linGrad;
        ctx.fillRect(x, y, w, h);
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var cx = canvas.width / 2;
        var cy = canvas.width / 2;

        this.gradFill(0, 0, cx, cy,
                      0, 0, cx, cy,
                      t, t + 180);
        this.gradFill(cx, 0, cx, cy,
                      canvas.width, 0, cx, cy,
                      t + 90, t + 270);
        this.gradFill(0, cy, cx, cy,
                      0, canvas.height, cx, cy,
                      -t, -t + 180);
        this.gradFill(cx, cy, cx, cy,
                      canvas.width, canvas.height, cx, cy,
                      -t + 90, -t + 270);

        //if () {
        for (var i = 0; i < balls.length; i++) {
            balls[i].draw(ctx, t);
        }

        var phase = Math.floor(t / 100) % 3;
        ctx.save();
        var f = 1 + Math.sin(t / 30);
        if (phase === 0) {
            ctx.scale(f, 1);
            ctx.translate(cx / f, cy);
        } else if (phase === 1) {
            ctx.scale(1, f);
            ctx.translate(cx / f, cy);
        } else {
            ctx.scale(f, 1 / f);
            ctx.translate(cx, cy);
        }
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.arc(0, 0, (Math.log(t % cx)) * 50, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.restore();

        for (var j = 0; j < 4; j++) {
            ctx.beginPath();
            for (var i = 0; i <= 25; i++) {
                var theta = twopi * ((j * 25 + i) / 100);
                var r = 150 + Math.sin((t + (i * i)) / twopi) * 60;
                var x = cx + r * Math.cos(theta);
                var y = cy + r * Math.sin(theta);
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    };
    
    this.update = function() {
        t += 1;
    };
};
