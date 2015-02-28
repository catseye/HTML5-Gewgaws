"use strict";

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
                var t = new Fingerspelling();
                var canvas = yoob.makeCanvas(container);
                canvas.style.display = "block";
                canvas.style.background = "#ccaacc";
                for (var elem = canvas; elem; elem = elem.parentElement) {
                    elem.style.border = "none";
                    elem.style.margin = "0";
                    elem.style.padding = "0";
                } 
                t.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

var Thing = function() {
    this.init = function(x, y, w, h, str, intensity, r, g, b) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.str = str;
        this.intensity = intensity;
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        return this;
    };

    this.draw = function(ctx) {
        ctx.fillStyle = "rgba(" + this.r + ", " + this.g + "," + this. b + "," + 1.0 * this.intensity + ")";
        ctx.fillText(this.str, this.x, this.y);
    };
};

var Queue = function() {
    this.init = function() {
        this.queue = [];
        return this;
    };

    this.enqueue = function(obj) {
        this.queue.push(obj);
    };

    this.dequeue = function() {
        return this.queue.shift();
    };

    this.draw = function(ctx) {
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].draw(ctx);
        }
    };

    this.fade = function(amount) {
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].intensity -= amount;
            this.queue[i].y += 1;
        }
        while (this.queue.length > 0 && this.queue[0].intensity <= 0) {
            this.queue.shift();
        }
    };
};

var Fingerspelling = function() {
    var request;
    var options;

    var canvas;
    var ctx;
    var queues = [new Queue().init(), new Queue().init()];
    var touches = [undefined, undefined];

    this.update = function() {
        for (var touchNum = 0; touchNum <= 1; touchNum++) {
            var touch = touches[touchNum];
            if (touch === undefined) continue;

            for (var i = 0; i <= 1; i++) {
                var range = 32;
                var offX = Math.random() * (range*2) - range;
                var offY = Math.random() * (range*2) - range;
                var thing = new Thing();
                var val;
                if (touchNum == 0) {
                    val = Math.floor(Math.random() * 26 + 65);
                } else {
                    val = Math.floor(Math.random() * 26 + 97);
                }
                var letter = String.fromCharCode(val);
                thing.init(touch.canvasX + offX,
                           touch.canvasY + offY, 0, 0, letter, 1.0,
                           options.red, options.green, options.blue);
                queues[touchNum].enqueue(thing);
            }
        }
        for (var touchNum = 0; touchNum <= 1; touchNum++) {
            queues[touchNum].fade(0.05);
        }
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var touchNum = 0; touchNum <= 1; touchNum++) {
            queues[touchNum].draw(ctx);
        }
        var e = document.getElementById('status');
        if (e) {
            e.innerHTML = 'Letters: ' + queue.queue.length;
        }
    };

    this.init = function(c, opts) {
        canvas = c;
        ctx = canvas.getContext("2d");
        options = opts || {};
        options.red = options.red || 0;
        options.green = options.green || 0;
        options.blue = options.blue || 0;
        
        var resizeCanvas = function() {
            var rect = canvas.getBoundingClientRect()
            var absTop = Math.round(rect.top + window.pageYOffset);
            var absLeft = Math.round(rect.left + window.pageXOffset);
            canvas.width = document.documentElement.clientWidth - absLeft * 2;
            canvas.height = document.documentElement.clientHeight - (absTop + absLeft);
            ctx.textBaseline = "top";
            ctx.font = "24px Serif";
        };
        window.addEventListener("load", resizeCanvas);
        window.addEventListener("resize", resizeCanvas);

        var mouseTN = 0;
        canvas.addEventListener('mousedown', function(e) {
            touches[mouseTN] = {};
            touches[mouseTN].canvasX = e.pageX - canvas.offsetLeft;
            touches[mouseTN].canvasY = e.pageY - canvas.offsetTop;
            e.preventDefault();
        });
        canvas.addEventListener('mouseup', function(e) {
            touches[mouseTN] = undefined;
            e.preventDefault();
        });
        canvas.addEventListener('mousemove', function(e) {
            if (touches[mouseTN] !== undefined) {
                touches[mouseTN].canvasX = e.pageX - canvas.offsetLeft;
                touches[mouseTN].canvasY = e.pageY - canvas.offsetTop;
            }
            e.preventDefault();
        });

        canvas.addEventListener('touchstart', function(e) {
            for (var touchNum = 0; touchNum <= 1; touchNum++) {
                var touch = e.touches[touchNum];
                if (touch === undefined) continue;
                touches[touchNum] = {};
                touches[touchNum].canvasX = touch.pageX - canvas.offsetLeft;
                touches[touchNum].canvasY = touch.pageY - canvas.offsetTop;
            }
            e.preventDefault();
        });
        canvas.addEventListener('touchend', function(e) {
            // not great, but ehh.
            touches = [undefined, undefined];
            e.preventDefault();
        });
        canvas.addEventListener('touchmove', function(e) {
            for (var touchNum = 0; touchNum <= 1; touchNum++) {
                var touch = e.touches[touchNum];
                if (touch === undefined) continue;
                touches[touchNum].canvasX = touch.pageX - canvas.offsetLeft;
                touches[touchNum].canvasY = touch.pageY - canvas.offsetTop;
            }
            e.preventDefault();
        });

        this.animation = (new yoob.Animation()).init({ object: this });
        this.animation.start();
    };
};
