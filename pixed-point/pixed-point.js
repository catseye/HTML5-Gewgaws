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

            if (config.width === undefined) {
                config.width = 168;
            }
            if (config.segmentHeights === undefined) {
                config.segmentHeights = [20, 21];
            }
            if (config.textOffset === undefined) {
                config.textOffset = 30;
            }

            var container = document.getElementById(containerId);

            var gewgaw = (new PixedPoint());

            var canvas = yoob.makeCanvas(container);
            yoob.makeLineBreak(container);
            var panel = yoob.makeDiv(container);


            var widthInput = yoob.makeRangeControl(panel, {
                label: 'Width', min: 0, max: 1000,
                value: config.width,
                callback: function(v) { gewgaw.setWidth(v); }
            });
            yoob.makeLineBreak(panel);

            var topHeightInput = yoob.makeRangeControl(panel, {
                label: 'Segment 1 Height', min: 0, max: 200,
                value: config.segmentHeights[0],
                callback: function(v) { gewgaw.setSegmentHeight(0, v); }
            });
            yoob.makeLineBreak(panel);

            var presetEntries = PALETTE.map(function(d) { return [d.title, d.title]; });
            var presetSelect1 = yoob.makeSelect(panel, "Segment 1 Colour", presetEntries, function(v) {
                gewgaw.setSegmentForeground(0, v);
                gewgaw.setSegmentBackground(1, v);
            });
            presetSelect1.selectedIndex = 0;
            yoob.makeLineBreak(panel);

            var bottomHeightInput = yoob.makeRangeControl(panel, {
                label: 'Segment 2 Height', min: 0, max: 200,
                value: config.segmentHeights[1],
                callback: function(v) { gewgaw.setSegmentHeight(1, v); }
            });
            yoob.makeLineBreak(panel);

            var presetSelect2 = yoob.makeSelect(panel, "Segment 2 Colour", presetEntries, function(v) {
                gewgaw.setSegmentForeground(1, v);
                gewgaw.setSegmentBackground(0, v);
            });
            presetSelect1.selectedIndex = 1;
            yoob.makeLineBreak(panel);

            /*
            var textOffsetInput = yoob.makeRangeControl(panel, {
                label: 'Text Offset', min: 0, max: 1000,
                value: config.textOffset,
                callback: function(v) { gewgaw.setTextOffset(v); }
            });
            yoob.makeLineBreak(panel);
            */

            config.canvas = canvas;
            config.status = yoob.makeDiv(container);

            gewgaw.init(config);
            gewgaw.setSegmentForeground(0, "WHITE");
            gewgaw.setSegmentBackground(0, "BLACK");
            gewgaw.setSegmentForeground(1, "BLACK");
            gewgaw.setSegmentBackground(1, "WHITE");
        };
        document.body.appendChild(elem);
    }
}


var PALETTE = [
    {
        title: "BLACK",
        triple: [0, 0, 0],
        css: '#000000',
        pixelCount: 0
    },
    {
        title: "WHITE",
        triple: [255, 255, 255],
        css: '#ffffff',
        pixelCount: 0
    },
    {
        title: "BLUE",
        triple: [0, 0, 255],
        css: '#0000ff',
        pixelCount: 0
    },
    {
        title: "ORANGE",
        triple: [255, 128, 0],
        css: '#ff8000',
        pixelCount: 0
    },
    {
        title: "KETCHUP",
        triple: [255, 0, 0],
        css: '#ff0000',
        pixelCount: 0
    },
    {
        title: "MUSTARD",
        triple: [255, 255, 0],
        css: '#ffff00',
        pixelCount: 0
    }
];


