var originX;
var x;

var walker;
var indicator;
var history;

var cardsRemaining;

Walker = function() {
    this.init(0, 0, 40, 40);
    this.dist = 0;
    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.arc(this.getCenterX(), this.getCenterY(),
                this.getWidth() / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    this.onreachdestination = function() {
        this.setVelocity(0, 0);
        indicator.dist = this.dist;
        if (cardsRemaining === 0) indicator.dist = 0;
        indicator.moveTo(this.getCenterX(), this.getY());
    };
};
Walker.prototype = new yoob.Sprite();

Indicator = function() {
    this.init(0, 0, 0, 0);
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
Indicator.prototype = new yoob.Sprite();

Card = function(color, faceUp) {
    this.color = color;
    this.faceUp = faceUp;

    this.isClickable = true;

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
        history.push(x);
        walker.setDestination(originX + x - walker.getWidth() / 2, walker.getY(), 30);
        this.faceUp = true;
        cardsRemaining--;
    };

    this.draw = function(ctx) {
        if (!this.faceUp) {
            var gradient = ctx.createLinearGradient(
                this.getX(), this.getY(),
                this.getX() + this.getWidth(),
                this.getY() + this.getHeight()
            );
            gradient.addColorStop(0.0, "red");
            gradient.addColorStop(0.5, "white");
            gradient.addColorStop(1.0, "blue");
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.getX(), this.getY(),
                     this.getWidth(), this.getHeight());
    };
};
Card.prototype = new yoob.Sprite();

function shuffle(array) {
    var a = [];
    while (array.length > 0) {
        a.push(array.splice(Math.random() * array.length, 1)[0]);
    }
    return a;
}

NonRandomWalk = function() {
    var canvas;
    var ctx;
    var request;

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
        ctx.moveTo(originX + history[0], y);
        for (var i = 1; i < history.length; i++) {
            ctx.lineTo(originX + history[i], y + i * 10);
        }
        ctx.stroke();
    };

    this.update = function() {
        manager.move();
    };

    this.reset = function() {
        x = 250;
        y = 100;
        targetX = 23.73046875 * (x / 100);
        originX = canvas.width / 8;
        history = [x];
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
            var cardX = (i % 13) * (cardW * 1.5);
            var cardY = 230 + (Math.floor(i / 13)) * 30;
            card.init(cardX, cardY, cardW, cardH);
            manager.addSprite(card);
        }
        walker.moveCenterTo(originX + x, y - walker.getHeight() / 2);
        indicator.dist = Math.abs(x) / 2;
        indicator.moveTo(walker.getCenterX(), walker.getY());
    };

    this.init = function(c) {
        canvas = c;
        ctx = canvas.getContext('2d');
        var self = this;

        manager = new yoob.SpriteManager();
        manager.init(canvas);
        walker = new Walker();
        manager.addSprite(walker);
        indicator = new Indicator();
        manager.addSprite(indicator);

        this.reset();
        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };
}
