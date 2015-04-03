function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "sprite-manager.js",
        "animation.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;
            var container = document.getElementById(containerId);

            var canvas = yoob.makeCanvas(container, 600, 400);

            var g = (new MinimalistCritique()).init({ canvas: canvas });
            g.start();
        };
        document.body.appendChild(elem);
    }
}

MinimalistCritique = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.reset();
        return this;
    };

    this.reset = function() {
        this.manager = (new yoob.SpriteManager()).init({ canvas: this.canvas });

        this.current = null;
        this.floorLevel = this.canvas.height;

        this.sizes = [10, 40, 200, this.canvas.width];
        this.stage = 0;

        this.addNextBlock();

        this.animation = (new yoob.Animation()).init({'object': this});
    };

    this.start = function() {
        this.animation.start();
    };

    this.addBlock = function(cfg) {
        var d = new yoob.Sprite();
        cfg.dy = 1;
        d.init(cfg);
        d.draw = function(ctx) {
            ctx.fillStyle = this.fillStyle || "green";
            ctx.fillRect(this.getLeftX(), this.getTopY(), this.getWidth(), this.getHeight());
        };
        d.fillStyle = "green";
        this.manager.addSprite(d);
        this.current = d;
    };

    this.addNextBlock = function() {
        if (this.stage >= this.sizes.length) {
            // start blinking the X
            //alert('done');
            this.animation.stop();

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); 
            this.ctx.rotate(0.125 * 2 * Math.PI);
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(
                this.canvas.width * -0.40,
                this.canvas.height * -0.05,
                this.canvas.width * 0.80,
                this.canvas.height * 0.10
            );
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); 
            this.ctx.rotate(0.375 * 2 * Math.PI);
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(
                this.canvas.width * -0.40,
                this.canvas.height * -0.05,
                this.canvas.width * 0.80,
                this.canvas.height * 0.10
            );
            this.ctx.restore();

            var $this = this;
            setTimeout(function() {
                $this.reset();
                $this.start();
            }, 1000);

            return;
        }

        this.addBlock({
            x: this.canvas.width / 2,
            y: 0 - this.sizes[this.stage] / 2,
            width: this.sizes[this.stage],
            height: this.sizes[this.stage]
        });
    };

    this.draw = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.manager.draw(this.ctx);
    };

    this.update = function() {
        this.manager.move();
        if (this.current.getBottomY() >= this.floorLevel) {
            this.current.setPosition(this.current.getX(), this.floorLevel - this.current.getHeight() / 2);
            this.floorLevel = this.floorLevel - this.current.getHeight();
            this.current.setVelocity(0, 0);
            this.stage += 1;
            this.draw();
            this.addNextBlock();
        }
    };
}
