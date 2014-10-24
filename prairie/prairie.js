function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var t = new Prairie();
                var canvas = yoob.makeCanvas(container, 640, 390);
                // PREFIXME
                t.init(canvas,
                  'Elevator_1_(PSF).png'
                );
            }
        };
        document.body.appendChild(elem);
    }
}

Prairie = function() {
    var canvas;
    var ctx;
    var animCfg = {};

    var img = new Image();
    var shapes = new Array();
    var NUM_SHAPES = 100;

    var new_shape = function(i) {
        var size = Math.floor(Math.random() * 80) + 20;
        shapes[i].w = size;
        shapes[i].x = 0 - size;
        shapes[i].y = Math.floor(Math.random() * (canvas.height - size));
        shapes[i].v = Math.random() * 8 + 1;
        shapes[i].alpha = Math.random() * 0.66;
    };

    this.draw = function(timeElapsed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        for (var i = 0; i < NUM_SHAPES; i++) {
            ctx.beginPath();
            ctx.fillStyle="rgba(255, 255, 0, " + shapes[i].alpha + ")";
            ctx.moveTo(shapes[i].x, shapes[i].y);
            ctx.lineTo(shapes[i].x + shapes[i].w, shapes[i].y + shapes[i].w / 2);
            ctx.lineTo(shapes[i].x, shapes[i].y + shapes[i].w);
            ctx.closePath();
            ctx.fill();
            shapes[i].x += shapes[i].v * (timeElapsed / (1000.0 / 60.0));
            if (shapes[i].x > canvas.width) {
                new_shape(i);
            }
        }
    };

    this.init = function(c, imgurl) {
        canvas = c;
        ctx = canvas.getContext('2d');
        for (var i = 0; i < NUM_SHAPES; i++) {
            shapes[i] = {};
            new_shape(i);
        }
        this.animation = (new yoob.Animation()).init({
            object: this,
            mode: 'proportional'
        });
        var $this = this;
        img.onload = function() {
            $this.animation.start();
        };
        img.src = imgurl;
    };
}
