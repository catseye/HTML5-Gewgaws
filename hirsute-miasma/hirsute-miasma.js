function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var t = new HirsuteMiasma();
                var canvas = yoob.makeCanvas(container, 400, 400);
                container.appendChild(document.createElement('br'));
                var choleric = yoob.makeCheckbox(
                    container, false, "choleric", t.setCholeric
                );
                var terminal = yoob.makeCheckbox(
                    container, false, "terminal", t.setTerminal
                );
                t.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}

HirsuteMiasma = function() {
    var canvas;
    var ctx;
    var request;

    var x;
    var y;
    var v = 255;  // darkness
    var theta = 0;  // in degrees
    var dist = 5;
    var tick = 0;
    var grab = 0;
    var flickMode = 0;
    var terminal = false;

    this.setCholeric = function(b) {
        flickMode = b;
    };

    this.setTerminal = function(b) {
        terminal = b;
    };

    this.draw = function() {
        x = canvas.width / 2;
        y = canvas.height / 2;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(" + v +"," + v + "," + v + ")";
        ctx.moveTo(x, y);
        while (!(x < 0 || x > canvas.width || y < 0 || y > canvas.height)) {
            var rad = (theta / 360) * (Math.PI * 2);

            var dx = dist * Math.cos(rad);
            var dy = dist * Math.sin(rad);

            var newX = x + dx;
            var newY = y + dy;

            ctx.lineTo(newX, newY);

            x = newX;
            y = newY;

            if (Math.random() > 0.5) {
                theta += 22.5;
            } else {
                theta -= 22.5;
            }
        }
        ctx.stroke();
    };

    this.update = function() {
        var prevV = v;
        v = Math.floor((Math.cos(tick / 250) + 1) * 128);
      
        if ((prevV === 1 && v === 0) || (prevV === 254 && v === 255)) {
            grab = 350;
        }

        if (flickMode) {
            if (prevV === 255) v = 0; else v = 255;
        }

        if (!flickMode) {
            if (!grab) {
              tick++;
            } else {
              if (terminal && v === 0) {
                // nop
              } else {
                grab--;
              }
            }
        }
    };

    this.init = function(c) {
        canvas = c;
        ctx = canvas.getContext('2d');
        this.animation = (new yoob.Animation()).init({ object: this });
        this.animation.start();
    };
};
