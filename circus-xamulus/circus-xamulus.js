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
                var gewgaw = new CircusXamulus().init({ canvas: canvas });
                yoob.makeButton(container, "Reset", function() { gewgaw.reset(); });
            }
        };
        document.body.appendChild(elem);
    }
}


var TWO_PI = Math.PI * 2;


Circle = function() {
    this.init = function(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.drawn = false;

        return this;
    };

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, this.r, 0, TWO_PI, false);
        ctx.stroke();
        this.drawn = true;

        if (false) {
            /* pick two points on the circle and draw a chord */
            if (this.r > 30) {
                var th1 = Math.random() * TWO_PI;
                var x1 = this.x + Math.cos(th1) * this.r;
                var y1 = this.y + Math.sin(th1) * this.r;
                var th2 = Math.random() * TWO_PI;
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

    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.reset();
        this.animation = (new yoob.Animation()).init({
            object: this,
            tickTime: 1000.0 / 50.0
        }).start();

        return this;
    };
    
    this.reset = function() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.circles = [];
    };

    this.draw = function() {
        for (var i = 0; i < this.circles.length; i++) {
            var circle = this.circles[i];
            if (!circle.drawn) {
                circle.draw(this.ctx);
            }
        }
    };

    this.update = function() {
        if (this.circles.length > 2000) return;
        var tries = 0;
        var done = false;
        while (!done && tries < 100) {
            tries++;
            done = true;
            var r = Math.floor(Math.random() * 50);
            var x = r + Math.random() * (this.canvas.width - r*2);
            var y = r + Math.random() * (this.canvas.height - r*2);
            for (var i = 0; i < this.circles.length; i++) {
                var circle = this.circles[i];
                var dx = x - circle.x;
                var dy = y - circle.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < circle.r) {
                    done = false;
                    break;
                } else if (r > (d - circle.r)) {
                    r = (d - circle.r);
                }
            }
        }
        this.circles.push(new Circle().init(x, y, r));
    };
};
