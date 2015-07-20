function launch(prefix, containerId, config) {
    var config = config || {};
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
                var container = document.getElementById(containerId);
                var t = new TheFrame();
                yoob.makeParagraph(container,
                    "<small>Note 1. Green things can be dragged. " +
                    "Note 2. Due to technical limitations, " +
                    "things cannot be dragged off of the computer screen</small>"
                );
                if (!config.canvas) {
                    var c = yoob.makeCanvas(container, 800, 450);
                    c.style.display = "block";
                    c.width = document.documentElement.clientWidth - c.offsetLeft * 2
                    //c.height = document.documentElement.clientHeight - c.offsetTop - 5;
                    config.canvas = c;
                }
                var pleaseWait = yoob.makeParagraph(container,
                    "Please wait, loading..."
                );
                config.callback = function() {
                    pleaseWait.style.display = "none";
                }
                t.init(config);
            }
        };
        document.body.appendChild(elem);
    }
}

Corner = function() {
    this.draw = function(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.getLeftX(), this.getTopY(), this.getWidth(), this.getHeight());
    };
};

TheFrame = function() {
    var request;

    var canvas;
    var ctx;

    var img = new Image();
    var fontHeight;

    var manager;

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
          ctx.moveTo(prev.getX(), prev.getY());
          ctx.lineTo(curr.getX(), curr.getY());
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

    this.init = function(config) {
        Corner.prototype = new yoob.Sprite();

        canvas = config.canvas;
        ctx = canvas.getContext("2d");
        manager = (new yoob.SpriteManager()).init({
            canvas: canvas
        });
        var mkHandle = function(x, y) {
            var d = (new Corner()).init({
                x: x, y: y, width: 30, height: 30,
                isDraggable: true
            });
            manager.addSprite(d);
        };
        var $this = this;
        img.onload = function() {
            config.callback();
            // at this point, canvas.width is OK, so we can:
            mkHandle(45, 45);
            mkHandle(canvas.width - 45, 45);
            mkHandle(canvas.width - 45, canvas.height - 45);
            mkHandle(45, canvas.height - 45);
            getFontHeight();
            $this.draw();
            $this.animation = (new yoob.Animation()).init({
                object: $this
            });
            $this.animation.start();
        }
        img.src = config.imgURL;
    };
};
