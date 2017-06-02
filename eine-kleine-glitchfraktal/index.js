function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "animation.js",
        "preset-manager.js",
        "splash-screen.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;
            var container = document.getElementById(containerId);

            var presetSelect = yoob.makeSelect(container, "MODE", []);
            yoob.makeLineBreak(container);

            var t = new FractalRectangles();
            var canvas = yoob.makeCanvas(container, 500, 500);
            canvas.id = 'canvas'; // FIXME

            var p = new yoob.PresetManager();
            p.init({
                'selectElem': presetSelect
            });
            var presets = {
                "STATIC": function(n) {
                    t.style = 1;
                },
                "SYNC GLITCH": function(n) {
                    t.style = 2;
                },
                "SUPERSYNC GLITCH": function(n) {
                    t.style = 3;
                },
                "ASYNC GLITCH": function(n) {
                    t.style = 4;
                }
            };
            for (n in presets) {
                p.add(n, presets[n]);
            }

            yoob.showSplashScreen({
                elementId: 'canvas',
                innerHTML: "<p>Warning: this application displays rapidly changing colours " +
                  "and/or shapes and may be unsuitable for those sensitive to light or " +
                  "prone to epileptic seizures.</p>",
                buttonText: "I understand -- Proceed",
                onproceed: function() {
                    t.init({
                        'canvas': canvas
                    });
                },
                background: '#a0a0d0'
            });

        };
        document.body.appendChild(elem);
    }
}


FractalRectangles = function() {
    var ctx = undefined;
    var canvas = undefined;
    var info;
    var padding = 8;
    var cdelta = 40;

    var t = 0;

    this.init = function(cfg) {
        canvas = cfg.canvas;
        ctx = canvas.getContext("2d");
        this.style = 1;
        this.animation = (new yoob.Animation()).init({'object': this });
        this.animation.start();
    };

    this.update = function() {
        t += 1;
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.globalWidthFactor = (1.5 + Math.random());
        this.globalHeightFactor = (1.5 + Math.random());
        this.drawRectangle(canvas.width / 2, canvas.height / 2,
                           canvas.width / 2, canvas.height / 2, 0, 0, 0, 0);
    };

    this.drawRectangle = function(x, y, width, height, r, g, b, level) {
        // x and y are coords of the centre;
        // width and height are the distance from the centre to the edge
        if (level > 3) return;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x - width, y - height, width * 2, height * 2);

        var newwidth, newheight;
        if (this.style === 1) {
            var neww = width / 2.0 - padding;
            var newh = height / 2.0 - padding;
            newwidth = function() { return neww; };
            newheight = function() { return newh; };
        } else if (this.style === 2) {
            var neww, newh;
            neww = width / (1.5 + Math.random()) - padding;
            newh = height / (1.5 + Math.random()) - padding;
            newwidth = function() { return neww; };
            newheight = function() { return newh; };
        } else if (this.style === 3) {
            var $this = this;
            newwidth = function() { return width / $this.globalWidthFactor - padding; };
            newheight = function() { return height / $this.globalHeightFactor - padding; };
        } else if (this.style === 4) {
            newwidth = function() { return width / (1.5 + Math.random()) - padding; };
            newheight = function() { return height / (1.5 + Math.random()) - padding; };
        }

        this.drawRectangle(x - width / 2 , y - height / 2, newwidth(), newheight(),
                           r + cdelta, g, b, level + 1);
        this.drawRectangle(x + width / 2, y - height / 2, newwidth(), newheight(),
                           r, g + cdelta, b, level + 1);
        this.drawRectangle(x - width / 2, y + height / 2, newwidth(), newheight(),
                           r, g, b + cdelta, level + 1);
        this.drawRectangle(x + width / 2, y + height / 2, newwidth(), newheight(),
                           r + cdelta, g + cdelta, b + cdelta, level + 1);
    };
};
