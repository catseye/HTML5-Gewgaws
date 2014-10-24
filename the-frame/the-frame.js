function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
        "sprite-manager.js",
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var t = new TheFrame();
                var instructions = yoob.makeParagraph(container,
                  "<small>Note 1. Green things can be dragged. " +
                  "Note 2. Due to technical limitations, " +
                  "things cannot be dragged off of the computer screen</small>"
                );
                var canvas = yoob.makeCanvas(container, 800, 450);
                canvas.style.display = "block";
                canvas.width = document.documentElement.clientWidth - canvas.offsetLeft * 2;
                //canvas.height = document.documentElement.clientHeight - canvas.offsetTop - 5;
                var pleaseWait = yoob.makeParagraph(container,
                  "Please wait, loading..."
                );
                // PREFIXME
                t.init(canvas, 'the-frame.png', function() {
                    pleaseWait.style.display = "none";
                });
            }
        };
        document.body.appendChild(elem);
    }
}

Corner = function() {
    this.isDraggable = true;
    this.draw = function(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
};

TheFrame = function() {
    var request;

    var canvas;
    var ctx;

    var img = new Image();
    var fontHeight;

    var manager = new yoob.SpriteManager();

    var quote = [
     "“The most important thing in art is The Frame.",
     "For painting: literally; for other arts: figuratively-- because,",
     "without this humble appliance, you can't know",
     "where The Art stops and The Real World begins.",
     "You have to put a 'box' around it because otherwise,",
     "what is that shit on the wall?”"
    ];

    var getFontHeight = function() {
      for (var height = canvas.height / 6; ; height--) {
          ctx.font = height + "px Arial,Sans-serif";
          var width = ctx.measureText(quote[1]).width;
          if (width < canvas.width)
              break;
      }
      fontHeight = height;
    }

    this.draw = function() {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      //ctx.drawImage(img, (canvas.width - img.width) / 2, 0);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      /* XXX knows too much about SpriteManager! */
      for (var i = 0; i < manager.sprites.length; i++) {
          var prev = manager.sprites[i === 0 ? manager.sprites.length - 1 : i - 1];
          var curr = manager.sprites[i];

          ctx.strokeStyle = "black";
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.moveTo(prev.getX() + prev.getWidth() / 2,
                     prev.getY() + prev.getHeight() / 2);
          ctx.lineTo(curr.getX() + curr.getWidth() / 2,
                     curr.getY() + curr.getHeight() / 2);
          ctx.closePath();
          ctx.stroke();
      }

      manager.draw(ctx);

      ctx.textBaseline = "top";
      ctx.font = fontHeight + "px Arial,Sans-serif";
      var textTopY = (canvas.height - 6 * fontHeight) / 2;
      ctx.fillStyle = "white";
      for (var i = 0; i <= 5; i++) {
        if (i === 5) {
          ctx.font = "bold italic " + fontHeight + "px Arial,Sans-serif";
        }
        var width = ctx.measureText(quote[i]).width;
        var textX = (canvas.width - width) / 2;
        
        ctx.fillText(quote[i], textX, textTopY + i * (fontHeight + 4));
      }
    };

    this.update = function() {
    };

    this.init = function(c, imgUrl, callback) {
        Corner.prototype = new yoob.Sprite();

        canvas = c;
        ctx = canvas.getContext("2d");
        manager.init(canvas);
        var mkHandle = function(x, y, w, h) {
            var d = new Corner();
            d.init(x, y, w, h);
            manager.addSprite(d);
        };
        var $this = this;
        img.onload = function() {
            callback();
            // at this point, canvas.width is OK, so we can:
            mkHandle(30, 30, 30, 30);
            mkHandle(canvas.width - 60, 30, 30, 30);
            mkHandle(canvas.width - 60, canvas.height - 60, 30, 30);
            mkHandle(30, canvas.height - 60, 30, 30);
            getFontHeight();
            $this.draw();
            $this.animation = (new yoob.Animation()).init({
                object: $this
            });
            $this.animation.start();
        }
        img.src = imgUrl;
    };
};
