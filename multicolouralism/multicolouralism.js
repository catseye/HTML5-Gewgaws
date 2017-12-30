function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
        "splash-screen.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);

                var t = new Multicolouralism();

                var canvas = yoob.makeCanvas(container, 400, 400);
                canvas.id = 'canvas';

                container.appendChild(document.createElement('br'));
                container.appendChild(document.createTextNode("Field strength:"));
                var slider = yoob.makeSlider(container, 0, 50, 5);
                slider.oninput = function(e) {
                    t.setFieldStrength(slider.value);
                };
                container.appendChild(document.createElement('br'));
                var asCircles = yoob.makeCheckbox(
                    container, false, "circles", t.setAsCircles
                );

                yoob.showSplashScreen({
                    elementId: 'canvas',
                    innerHTML: "<p>Warning: this application displays rapidly changing colours " +
                      "and/or shapes and may be unsuitable for those sensitive to light or " +
                      "prone to epileptic seizures.</p>",
                    buttonText: "I understand -- Proceed",
                    onproceed: function() {
                        t.init(canvas, 25, 25);
                    },
                    background: '#a0a0d0'
                });
            }
        };
        document.body.appendChild(elem);
    }
}

Multicolouralism = function() {
    var canvas;
    var ctx;
    var request;
    var rows;
    var cols;
    var radius;
    var fieldStrength = 5;
    var asCircles = false;

    var dist = function(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx*dx + dy*dy);
    };

    this.setAsCircles = function(b) {
        asCircles = b;
    };

    this.setFieldStrength = function(s) {
        fieldStrength = s;
    };

    this.getFillStyle = function(x, y) {
        var diag = dist(0, 0, cols-1, rows-1);
        var d1 = diag - dist(x, y, 0, 0);
        var d2 = diag - dist(x, y, cols-1, 0);
        var d3 = diag - dist(x, y, cols-1, rows-1);
        var d4 = diag - dist(x, y, 0, rows-1);

        d1 = Math.pow(d1, fieldStrength);
        d2 = Math.pow(d2, fieldStrength);
        d3 = Math.pow(d3, fieldStrength);
        d4 = Math.pow(d4, fieldStrength);

        // pick a rational number between 0 and sum of all distances
        var r = Math.random() * (d1+d2+d3+d4);

        if (r < d1) return "#00ffff";
        if (r < d1 + d2) return "#ff00ff";
        if (r < d1 + d2 + d3) return "#ffff00";
        return "#ffffff";
    };

    this.draw = function() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                if (asCircles) {
                    var cx = x * (radius * 2) + radius;
                    var cy = y * (radius * 2) + radius;
                    ctx.beginPath();
                    ctx.fillStyle = this.getFillStyle(x, y);
                    ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillStyle = this.getFillStyle(x, y);
                    var cx = x * (radius * 2);
                    var cy = y * (radius * 2);
                    ctx.fillRect(cx, cy, radius * 2, radius * 2);
                }
            }
        }
    };

    this.init = function(c, gRows, gCols) {
        canvas = c;
        ctx = canvas.getContext('2d');
        rows = gRows;
        cols = gCols;
        var $this = this;

        radius = (canvas.height / rows) / 2;

        // we request each successive animation frame AS FAST AS POSSIBLE
        var animFrame = function(time) {
            $this.draw();
            request = requestAnimationFrame(animFrame);
        };
        request = requestAnimationFrame(animFrame);
    };
}
