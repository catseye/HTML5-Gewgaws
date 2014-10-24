function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
        "sprite-manager.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                container = document.getElementById(containerId);
                var overlayCanvas = yoob.makeCanvas(container, 600, 400);
                overlayCanvas.style.position = 'absolute';
                overlayCanvas.style.zIndex = 100;

                var canvas = yoob.makeCanvas(container, 600, 400);
                canvas.style.zIndex = 0;

                container.appendChild(document.createElement('br'));
                var show_blue = yoob.makeCheckbox(
                    container, 'show_blue', "blue"
                );
                var show_red = yoob.makeCheckbox(
                    container, 'show_red', "red"
                );
                var show_yellow = yoob.makeCheckbox(
                    container, 'show_yellow', "yellow"
                );
                var show_path = yoob.makeCheckbox(
                    container, 'show_path', "path"
                );
                show_path.onchange = function(e) {
                    overlayCanvas.style.display =
                      show_path.checked ? "block" : "none";
                };
                var turbo = yoob.makeCheckbox(
                    container, 'turbo', "turbo"
                );

                var t = new Hypongtrochoid();

                show_blue.onchange = function() {
                    t.blueRectangle.visible = show_blue.checked;
                };
                show_red.onchange = function() {
                    t.redRectangle.visible = show_red.checked;
                };
                show_yellow.onchange = function() {
                    t.yellowRectangle.visible = show_yellow.checked;
                };
                turbo.onchange = function() {
                    t.setTurbo(turbo.checked);
                };

                t.init(canvas, overlayCanvas);
            }
        };
        document.body.appendChild(elem);
    }
}

// this still knows maybe a little too much about the internals of yoob.Sprite
Rectangle = function() {
    this.init = function(x, y, dx, dy, w, h, style, relativeTo) {
        this.moveTo(x, y);
        this.setVelocity(dx, dy);
        this.w = w;
        this.h = h;
        this.style = style;
        this.relativeTo = relativeTo;
        this.visible = true;
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
        if (this.visible) {
            ctx.fillStyle = this.style;
            ctx.fillRect(
                this.getX(), this.getY(), this.getWidth(), this.getHeight()
            );
        }
    };
};

Hypongtrochoid = function() {
    var canvas;
    var overlayCanvas;
    var ctx;
    var overlayCtx;
    var turbo = false;

    var manager = new yoob.SpriteManager();

    this.setTurbo = function(b) {
        turbo = b;
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        manager.draw(ctx);
    };

    this.update = function() {
        var n = turbo ? 10 : 1;
        for (var i = 0; i < n; i++) {
            manager.move();
        }
    };

    this.init = function(c, oc) {
        Rectangle.prototype = new yoob.Sprite();

        canvas = c;
        overlayCanvas = oc;
        manager.init(canvas);
        ctx = canvas.getContext('2d');
        overlayCtx = overlayCanvas.getContext('2d');

        var outside = new Rectangle();
        outside.init(
            0, 0, 0, 0, canvas.width, canvas.height, '', null
        );

        this.blueRectangle = new Rectangle();
        this.blueRectangle.init(
            50, 50, -1, 1, 200, 200, 'blue', outside
        );
        manager.addSprite(this.blueRectangle);

        this.redRectangle = new Rectangle();
        this.redRectangle.init(
            50, 50, -0.75, 0.75, 50, 50, 'red', this.blueRectangle
        );
        manager.addSprite(this.redRectangle);

        this.yellowRectangle = new Rectangle();
        this.yellowRectangle.init(
            10, 10, 0.5, -0.5, 10, 10, 'yellow', this.redRectangle
        );
        this.yellowRectangle.scrawlOn = overlayCtx;
        manager.addSprite(this.yellowRectangle);

        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };
}
