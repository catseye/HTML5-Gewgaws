function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
        "full-screen-detector.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var t = new Cyclobots();
                var canvas = yoob.makeCanvas(container, 640, 480);
                container.appendChild(document.createElement('br'));
                var showAngles = yoob.makeCheckbox(
                    container, false, "show angles", t.setDrawAngles
                );
                var button = yoob.makeButton(container, 'Revolution!');
                button.onclick = function() {
                    t.shuffle();
                };
                t.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

var twopi = Math.PI * 2;
var degrees = twopi / 360;

Cyclobot = function() {
    this.init = function(x, y, theta, speed, dexterity, next) {
        this.x = x;
        this.y = y;
        this.theta = theta; // radians = (degrees / 360) * (Math.PI * 2);
        this.speed = speed;
        this.dexterity = dexterity; // radians
        this.next = next;
        this.radius = 10;
        this.style = "red";
    };

    this.move = function() {
        var dx = this.speed * Math.cos(this.theta);
        var dy = this.speed * Math.sin(this.theta);

        this.x += dx;
        this.y += dy;
    };

    this.adjust = function() {
        var rho = Math.atan2(this.y - this.next.y, this.x - this.next.x) + Math.PI;
        this.rho_deg = Math.floor(rho / degrees);

        this.theta_deg = Math.floor(this.theta / degrees);

        // stolen from http://prog21.dadgum.com/96.html
        var angle_diff = (this.rho_deg - this.theta_deg + 540) % 360 - 180;
        if (angle_diff < 0) {
            this.theta -= this.dexterity;
            //this.style = "blue";
        } else {
            this.theta += this.dexterity;
            //this.style = "red";
        }
        if (this.theta <= 0) this.theta += twopi;
        if (this.theta > twopi) this.theta -= twopi;
    };

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.style;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    };

    this.drawAngles = function(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.moveTo(this.x, this.y);
        var dx = this.radius * Math.cos(this.theta);
        var dy = this.radius * Math.sin(this.theta);
        ctx.lineTo(this.x + dx, this.y + dy);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.next.x, this.next.y);
        ctx.stroke();
    };
};

Cyclobots = function() {
    var ctx = undefined;
    var canvas = undefined;
    var selected = undefined;

    var bots = [];
    var numbots = 50;
    var drawAngles = false;
    var dragging;
    var lastX = undefined;
    var lastY = undefined;

    this.init = function(c) {
        canvas = c;
        ctx = canvas.getContext("2d");

        for (var i = 0; i < numbots; i++) {
            bots[i] = new Cyclobot();
            bots[i].init(
              /*x*/50 + Math.random() * (canvas.width - 100),
              /*y*/50 + Math.random() * (canvas.height - 100),
              /*theta*/Math.random() * twopi,
              /*speed*/2,
              /*dexterity*/2 * degrees, null
            );
        }
        for (var i = 0; i < numbots-1; i++) {
            bots[i].next = bots[i+1];
        }
        bots[numbots-1].next = bots[0];

        var self = this;
        canvas.addEventListener('mousedown', function(e) {
            dragging = true;
            lastX = e.pageX - canvas.offsetLeft;
            lastY = e.pageY - canvas.offsetTop;
            canvas.style.cursor = "move";
            e.preventDefault();
        });
        canvas.addEventListener('mouseup', function(e) {
            dragging = false;
            canvas.style.cursor = "auto";
            e.preventDefault();
        });
        canvas.addEventListener('mousemove', function(e) {
            if (dragging) {
                var newX = e.pageX - canvas.offsetLeft;
                var newY = e.pageY - canvas.offsetTop;
                var deltaX = newX - lastX;
                var deltaY = newY - lastY;
                self.scroll(deltaX, deltaY);
                lastX = newX;
                lastY = newY;
            }
            e.preventDefault();
        });

        canvas.addEventListener('touchstart', function(e) {
            var t = e.touches[0];
            dragging = true;
            lastX = t.pageX - canvas.offsetLeft;
            lastY = t.pageY - canvas.offsetTop;
            canvas.style.cursor = "move";
            e.preventDefault();
        });
        canvas.addEventListener('touchend', function(e) {
            dragging = false;
            canvas.style.cursor = "auto";
            e.preventDefault();
        });
        canvas.addEventListener('touchmove', function(e) {
            if (dragging) {
                var t = e.touches[0];
                var newX = t.pageX - canvas.offsetLeft;
                var newY = t.pageY - canvas.offsetTop;
                var deltaX = newX - lastX;
                var deltaY = newY - lastY;
                self.scroll(deltaX, deltaY);
                lastX = newX;
                lastY = newY;
            }
            e.preventDefault();
        });

        this.animation = (new yoob.Animation()).init({
            object: this
        });
        this.animation.start();
    };

    this.setDrawAngles = function(b) {
        drawAngles = b;
    };

    this.selectABot = function(canvasX, canvasY) {
        var selected = undefined;
        for (var i = 0; i < numbots; i++) {
            if (Math.abs(canvasX - bots[i].x) < bots[i].radius &&
                Math.abs(canvasY - bots[i].y) < bots[i].radius) {
                selected = i;
                break;
            }
        }
        if (selected !== undefined) {
            var bot = bots[selected];
            alert("#" + selected + " x=" + bot.x + " y=" + bot.y +
                  " theta=" + bot.theta_deg + " rho=" +
                  bot.rho_deg + " adiff=" + bot.adiff / degrees);
        }
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < bots.length; i++) {
            var bot = bots[i];
            bot.draw(ctx);
            if (drawAngles) {
                bot.drawAngles(ctx);
            }
        }
    };

    this.update = function() {
        for (var i = 0; i < bots.length; i++) {
            var bot = bots[i];
            bot.move();
            bot.adjust();
        }
    };

    this.scroll = function(dx, dy) {
        for (var i = 0; i < numbots; i++) {
            bots[i].x += dx;
            bots[i].y += dy;
        }
    };

    this.massConfusion = function() {
        for (var i = 0; i < numbots-1; i++) {
            bots[i].theta = Math.random() * twopi;
        }
    };

    this.shuffle = function() {
        var newBots = [];
        while (bots.length > 0) {
            newBots.push(bots.splice(Math.random() * bots.length, 1)[0]);
        }        
        bots = newBots;
        for (var i = 0; i < numbots-1; i++) {
            bots[i].next = bots[i+1];
        }
        bots[numbots-1].next = bots[0];
    };
};
