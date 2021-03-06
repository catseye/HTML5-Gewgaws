"use strict";

var GRID_WIDTH = 16;
var GRID_HEIGHT = 16;

var BLOCK_WIDTH = 8;
var BLOCK_HEIGHT = 8;

var CELL_WIDTH = BLOCK_WIDTH * 2;
var CELL_HEIGHT = BLOCK_HEIGHT * 2;


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

            var paramList = window.location.search.substr(1).split('&');
            var params = {};
            for (var i = 0; i < paramList.length; i++) {
                var pair = paramList[i].split('=');
                params[pair[0]] = pair[1];
            }   

            var getIntParam = function(paramName, def, minV, maxV) {
                var value = parseInt(params[paramName] || ('' + def), 10);
                value = isNaN(value) ? def : value;
                value = value < minV ? minV : value;
                value = value > maxV ? maxV : value;
                return value;
            };

            var canvas = yoob.makeCanvas(
                container,
                GRID_WIDTH * CELL_WIDTH, GRID_HEIGHT * CELL_HEIGHT
            );
            canvas.style.border = Math.round(BLOCK_WIDTH / 2) + 'px solid black';

            yoob.makeLineBreak(container);
            var slidersPanel = yoob.makeDiv(container);
            slidersPanel.id = "sliders-panel";
            var speed = getIntParam('speed', 5, 0, 50);
            yoob.makeRangeControl(slidersPanel, {
                label: "Speed:",
                min: 0,
                max: 50,
                value: speed,
                callback: function(v) {
                    g.setDelay(50 - v);
                }
            });
            g.setDelay(50 - speed);

            var variety = getIntParam('variety', 1, 1, 256);
            yoob.makeLineBreak(slidersPanel);
            yoob.makeRangeControl(slidersPanel, {
                label: "Variety:",
                min: 1,
                max: 256,
                value: variety,
                callback: function(v) {
                    g.setVariety(v);
                }
            });
            g.setVariety(variety);

            var noise = getIntParam('noise', 0, 0, 100);
            yoob.makeLineBreak(slidersPanel);
            yoob.makeRangeControl(slidersPanel, {
                label: "Noise:",
                min: 0,
                max: 100,
                value: noise,
                callback: function(v) {
                    g.setNoise(v);
                }
            });
            g.setNoise(noise);

            var palette = params.palette || 'Tetrade';

            yoob.makeLineBreak(container);
            yoob.makeSelect(container, "Palette:", [
                ['RGB', 'RGB'],
                ['Greyscale', 'Greyscale'],
                ['Tetrade', 'Tetrade']
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
                    ],
                    'Tetrade': [
                        '#E1E685',
                        '#85E6BB',
                        '#8A85E6',
                        '#E685B0'
                    ]
                };
                g.setMasterPalette(pals[value]);
            }, palette);

            g.init({
                canvas: canvas,
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
        if (!this.masterPalette) {
            this.masterPalette = [
                '#ffffff',
                '#ff0000',
                '#00ff00',
                '#0000ff'
            ];
        }
        this.palettes = new Array(256);
        this.makePalettes();
        //this.delay = cfg.delay || 0;
        this.delayCounter = 0;
        //this.noise = 0;
        //this.variety = cfg.variety || 1;

        this.playfield = (new yoob.Playfield()).init();

        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = 0; y < GRID_HEIGHT; y++) {
                this.playfield.put(x, y, y*GRID_WIDTH + x);
            }
        }

        this.canvasView = new yoob.PlayfieldCanvasView().init({
            playfield: this.playfield,
            canvas: this.canvas,
            cellWidth: CELL_WIDTH,
            cellHeight: CELL_HEIGHT
        });

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
