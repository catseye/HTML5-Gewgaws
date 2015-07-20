"use strict";

var GRID_WIDTH = 16;
var GRID_HEIGHT = 16;

var BLOCK_WIDTH = 8;
var BLOCK_HEIGHT = 8;

var CELL_WIDTH = BLOCK_WIDTH * 2;
var CELL_HEIGHT = BLOCK_HEIGHT * 2;


var makeSelect = function(container, labelText, optionsArray, fun) {
    var label = document.createElement('label');
    label.innerHTML = labelText;
    container.appendChild(label);

    var select = document.createElement("select");

    for (var i = 0; i < optionsArray.length; i++) {
        var op = document.createElement("option");
        op.value = optionsArray[i][0];
        op.text = optionsArray[i][1];
        if (optionsArray[i].length > 2) {
            op.selected = optionsArray[i][2];
        } else {
            op.selected = false;
        }
        select.options.add(op);
    }

    if (fun) {
        select.onchange = function(e) {
            fun(optionsArray[select.selectedIndex][0]);
        };
    }

    container.appendChild(select);
    return select;
};


function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "playfield.js",
        "playfield-canvas-view.js",
        "animation.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;

            var container = document.getElementById(containerId);
            var g = new TwoFiftySix();

            var canvas = yoob.makeCanvas(
                container,
                GRID_WIDTH * CELL_WIDTH, GRID_HEIGHT * CELL_HEIGHT
            );
            canvas.style.border = Math.round(BLOCK_WIDTH / 2) + 'px solid black';

            var startDelay = 45;

            yoob.makeLineBreak(container);
            yoob.makeSliderPlusTextInput(
                container, "Speed:", 0, 50, 5, 50 - startDelay,  function(v) {
                    g.setDelay(50 - v);
                }
            );

            yoob.makeLineBreak(container);
            yoob.makeSliderPlusTextInput(
                container, "Variety:", 1, 256, 5, 1,  function(v) {
                    g.setVariety(v);
                }
            );

            yoob.makeLineBreak(container);
            yoob.makeSliderPlusTextInput(
                container, "Noise:", 0, 100, 5, 0,  function(v) {
                    g.setNoise(v);
                }
            );

            yoob.makeLineBreak(container);
            makeSelect(container, "Palette:", [
                ['RGB', 'RGB'],
                ['Greyscale', 'Greyscale']
            ], function(value) {
                var pals = {
                    'RGB': [
                        '#ffffff',
                        '#ff0000',
                        '#00ff00',
                        '#0000ff'
                    ],
                    'Greyscale': [
                        '#ffffff',
                        '#aaaaaa',
                        '#555555',
                        '#000000'
                    ]
                };
                g.setMasterPalette(pals[value]);
            });

            g.init({
                canvas: canvas,
                delay: startDelay,
                variety: 1
            });
        };
        document.body.appendChild(elem);
    }
}


function shuffle(ary) {
    var oldAry = ary.map(function(x) { return x; })
    var newAry = [];
    while (oldAry.length > 0) {
        newAry.push(oldAry.splice(Math.random() * oldAry.length, 1)[0]);
    }
    return newAry;
}


var TwoFiftySix = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.masterPalette = [
            '#ffffff',
            '#ff0000',
            '#00ff00',
            '#0000ff'
        ];
        this.palettes = new Array(256);
        this.makePalettes();
        this.delay = cfg.delay || 0;
        this.delayCounter = 0;
        this.noise = 0;
        this.variety = cfg.variety || 1;

        this.playfield = (new yoob.Playfield()); // .init();

        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = 0; y < GRID_HEIGHT; y++) {
                this.playfield.put(x, y, y*GRID_WIDTH + x);
            }
        }

        this.canvasView = new yoob.PlayfieldCanvasView();
        this.canvasView.init(this.playfield, this.canvas).setCellDimensions(
            CELL_WIDTH, CELL_HEIGHT
        );

        var $this = this;
        this.canvasView.drawCell = function(ctx, value, playfieldX, playfieldY,
                                            canvasX, canvasY, cellWidth, cellHeight) {

            var palIndex = playfieldX + playfieldY * GRID_WIDTH;
            var pal = $this.palettes[palIndex % $this.variety];

            var colours = [];
            colours.push(pal[value & 0x03]);
            colours.push(pal[(value >> 2) & 0x03]);
            colours.push(pal[(value >> 4) & 0x03]);
            colours.push(pal[(value >> 6) & 0x03]);

            if (Math.floor(Math.random() * 100) < $this.noise) {
                colours = shuffle(colours);
            }

            ctx.fillStyle = colours[0];
            ctx.fillRect(canvasX, canvasY, BLOCK_WIDTH, BLOCK_HEIGHT);
            ctx.fillStyle = colours[1];
            ctx.fillRect(canvasX + BLOCK_WIDTH, canvasY, BLOCK_WIDTH, BLOCK_HEIGHT);
            ctx.fillStyle = colours[2];
            ctx.fillRect(canvasX, canvasY + BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
            ctx.fillStyle = colours[3];
            ctx.fillRect(canvasX + BLOCK_WIDTH, canvasY + BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);

            if ($this.outline) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(canvasX, canvasY, CELL_WIDTH, CELL_HEIGHT);
            }
        };

        this.animation = (new yoob.Animation()).init({'object': this});
        this.animation.start();
    };

    this.setMasterPalette = function(pal) {
        this.masterPalette = pal;
        this.draw();
    };

    this.makePalettes = function() {
        for (var i = 0; i < 256; i++) {
            this.palettes[i] = shuffle(this.masterPalette);
        }
    };

    this.setDelay = function(d) {
        this.delay = d;
    };

    this.setNoise = function(d) {
        this.noise = d;
    };

    this.setVariety = function(v) {
        v = v || 0;
        if (v < 1 || v > 256) return;
        this.variety = v;
    };

    this.setScramble = function(b) {
        this.scramble = b;
    };

    this.update = function() {
        if (this.delayCounter < this.delay) {
            this.delayCounter++;
            return;
        }
        this.delayCounter = 0;

        this.makePalettes();
    };

    this.draw = function() {
        this.canvasView.draw();
    };
}
