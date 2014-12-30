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
                var t = new Chzrxl();
                var canvas = yoob.makeCanvas(container, 500, 500);
                yoob.makeLineBreak(container);
                var button = yoob.makeButton(container, 'Restart', function() {
                    t.restart();
                });
                container.appendChild(document.createTextNode("Percent to hold fixed:"));
                var slider = yoob.makeSlider(container, 0, 100, 10, function(v) {
                    t.setPercentToHoldFixed(v);
                });
                t.init({
                    'canvas': canvas,
                    'percentToHoldFixed': 10
                });
            }
        };
        document.body.appendChild(elem);
    }
}

var twopi = Math.PI * 2;
var degrees = twopi / 360;

var balls = [];

Ball = function() {
    this.init = function(x, y, pt1, pt2, rate, phase, radius, style) {
        this.x = x;
        this.y = y;
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.style = style;
        this.radius = radius;
        this.rate = rate;
        this.phase = phase;
        return this;
    };

    this.updateXY = function(p) {
        // p is between 0.0 (at pt1) and 1.0 (at pt2)
        var x1 = balls[this.pt1].x;
        var x2 = balls[this.pt2].x;
        this.x = (x2 - x1) * p + x1; //  + Math.random() * 30 - this.tendency;
        var y1 = balls[this.pt1].y;
        var y2 = balls[this.pt2].y;
        this.y = (y2 - y1) * p + y1; //  + Math.random() * 30 - this.tendency;
    };

    this.getPct = function(t) {
        return (Math.sin((t + this.phase) / this.rate) + 1) / 2;
    };

    this.draw = function(ctx, t) {
        ctx.beginPath();
        ctx.fillStyle = this.style;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    };
};
  
Chzrxl = function() {
    var ctx = undefined;
    var canvas = undefined;
    var numBalls = 200;
    var pctToHoldFixedCtrl;
    var options;
    var percentToHoldFixed;

    var t = 0;

    this.init = function(opts) {
        options = opts || {};

        canvas = options.canvas;
        ctx = canvas.getContext("2d");

        percentToHoldFixed = options.percentToHoldFixed || 10;

        this.restart();
        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };

    this.restart = function() {
        balls = [];
        for (var i = 0; i < numBalls; i++) {
            var x = Math.random() * canvas.width;
            var y = Math.random() * canvas.height;
            var pt1 = i;
            var pt2;
            while (pt1 === i || pt2 === i || pt2 === pt1) {
               pt1 = Math.floor(Math.random() * numBalls);
               pt2 = Math.floor(Math.random() * numBalls);
            }
            var rate = Math.random() * 100 + 100;
            var phase = Math.floor(Math.random() * 110);
            var radius = Math.floor(Math.random() * 10) + 5;
            var style = "hsl(" + Math.floor(Math.random() * 256) + ",10%,50%)";
            var ball = new Ball().init(x, y, pt1, pt2, rate, phase, radius, style);
            ball.tendency = 14 + Math.random() * 2;
            balls.push(ball);
        }
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < balls.length; i++) {
            balls[i].draw(ctx, t);
        }
    };

    this.update = function() {
        var numFixed = balls.length * (percentToHoldFixed / 100);
        for (var i = 0; i < balls.length; i++) {
            if (i < numFixed) continue;
            balls[i].updateXY(balls[i].getPct(t));
        }
        t += 1;
    };

    this.setPercentToHoldFixed = function(value) {
        percentToHoldFixed = value;
    };
};
