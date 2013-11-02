Thing = function() {
    this.init = function(x, y, w, h, str, intensity, r, g, b) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.str = str;
        this.intensity = intensity;
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        return this;
    };

    this.draw = function(ctx) {
      ctx.fillStyle = "rgba(" + this.r + ", " + this.g + "," + this. b + "," + 1.0 * this.intensity + ")";
      ctx.fillText(this.str, this.x, this.y);
    };
};

Queue = function() {
    this.init = function() {
        this.queue = [];
        return this;
    };
    this.enqueue = function(obj) {
        this.queue.push(obj);
    };
    this.dequeue = function() {
        return this.queue.shift();
    };
    this.draw = function(ctx) {
        var style;
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].draw(ctx);
        }
    };
    this.fade = function(amount) {
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].intensity -= amount;
            this.queue[i].y += 1;
        }
        while (this.queue.length > 0 && this.queue[0].intensity <= 0) {
            this.queue.shift();
        }
    };
};

Fingerspelling = function() {
    var intervalId;
    var options;

    var canvas;
    var ctx;
    var queues = [new Queue().init(), new Queue().init()];
    var touches = [undefined, undefined];

    this.draw = function() {
        for (var touchNum = 0; touchNum <= 1; touchNum++) {
            var touch = touches[touchNum];
            if (touch === undefined) continue;

            for (var i = 0; i <= 1; i++) {
                var range = 32;
                var offX = Math.random() * (range*2) - range;
                var offY = Math.random() * (range*2) - range;
                var thing = new Thing();
                var val;
                if (touchNum == 0) {
                    val = Math.floor(Math.random() * 26 + 65);
                } else {
                    val = Math.floor(Math.random() * 26 + 97);
                }
                var letter = String.fromCharCode(val);
                thing.init(touch.canvasX + offX,
                           touch.canvasY + offY, 0, 0, letter, 1.0,
                           options.red, options.green, options.blue);
                queues[touchNum].enqueue(thing);
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var touchNum = 0; touchNum <= 1; touchNum++) {
            queues[touchNum].draw(ctx);
            queues[touchNum].fade(0.05);
        }
        var e = document.getElementById('status');
        if (e) {
            e.innerHTML = 'Letters: ' + queue.queue.length;
        }
    };

    this.init = function(c, opts) {
      canvas = c;
      c.left = 0;
      options = opts || {};
      options.red = options.red || 0;
      options.green = options.green || 0;
      options.blue = options.blue || 0;

      var resizeCanvas = function(e) {
          canvas.width =
              document.documentElement.clientWidth - canvas.offsetLeft * 2;
          canvas.height =
              document.documentElement.clientHeight - canvas.offsetTop - 5;
          ctx = canvas.getContext("2d");
          ctx.textBaseline = "top";
          ctx.font = "24px Serif";
      };
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      var mouseTN = 0;
      canvas.addEventListener('mousedown', function(e) {
          touches[mouseTN] = {};
          touches[mouseTN].canvasX = e.pageX - canvas.offsetLeft;
          touches[mouseTN].canvasY = e.pageY - canvas.offsetTop;
          e.preventDefault();
      });
      canvas.addEventListener('mouseup', function(e) {
          touches[mouseTN] = undefined;
          e.preventDefault();
      });
      canvas.addEventListener('mousemove', function(e) {
          if (touches[mouseTN] !== undefined) {
              touches[mouseTN].canvasX = e.pageX - canvas.offsetLeft;
              touches[mouseTN].canvasY = e.pageY - canvas.offsetTop;
          }
          e.preventDefault();
      });

      canvas.addEventListener('touchstart', function(e) {
          for (var touchNum = 0; touchNum <= 1; touchNum++) {
              var touch = e.touches[touchNum];
              if (touch === undefined) continue;
              touches[touchNum] = {};
              touches[touchNum].canvasX = touch.pageX - canvas.offsetLeft;
              touches[touchNum].canvasY = touch.pageY - canvas.offsetTop;
          }
          e.preventDefault();
      });
      canvas.addEventListener('touchend', function(e) {
          // not great, but ehh.
          touches = [undefined, undefined];
          e.preventDefault();
      });
      canvas.addEventListener('touchmove', function(e) {
          for (var touchNum = 0; touchNum <= 1; touchNum++) {
              var touch = e.touches[touchNum];
              if (touch === undefined) continue;
              touches[touchNum].canvasX = touch.pageX - canvas.offsetLeft;
              touches[touchNum].canvasY = touch.pageY - canvas.offsetTop;
          }
          e.preventDefault();
      });

      var self = this;
      intervalId = setInterval(self.draw, 20);
    };
};
