var showPath = document.getElementById('show_path');
var showBlue = document.getElementById('show_blue');
var showRed = document.getElementById('show_red');
var showYellow = document.getElementById('show_yellow');

var turbo = document.getElementById('turbo');

// this still knows maybe a little too much about the internals of yoob.Sprite
Rectangle = function() {
    this.init = function(x, y, dx, dy, w, h, style, checkbox, relativeTo) {
        this.moveTo(x, y);
        this.setVelocity(dx, dy);
        this.w = w;
        this.h = h;
        this.style = style;
        this.checkbox = checkbox;
        this.relativeTo = relativeTo;
    };

    this.onmove = function() {
        var x = this.x;
        var y = this.y;
        if (this.scrawlOn !== undefined) {
            if (this.lastX !== undefined) {
                var ctx = this.scrawlOn;
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                ctx.lineWidth = 2;
                ctx.moveTo(this.lastX, this.lastY);
                ctx.lineTo(this.getCenterX(), this.getCenterY());
                ctx.stroke();
            }
            this.lastX = this.getCenterX();
            this.lastY = this.getCenterY();
        }
        if (x < 0 || x + this.getWidth() > this.relativeTo.getWidth()) {
            this.dx *= -1;
        }
        if (y < 0 || y + this.getHeight() > this.relativeTo.getHeight()) {
            this.dy *= -1;
        }
    };
    
    this.getX = function() {
        if (this.relativeTo !== null) {
            return this.x + this.relativeTo.getX();
        } else {
            return this.x;
        }
    };

    this.getCenterX = function() {
        return this.getX() + this.getWidth() / 2;
    };

    this.getY = function() {
        if (this.relativeTo !== null) {
            return this.y + this.relativeTo.getY();
        } else {
            return this.y;
        }
    };

    this.getCenterY = function() {
        return this.getY() + this.getHeight() / 2;
    };

    this.draw = function(ctx) {
        if (this.checkbox && !this.checkbox.checked) return;
        ctx.fillStyle = this.style;
        ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    };
};
Rectangle.prototype = new yoob.Sprite();

Hypongtrochoid = function() {
    var canvas;
    var overlayCanvas;
    var ctx;
    var overlayCtx;

    var manager = new yoob.SpriteManager();

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        manager.draw(ctx);
    };

    this.update = function() {
        var n = turbo.checked ? 10 : 1;
        for (var i = 0; i < n; i++) {
            manager.move();
        }
    };

    this.start = function(c, oc) {
        canvas = c;
        overlayCanvas = oc;
        manager.init(canvas);
        ctx = canvas.getContext('2d');
        overlayCtx = overlayCanvas.getContext('2d');

        var outside = new Rectangle();
        outside.init(0, 0, 0, 0, canvas.width, canvas.height, '', undefined, null);

        var blueRectangle = new Rectangle();
        blueRectangle.init(50, 50, -1, 1, 200, 200, 'blue', show_blue, outside);
        manager.addSprite(blueRectangle);

        var redRectangle = new Rectangle();
        redRectangle.init(50, 50, -0.75, 0.75, 50, 50, 'red', show_red, blueRectangle);
        manager.addSprite(redRectangle);

        var yellowRectangle = new Rectangle();
        yellowRectangle.init(10, 10, 0.5, -0.5, 10, 10, 'yellow', show_yellow, redRectangle);
        yellowRectangle.scrawlOn = overlayCtx;
        manager.addSprite(yellowRectangle);

        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };
}
