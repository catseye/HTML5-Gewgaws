function launch(prefix, containerId) {
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
            if (++loaded < deps.length) return;

            var gewgaw = new ANonRandomWalk();
            var container = document.getElementById(containerId);
            var button = yoob.makeButton(container, 'Reset', gewgaw.reset);
            var hanger = yoob.makeDiv(container);
            var canvas = yoob.makeCanvas(hanger, 600, 400);
            var initialized = false;
            var cr = (new yoob.CanvasResizer()).init({
                canvas: canvas,
                onResizeEnd: function() {
                    if (!initialized) {
                        gewgaw.init(canvas);
                        initialized = true;
                    }
                },
                desiredWidth: 600,
                desiredHeight: 400
            }).register();
        };
        document.body.appendChild(elem);
    }
}

var originX;
var x;

var walker;
var indicator;
var cardHistory;

var cardsRemaining;

Walker = function() {
    this.init({
        x: 0, y: 0, width: 40, height: 40
    });
    this.dist = 0;
    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.arc(this.getX(), this.getY(),
                this.getWidth() / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    this.onreachdestination = function() {
        this.setVelocity(0, 0);
        indicator.dist = this.dist;
        if (cardsRemaining === 0) indicator.dist = 0;
        indicator.setPosition(this.getX(), this.getY());
    };
};

Indicator = function() {
    this.init({
        x: 0, y: 0, width: 0, height: 0
    });
    this.dist = 0;
    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.moveTo(this.getX(), this.getY());
        ctx.lineTo(this.getX() - this.dist, this.getY());
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.moveTo(this.getX(), this.getY());
        ctx.lineTo(this.getX() + this.dist, this.getY());
        ctx.stroke();
   };
};

Card = function(color, faceUp) {
    this.color = color;
    this.faceUp = faceUp;

    // TODO init() function here that calls superclass

    this.onclick = function() {
        if (this.faceUp) return;
        var dist = Math.abs(x) / 2;
        // in case walker was already moving, move indicator
        if (walker.destCounter) {
            indicator.dist = dist;
            indicator.moveTo(originX + x, walker.getY());
        }
        if (this.color === 'red') {
            x -= dist;
        } else {
            x += dist;
        }
        // new dist, will be set on indicator when walker finishes
        walker.dist = Math.abs(x) / 2;
        cardHistory.push(x);
        walker.setDestination(originX + x, walker.getY(), 30);
        this.faceUp = true;
        cardsRemaining--;
    };

    this.draw = function(ctx) {
        if (!this.faceUp) {
            var gradient = ctx.createLinearGradient(
                this.getLeftX(), this.getTopY(),
                this.getRightX(), this.getBottomY()
            );
            gradient.addColorStop(0.0, "red");
            gradient.addColorStop(0.5, "white");
            gradient.addColorStop(1.0, "blue");
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.getLeftX(), this.getTopY(),
                     this.getWidth(), this.getHeight());
    };
};

function shuffle(array) {
    var a = [];
    while (array.length > 0) {
        a.push(array.splice(Math.random() * array.length, 1)[0]);
    }
    return a;
}

ANonRandomWalk = function() {
    var canvas;
    var ctx;

    var manager;

    var y;
    var targetX;

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw floor
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // draw origin point
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(originX, y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // draw sprites
        manager.draw(ctx);

        // draw target
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(originX + targetX - 10, y + 20);
        ctx.lineTo(originX + targetX, y);
        ctx.lineTo(originX + targetX + 10, y + 20);
        ctx.stroke();
        ctx.closePath();

        // draw history
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(originX + cardHistory[0], y);
        for (var i = 1; i < cardHistory.length; i++) {
            ctx.lineTo(originX + cardHistory[i], y + i * 10);
        }
        ctx.stroke();
    };

    this.update = function() {
        manager.move();
    };

    this.reset = function() {
        manager.clearSprites();

        walker = new Walker();
        manager.addSprite(walker);
        indicator = new Indicator();
        manager.addSprite(indicator);

        x = 250;
        y = 100;
        targetX = 23.73046875 * (x / 100);
        originX = canvas.width / 8;
        cardHistory = [x];
        cardsRemaining = 10;
        var deck = [];
        for (var i = 0; i < 10; i++) {
            deck.push(new Card(i % 2 === 0 ? "red" : "black", false));
        }
        deck = shuffle(deck);
        var cardW = 40;
        var cardH = 80;
        for (var i = 0; i < 10; i++) {
            var card = deck[i];
            var cardX = (cardW * 0.75) + (i % 13) * (cardW * 1.5);
            var cardY = 280;
            card.init({
                x: cardX,
                y: cardY,
                width: cardW,
                height: cardH,
                isClickable: true
            });
            manager.addSprite(card);
        }
        walker.setPosition(originX + x, y - walker.getHeight() / 2);
        indicator.dist = Math.abs(x) / 2;
        indicator.setPosition(walker.getX(), walker.getY());
    };

    this.init = function(c) {
        /* This is kind of awful, but we can't have these as part of
           the main script, because yoob/sprite-manager.js might not be
           loaded yet. */
        Walker.prototype = new yoob.Sprite();
        Indicator.prototype = new yoob.Sprite();
        Card.prototype = new yoob.Sprite();

        canvas = c;
        ctx = canvas.getContext('2d');

        manager = (new yoob.SpriteManager()).init({
            canvas: canvas
        });

        this.reset();
        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };
}
