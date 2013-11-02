Multicolouralism = function() {
    var canvas;
    var ctx;
    var request;
    var rows;
    var cols;
    var radius;
    var strengthCtrl;
    var doCircles = false;

    var dist = function(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx*dx + dy*dy);
    };

    this.getFillStyle = function(x, y) {
        var diag = dist(0, 0, cols-1, rows-1);
        var d1 = diag - dist(x, y, 0, 0);
        var d2 = diag - dist(x, y, cols-1, 0);
        var d3 = diag - dist(x, y, cols-1, rows-1);
        var d4 = diag - dist(x, y, 0, rows-1);
        
        var level = strengthCtrl.value;
        d1 = Math.pow(d1, level);
        d2 = Math.pow(d2, level);
        d3 = Math.pow(d3, level);
        d4 = Math.pow(d4, level);

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
                if (asCircles.checked) {
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

        strengthCtrl = document.getElementById('strength') || {'value': 1};
        asCircles = document.getElementById('as_circles') || {'checked': false};

        radius = (canvas.height / rows) / 2;

        var animFrame = function(time) {
            $this.draw();
            request = requestAnimationFrame(animFrame);
        };

        request = requestAnimationFrame(animFrame);
    };
}
