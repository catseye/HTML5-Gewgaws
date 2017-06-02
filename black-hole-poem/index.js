"use strict";

function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "animation.js",
        "sprite-manager.js",
        "canvas-resizer.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var t = new BlackHolePoem();
                var initialized = false;
                config.canvas = yoob.makeCanvas(container, 800, 450);
                var cr = (new yoob.CanvasResizer()).init({
                    canvas: config.canvas,
                    onResizeEnd: function() {
                        if (!initialized) {
                            t.init(config);
                            initialized = true;
                        }
                        t.draw();
                    },
                    desiredWidth: 800,
                    desiredHeight: 450
                }).register();
            }
        };
        document.body.appendChild(elem);
    }
}

var makeText = function(cfg) {
    var sprite = (new yoob.Sprite()).init({
        x: cfg.x,
        y: cfg.y,
        width: 30,
        height: 30,
        isDraggable: true
    });

    sprite.font = cfg.font || "64px Arial,Sans-serif";
    sprite.text = cfg.text;
    sprite.anchorX = cfg.anchorX;
    sprite.anchorY = cfg.anchorY;

    sprite.draw = function(ctx) {
        ctx.fillStyle = "#432e2a";
        ctx.fillRect(this.getLeftX(), this.getTopY(), this.getWidth(), this.getHeight());

        ctx.textBaseline = "middle";
        ctx.font = this.font;
        ctx.fillStyle = "black";

        var x = this.getX();
        var endX = this.anchorX();
        var y = this.getY();
        var endY = this.anchorY();

        for (var i = 0; i < this.text.length; i++) {
            var c = this.text.charAt(i);
            if (c===' ') continue;
            var width = ctx.measureText(c).width;
            var textX = x - width / 2;
            ctx.fillText(c, textX, y);
            x += (endX - x) / 2;
            y += (endY - y) / 2;
        }
    };

    cfg.manager.addSprite(sprite);
    return sprite;
};

var BlackHolePoem = function() {
    var canvas;
    var ctx;
    var manager;
    var texts;

    this.draw = function() {
        // Illuminant E: #D3BEBA
        ctx.fillStyle = "#816660";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        manager.draw(ctx);
    };

    this.update = function() {
    };

    this.init = function(config) {
        canvas = config.canvas;
        ctx = canvas.getContext("2d");

        var anchorX = function() { return canvas.width / 2; };
        var anchorY = function() { return canvas.height / 2; };

        manager = (new yoob.SpriteManager()).init({ canvas: canvas });
        texts = [];
        texts.push(makeText({
            text: "A billion light-years",
            manager: manager,
            x: 20,
            y: 20,
            anchorX: anchorX,
            anchorY: anchorY
        }));

        texts.push(makeText({
            text: "Distant and unseen",
            manager: manager,
            x: canvas.width - 20,
            y: canvas.height - 20,
            anchorX: anchorX,
            anchorY: anchorY
        }));

        texts.push(makeText({
            text: "Relative to nothing",
            manager: manager,
            x: 20,
            y: canvas.height - 20,
            anchorX: anchorX,
            anchorY: anchorY
        }));

        texts.push(makeText({
            text: "Unequalled forces",
            manager: manager,
            x: canvas.width - 20,
            y: 20,
            anchorX: anchorX,
            anchorY: anchorY
        }));

        var $this = this;
        $this.animation = (new yoob.Animation()).init({
            object: $this
        });
        $this.animation.start();
    };
};
