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
                (new Radialjective()).init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

var twopi = Math.PI * 2;
var degrees = twopi / 360;

Radialjective = function() {
    var ctx = undefined;
    var canvas = undefined;
    var info;

    var t = 0;

    this.init = function(c) {
        canvas = c;
        ctx = canvas.getContext("2d");

        this.animation = (new yoob.Animation).init({
            object: this
        });
        this.animation.start();
    };

    this.update = function() {
        t += 1;
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;

        var f = function(a, t) {
            return Math.sin(Math.sin(a / 20) + t / 20) * 20 * Math.sin(a / 10) * Math.cos(t / 100);
        };

        // LINE 1: theta is a function of r.
        ctx.beginPath();
        for (var r = 0; r <= cx; r++) {
            var theta = f(r, t) / 8;
            var x = cx + r * Math.cos(theta);
            var y = cy + r * Math.sin(theta);
            ctx.lineTo(x, y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();

        // LINE 2: r is a function of theta.
        ctx.beginPath();
        for (var theta = 0; theta <= twopi; theta += (twopi / cx)) {
            var r = f(theta * (cx / twopi), t);
            var x = cx + r * Math.cos(theta);
            var y = cy + r * Math.sin(theta);
            ctx.lineTo(x, y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "green";
        ctx.stroke();

        // LINE 2a: r is a function of theta.
        ctx.beginPath();
        for (var theta = 0; theta <= twopi; theta += (twopi / cx)) {
            var r = f(theta * (cx / twopi), t) * 10;
            var x = cx + r * Math.cos(theta);
            var y = cy + r * Math.sin(theta);
            ctx.lineTo(x, y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#00ff30";
        ctx.stroke();

        // LINE 3: y is a function of x.
        ctx.beginPath();
        for (var x = 0; x <= cx; x++) {
            var y = cy - f(x, t);
            ctx.lineTo(cx + x, y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        ctx.stroke();

        // LINE 4: theta is a function of r, but projected onto a cone.
        ctx.beginPath();
        for (var r = 0; r <= cx; r++) {
            var theta = f(r, t) / 8;
            var x = cx + r * Math.cos(theta);
            var y = cy + r;
            ctx.lineTo(x, y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.stroke();

    };
};
