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
                var gewgaw = new Spadgets();
                var canvas = yoob.makeCanvas(container, 800, 600);
                gewgaw.init(canvas);
            }
        };
        document.body.appendChild(elem);
    }
}


var QUADRANT = Math.PI / 2;


Spadgets = function() {
    this.init = function(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "black";
        this.ctx.globalCompositeOperation = 'source-over';
        //this.ctx.globalCompositeOperation = 'xor';
        this.index = 0;
        this.columns = 5;
        this.rows = 3;
        this.gridSize = 30;
        this.animation = (new yoob.Animation()).init({ object: this });
        this.animation.start();
    };

    this.genSpadget = function() {
        var prog = "";

        var choices = [
            "U_",    // line straight up
            "D_",    // line straight down
            "L_",    // line straight left
            "R_",    // line straight right
            "UL_",   // line diagonal up and left
            "UR_",   // line diagonal up and right
            "DL_",   // line diagonal down and left
            "DR_",   // line diagonal down and right
            "0DL",   // arc down and left
            "1UL",   // arc up and left
            "2UR",   // arc up and right
            "3DR",   // arc down and right
            "o",     // small open circle at point (ornament)
            "UoD",   // small open circle above (ornament)
            "DoU",   // small open circle below (ornament)
            ".",     // small closed circle at point (ornament)
            "X"
        ];

        choices.pop();

        var segments = Math.floor(Math.random() * 5) + 4;
        for (var j = 0; j < segments; j++) {
            prog += choices[Math.floor(Math.random() * choices.length)];
        }

        return prog;
    };

    this.drawSpadget = function(prog, x, y) {
        var ornaments = [];

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        for (var i = 0; i < prog.length; i++) {
            var c = prog.charAt(i);

            if (c === 'L') {
                x -= this.gridSize;
            } else if (c === 'R') {
                x += this.gridSize;
            } else if (c === 'U') {
                y -= this.gridSize;
            } else if (c === 'D') {
                y += this.gridSize;
            } else if (c === '_') {
                this.ctx.lineTo(x, y);
            } else if (c === '0') {
                this.ctx.arc(x - this.gridSize, y, this.gridSize, QUADRANT * 0, QUADRANT * 1, false);
            } else if (c === '1') {
                this.ctx.arc(x, y - this.gridSize, this.gridSize, QUADRANT * 1, QUADRANT * 2, false);
            } else if (c === '2') {
                this.ctx.arc(x + this.gridSize, y, this.gridSize, QUADRANT * 2, QUADRANT * 3, false);
            } else if (c === '3') {
                this.ctx.arc(x, y + this.gridSize, this.gridSize, QUADRANT * 3, QUADRANT * 4, false);
            } else if (c === 'o') {
                ornaments.push(['o', x, y]);
            } else if (c === '.') {
                ornaments.push(['.', x, y]);
            } else {
                alert('wat: ' + c);
            }
        }

        this.ctx.stroke();

        for (var j = 0; j < ornaments.length; j++) {
            var ornament = ornaments[j];
            var oType = ornament[0];
            x = ornament[1];
            y = ornament[2];

            if (oType === 'o') {
                var radius = this.gridSize / 4;

                this.ctx.beginPath();
                this.ctx.moveTo(x + radius, y);
                this.ctx.arc(x, y, radius, QUADRANT * 0, QUADRANT * 4, false);
                this.ctx.stroke();
            } else if (oType === '.') {
                var radius = this.gridSize / 4;

                this.ctx.beginPath();
                this.ctx.moveTo(x + radius, y);
                this.ctx.arc(x, y, radius, QUADRANT * 0, QUADRANT * 4, false);
                this.ctx.fill();
            } else {
                alert('wat: ' + oType);
            }
        }
    };

    this.getSpadgetBoundingBox = function(prog) {
        var x = 0;
        var y = 0;
        var bounds = {};
        bounds.maxX = 0;
        bounds.maxY = 0;
        bounds.minX = 0;
        bounds.minY = 0;

        for (var i = 0; i < prog.length; i++) {
            var c = prog.charAt(i);

            if (c === 'L') {
                x -= this.gridSize;
                if (x < bounds.minX) bounds.minX = x;
            } else if (c === 'R') {
                x += this.gridSize;
                if (x > bounds.maxX) bounds.maxX = x;
            } else if (c === 'U') {
                y -= this.gridSize;
                if (y < bounds.minY) bounds.minY = y;
            } else if (c === 'D') {
                y += this.gridSize;
                if (y > bounds.maxY) bounds.maxY = y;
            }
        }

        return bounds;
    };


    this.draw = function() {
        var count = this.rows * this.columns;

        if (this.index >= count) {
            this.animation.stop();
            return;
        }

        var xSpacing = this.canvas.width / this.columns;
        var column = this.index % this.columns;
        var x = (column + 0.5) * xSpacing;
        var ySpacing = this.canvas.height / this.rows;
        var row = Math.floor(this.index / this.columns);
        var y = (row + 0.5) * ySpacing;

        var spadget = this.genSpadget();
        var bounds = this.getSpadgetBoundingBox(spadget);

        // adjust x, y to center the bounding box at it
        var width = bounds.maxX - bounds.minX;
        var height = bounds.maxY - bounds.minY;
        x = x - bounds.minX - width / 2;
        y = y - bounds.minY - height / 2;

        var debugBoundingBox = false;
        if (debugBoundingBox) {
            this.ctx.fillStyle = "#ff99ff";
            this.ctx.fillRect(x, y, width, height);
            this.ctx.fillStyle = "black";
        }

        this.drawSpadget(spadget, x, y);

        this.index += 1;
    };

    this.update = function() {
    };
};
