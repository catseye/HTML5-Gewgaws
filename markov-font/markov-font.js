"use strict";

function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "chargen.js",
        "animation.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;
            var container = document.getElementById(containerId);

            var gewgaw = (new MarkovFont());

            var peepHole = yoob.makeDiv(container);
            var canvas = yoob.makeCanvas(peepHole);
            canvas.width = 9;
            canvas.height = 9;

            var bucket = yoob.makeDiv(container);
            bucket.style.width = "512px";
            bucket.style.marginLeft = "auto";
            bucket.style.marginRight = "auto";
            bucket.style.background = "#a0a0a0";

            gewgaw.init({
                canvas: canvas,
                bucket: bucket,
                imgUrl: config.imgUrl
            });
        };
        document.body.appendChild(elem);
    }
}


var MarkovFont = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.bucket = cfg.bucket;
        this.ctx = this.canvas.getContext('2d');
        this.charHeight = 8;
        this.charWidth = 8;

        this.palette = [[0, 0, 0], [255, 255, 255]];

        var $this = this;
        this.chargen = (new yoob.Chargen()).init({
            charsPerRow: 32,
            rows: 8,
            imageSrc: cfg.imgUrl,
            colorTriples: this.palette,
            colorToAlpha: this.palette[1],
            onLoad: function() {
                $this.start();
            }
        });

        return this;
    };

    this.start = function() {
        this.charIndex = 0;
        this.table = {
            '0': {},
            '1': {}
        };
        var $this = this;
        this.intervalId = setInterval(
            function() { $this.examineChar(); },
            10
        );
    };

    this.examineChar = function() {
        if (this.charIndex > 255) {
            console.log(uneval(this.table));
            clearInterval(this.intervalId);
            this.canvas.parentElement.style.display = 'none';
            this.generated = 0;
            var $this = this;
            this.intervalId = setInterval(
                function() { $this.generateChar($this.table); },
                64
            );
            return;
        }
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.chargen.blitChar(this.charIndex, 0, this.ctx, 1, 1, 8, 8);
        this.surveyPixels(this.table);
        this.charIndex++;
    };

    this.findColorInPalette = function(r, g, b) {
        for (var i = 0; i < this.palette.length; i++) {
            var t = this.palette[i];
            if (r == t[0] && g == t[1] && b == t[2]) {
                return i;
            }
        }
        return null;
    };

    this.pixelAt = function(imageData, x, y) {
        var w = this.canvas.width;
        var h = this.canvas.height;

        var index = (y * w + x) * 4;

        var r = imageData.data[index];
        var g = imageData.data[index + 1];
        var b = imageData.data[index + 2];
        var a = imageData.data[index + 3];

        return this.findColorInPalette(r, g, b);
    };

    this.putPixel = function(imageData, x, y, color) {
        var w = this.canvas.width;
        var h = this.canvas.height;

        var index = (y * w + x) * 4;

        var t = this.palette[color];
        imageData.data[index] = t[0];
        imageData.data[index + 1] = t[1];
        imageData.data[index + 2] = t[2];
        // and leave alpha (data[index + 3]) unchanged */
    };

    this.surveyPixels = function(table) {
        var w = this.canvas.width;
        var h = this.canvas.height;
        var srcImageData = this.ctx.getImageData(0, 0, w, h);

        for (var x = 1; x < w; x++) {
            for (var y = 1; y < h; y++) {
                var color = this.pixelAt(srcImageData, x, y);
                var left = this.pixelAt(srcImageData, x-1, y);
                var above = this.pixelAt(srcImageData, x, y-1);
                var leftAbove = this.pixelAt(srcImageData, x-1, y-1);
                var key = left + ',' + leftAbove + ',' + above;
                if (table[color][key] === undefined) {
                    table[color][key] = 1;
                } else {
                    table[color][key]++;
                }
            }
        }
    };

    this.generateChar = function(table) {
        if (this.generated >= 130) return;

        var canvas = yoob.makeCanvas(this.bucket);
        var ctx = canvas.getContext('2d');
        canvas.width = 9;
        canvas.height = 9;

        canvas.style.margin = "10px";

        var w = canvas.width;
        var h = canvas.height;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);

        for (var x = 1; x < w; x++) {
            for (var y = 1; y < h; y++) {
                var srcImageData = ctx.getImageData(0, 0, w, h);

                var left = this.pixelAt(srcImageData, x-1, y);
                var above = this.pixelAt(srcImageData, x, y-1);
                var leftAbove = this.pixelAt(srcImageData, x-1, y-1);
                var key = left + ',' + leftAbove + ',' + above;

                var c0 = table['0'][key];
                var c1 = table['1'][key];
                var tot = c0 + c1;

                var pick = Math.floor(Math.random() * tot) + 1;
                var color = pick <= c0 ? 0 : 1;

                this.putPixel(srcImageData, x, y, color);
                ctx.putImageData(srcImageData, 0, 0);
            }
        }
        
        this.generated++;
    };

};
