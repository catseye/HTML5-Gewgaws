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
                var canvas = yoob.makeCanvas(container, 1200, 400);
                yoob.makeParagraph(container,
                  "PLATE I. THE ORGANIZATION OF COLLAPSED CLARKSON'S " +
                  "ENTITIES (<i>Heronsis hermnonicii</i>) INTO " +
                  "PROTO-COHORTS AS A RUDIMENTARY METHOD OF PHYSIOGNOMETRIC " +
                  "DEFENCE");
                var t = new HeronsisHermnonicii();
                t.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

var canvas;

Floater = function() {
    this.isClickable = true;
    this.counter = 0;
    this.rate = 0.07;
    this.maxRate = 2;

    this.getCenterX = function() {
        var range = this.getWidth()
        if (this.rate > this.maxRate * 0.75) {
            range *= 2;
        }
        return this.x + this.getWidth() / 2 +
            Math.cos(this.counter) * range;
    };

    this.draw = function(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = this.getWidth() / 20;

        ctx.beginPath();
        var anchorDist = 500;
        ctx.moveTo(this.x + this.getWidth() / 2, this.getCenterY() - anchorDist);
        ctx.lineTo(this.getCenterX(), this.getCenterY());
        ctx.lineTo(this.x + this.getWidth() / 2, this.getCenterY() + anchorDist);
        ctx.stroke();
        
        ctx.beginPath();
        var red = 255;
        var blue = Math.floor(this.rate * 500);
        var green = 0;
        if (blue < 0) blue = 0;
        if (blue > 255) {
            blue = 0;
            green = Math.floor(this.rate * 150);
            if (green > 255) {
                red = 255;
                green = 255;
                blue = 255;
            }
        }
        if (this.rate > this.maxRate) {
            red = 0;
            green = 0;
            blue = 0;
        }
        s = "rgba(" + red + ", " + green + ", " + blue + ", 1.0)";
        ctx.fillStyle = s;
        ctx.arc(this.getCenterX(), this.getCenterY(),
                this.getWidth() / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, " + ((100-this.getWidth()) / 200) + ")";
        ctx.arc(this.getCenterX(), this.getCenterY(),
                this.getWidth() / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    };
    
    this.move = function() {
        this.counter += this.rate * 0.66;
        if (this.rate > 0.07) this.rate -= 0.01;
    };

    this.onclick = function() {
        this.rate *= 3;
        if (this.rate > this.maxRate) {
            this.rate = this.maxRate;
        }
    };

    this.containsPoint = function(x, y) {
      var r = this.getWidth() / 2;
      var dx = x - this.getCenterX();
      var dy = y - this.getCenterY();
      var dist = dx * dx + dy * dy;
      return dist < r * r;
    };
};

HeronsisHermnonicii = function() {
    var ctx;
    var request;

    var manager;
    var landscape = [];
    var treescape = [];

    this.draw = function() {
        ctx.fillStyle = "#ddccff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffdd66";
        var s = canvas.width / (landscape.length - 1);
        for (var i = 0; i < landscape.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * s - 1, landscape[i]);
            ctx.lineTo(i * s - 1, canvas.height);
            ctx.lineTo((i+1) * s, canvas.height);
            ctx.lineTo((i+1) * s, landscape[i+1]);
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = "#88ffaa";
        var s = canvas.width / (treescape.length - 1);
        for (var i = 0; i < treescape.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * s - 1, treescape[i]);
            ctx.lineTo(i * s - 1, canvas.height);
            ctx.lineTo((i+1) * s, canvas.height);
            ctx.lineTo((i+1) * s, treescape[i+1]);
            ctx.closePath();
            ctx.fill();
        }

        // draw sprites
        manager.draw(ctx);
    };

    this.update = function() {
        manager.move();
    };

    this.init = function(c) {
        Floater.prototype = new yoob.Sprite();

        canvas = c;
        ctx = canvas.getContext('2d');

        manager = new yoob.SpriteManager();
        manager.init(canvas);

        var closeness = 5;
        for (var i = 1; i < 30; i++) {
            var f = new Floater();
            var w = closeness;
            var x = Math.random() * (canvas.width - w * 2);
            var y = Math.random() * (canvas.height - w * 2);
            f.init(x, y, w, w);
            f.counter = Math.random() * Math.PI * 2;
            manager.addSprite(f);
            closeness *= 1.1;
        }

        for (var i = 0; i < 10; i += 1) {
            landscape[i] = canvas.height / 2 + (Math.random() * 60 - 30);
        }

        for (var i = 0; i < 30; i += 1) {
            treescape[i] = canvas.height * 0.75 + (Math.random() * 60 - 30);
        }

        // TODO might be better with a ProportionalAnimationFrame,
        // but yoob.Sprite needs to support that better first
        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };
}