var PixedPoint = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.width = cfg.width;
        this.charHeight = 8;
        this.textOffset = 12;
        this.ctx = this.canvas.getContext('2d');
        this.status = cfg.status;

        this.palette = PALETTE;

        var colorTriples = [];
        for (var i = 0; i < this.palette.length; i++) {
            colorTriples.push(this.palette[i].triple);
        }

        this.segment = [
            {
                height: cfg.segmentHeights[0],
                bgcolor: 4,
                fgcolor: 5
            },
            {
                height: cfg.segmentHeights[1],
                bgcolor: 5,
                fgcolor: 4
            }
        ];
        this.setDimensions();

        var $this = this;
        this.chargen = (new yoob.Chargen()).init({
            charsPerRow: 32,
            rows: 8,
            imageSrc: cfg.imgUrl,
            colorToAlpha: [255, 255, 255],
            colorTriples: colorTriples,
            onLoad: function() {
                var update = function() {
                    $this.draw();
                    $this.countPixels();
                }
                update();
                $this.intervalId = setInterval(update, 100);
            }
        });

        return this;
    };

    this.setDimensions = function() {
        this.canvas.width = this.width;
        var height = 0;
        for (var i = 0; i < this.segment.length; i++) {
            height += this.segment[i].height;
        }
        this.canvas.height = height;

        var zoom = 1;
        this.canvas.style.width = (this.canvas.width * zoom) + "px";
        this.canvas.style.height = (this.canvas.height * zoom) + "px";
    };

    this.setWidth = function(width) {
        this.width = width;
        this.setDimensions();
    };

    this.setSegmentHeight = function(segmentNum, height) {
        this.segment[segmentNum].height = height;
        this.setDimensions();
    };

    this.setSegmentForeground = function(segmentNum, colorName) {
        this.segment[segmentNum].fgcolor = this.findPaletteIndex(colorName);
        this.setDimensions();
    };

    this.setSegmentBackground = function(segmentNum, colorName) {
        this.segment[segmentNum].bgcolor = this.findPaletteIndex(colorName);
        this.setDimensions();
    };

    this.setTextOffset = function(segmentNum, textOffset) {
        this.textOffset = textOffset;
        this.setDimensions();
    };

    this.findPaletteIndex = function(colorName) {
        for (var i = 0; i < this.palette.length; i++) {
            if (this.palette[i].title === colorName) return i;
        }
        return -1;
    };

    this.blitDecimal = function(ctx, x, y, color, value, pad, suffix) {
        var countStr = '' + value;
        while (countStr.length < pad) {
            countStr = '0' + countStr;
        }
        // convert suffix to PETSCII
        suffix = suffix || '';
        var cvtSuffix = '';
        for (var i = 0; i < suffix.length; i++) {
            var code = suffix.charCodeAt(i);
            if (code !== 32) {
                code -= 64;
            }
            cvtSuffix += String.fromCharCode(code);
        }
        countStr += cvtSuffix;
        // draw the string
        for (var i = 0; i < countStr.length; i++) {
            this.chargen.blitChar(
                countStr.charCodeAt(i), color, ctx, x + i * 8, y, 8, 8
            );
        }
    };

    this.draw = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        var top = 0;
        for (var i = 0; i < this.segment.length; i++) {
            ctx.fillStyle = this.palette[this.segment[i].bgcolor].css;
            ctx.fillRect(0, top, canvas.width, this.segment[i].height);
            
            var textTop = top + Math.trunc(
                (this.segment[i].height - this.charHeight) / 2
            );
            this.blitDecimal(
                ctx, this.textOffset, textTop, this.segment[i].fgcolor,
                this.palette[this.segment[i].fgcolor].pixelCount, 0,
                ' ' + this.palette[this.segment[i].fgcolor].title + ' PIXELS'
            );

            top += this.segment[i].height;
        }
    };

    this.countPixels = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var srcImageData = ctx.getImageData(0, 0, w, h);

        for (var i = 0; i < this.palette.length; i++) {
            this.palette[i].pixelCount = 0;
        }

        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                var index = (y * w + x) * 4;
    
                var r = srcImageData.data[index];
                var g = srcImageData.data[index + 1];
                var b = srcImageData.data[index + 2];
                var a = srcImageData.data[index + 3];

                var found = false;
                for (var i = 0; i < this.palette.length; i++) {
                    var t = this.palette[i].triple;
                    if (r == t[0] && g == t[1] && b == t[2]) {
                        this.palette[i].pixelCount++;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.status.innerHTML = "ERROR! Found a " + r + ',' + g + ',' + b;
                    return;
                }
            }
        }

        var out = '';
        for (var i = 0; i < this.palette.length; i++) {
            out += '<p>' + this.palette[i].title + ': ' + this.palette[i].pixelCount + "</p>";
        }
        //this.status.innerHTML = out;
    };
};
