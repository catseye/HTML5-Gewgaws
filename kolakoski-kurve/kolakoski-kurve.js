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
                var gewgaw = new KolakoskiKurve();

                var canvas = yoob.makeCanvas(container, 800, 600);
                yoob.makeLineBreak(container);
                yoob.makeSliderPlusTextInput(container, "Segment length:", 2, 25, (2), 5, function(v) {
                    gewgaw.dist = v;
                    gewgaw.reset();
                });
                yoob.makeLineBreak(container);
                yoob.makeSliderPlusTextInput(container, "Start index", 1, 10000, 5, 1, function(v) {
                    gewgaw.startIndex = v - 1;
                    gewgaw.reset();
                });
                yoob.makeLineBreak(container);
                yoob.makeSliderPlusTextInput(container, "End index", 1, 10000, 5, 10000, function(v) {
                    gewgaw.endIndex = v - 1;
                    gewgaw.reset();
                });
                yoob.makeLineBreak(container);
                yoob.makeCheckbox(
                    container, true, "opaque", function(bool) {
                        gewgaw.ctx.strokeStyle = bool ? "black" : "rgba(0,0,0,0.1)";
                        gewgaw.reset();
                    }
                );
                yoob.makeCheckbox(
                    container, false, "xor", function(bool) {
                        gewgaw.ctx.globalCompositeOperation = bool ? "xor" : "source-over";
                        gewgaw.reset();
                    }
                );
                yoob.makeLineBreak(container);
                var button = yoob.makeButton(container, 'Reset', function() {
                    gewgaw.reset();
                });
                gewgaw.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}


KolakoskiKurve = function() {
    this.init = function(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black";
        this.ctx.globalCompositeOperation = 'source-over';
        this.dist = 5;

        this.startIndex = 0;
        this.endIndex = 10000;
        this.stepSize = 10;
        this.reset();
    };

    this.reset = function() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 10;
        this.y = this.canvas.height / 2;
        this.theta = 0;

        this.index = this.startIndex;

        this.sequence = this.generate(this.endIndex);

        if (this.animation) this.animation.stop();
        this.animation = (new yoob.Animation()).init({ object: this });
        this.animation.start();
    };

    this.step = function() {
        if (this.index >= this.endIndex) return;

        var num = this.sequence[this.index];

        if (num === 1) {
            // FD 10
            var rad = (this.theta / 360) * (Math.PI * 2);

            var dx = this.dist * Math.cos(rad);
            var dy = this.dist * Math.sin(rad);

            var newX = this.x + dx;
            var newY = this.y + dy;

            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();

            this.x = newX;
            this.y = newY;
        } else if (num === 2) {
            // RT 90
            this.theta += 90;
            while (this.theta >= 360) this.theta -= 360;
        } else {
            alert('wtf');
        }
        
        this.index++;
    };

    this.draw = function() {
        if (this.index >= this.endIndex) {
            this.animation.stop();
            return;
        }

        for (var j = 0; j < this.stepSize; j++) {
            this.step();
        }
    };

    this.update = function() {
    };

    /*
     * Generate at least n values of the Kolakoski sequence, starting at the beginning.
     */
    this.generate = function(n) {
        var sequence = [1, 2, 2];
        for (var i = 3; sequence.length < n; i++) {
            var newValue = i % 2 === 1 ? 1 : 2;
            sequence.push(newValue);
            if (sequence[i - 1] === 2) {
                sequence.push(newValue);
            }
        }
        return sequence;
    };
};
