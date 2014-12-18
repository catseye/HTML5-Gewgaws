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
                var canvas = yoob.makeCanvas(container, 800, 400);
                yoob.makeLineBreak(container);
                var t = new CircusXamulus();
                yoob.makeButton(container, "Reset", function() { t.reset(); });
                t.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

var twoPi = Math.PI * 2;
var degrees = twoPi / 360;

Circle = function() {
    this.init = function(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.drawn = false;
    };

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.stroke();
        this.drawn = true;

        if (false) {
            /* pick two points on the circle and draw a chord */
            if (this.r > 30) {
                var th1 = Math.random() * twoPi;
                var x1 = this.x + Math.cos(th1) * this.r;
                var y1 = this.y + Math.sin(th1) * this.r;
                var th2 = Math.random() * twoPi;
                var x2 = this.x + Math.cos(th2) * this.r;
                var y2 = this.y + Math.sin(th2) * this.r;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
    };
};

CircusXamulus = function() {
    var ctx;
    var canvas;
    var circles;

    this.init = function(c) {
        canvas = c;
        ctx = canvas.getContext("2d");
        this.reset();
        this.animation = (new yoob.Animation()).init({
            object: this,
            tickTime: 1000.0 / 50.0
        }).start();
    };
    
    this.reset = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles = [];
    };

    this.draw = function() {
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            if (!circle.drawn) {
                circle.draw(ctx);
            }
        }
    };

    this.update = function() {
        if (circles.length > 2000) return;
        var c = new Circle();
        var tries = 0;
        var done = false;
        while (!done && tries < 100) {
            tries++;
            done = true;
            var r = Math.floor(Math.random() * 50);
            var x = r + Math.random() * (canvas.width - r*2);
            var y = r + Math.random() * (canvas.height - r*2);
            for (var i = 0; i < circles.length; i++) {
                var k = circles[i];
                var dx = x - k.x;
                var dy = y - k.y;
                var d = Math.sqrt(dx*dx + dy*dy);
                if (d < k.r) {
                    done = false;
                    break;
                } else if (r > (d - k.r)) {
                    r = (d - k.r);
                }
            }
        }
        c.init(x, y, r);
        circles.push(c);
    };
};
