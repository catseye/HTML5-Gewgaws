PrairieController = function() {
    var canvas;
    var request;

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
    }

    this.draw = function() {
        var ctx = canvas.getContext('2d');

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
            shapes[i].x += shapes[i].v;
            if (shapes[i].x > canvas.width) {
                new_shape(i);
            }
        }
    }

    this.start = function(c, imgurl) {
        canvas = c;
        for (var i = 0; i < NUM_SHAPES; i++) {
            shapes[i] = {};
            new_shape(i);
        }
        var $this = this;
        img.onload = function() {
            $this.draw();
            var animFrame = function(time) {
                $this.draw();
                request = requestAnimationFrame(animFrame);
            };
            request = requestAnimationFrame(animFrame);
        };
        img.src = imgurl;
    }

    this.stop = function() {
        if (request === undefined)
            return;
        cancelRequestAnimationFrame(request);
        request = undefined;
    }
}
