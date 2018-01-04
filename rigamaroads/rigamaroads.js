"use strict";

var GRID_WIDTH = 40;
var GRID_HEIGHT = 40;
var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;

var QUADRANT = Math.PI / 2;


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

            var canvas = yoob.makeCanvas(container, GRID_WIDTH * CELL_WIDTH, GRID_HEIGHT * CELL_HEIGHT);

            var gewgaw = (new Rigamaroads()).init({ canvas: canvas });
        };
        document.body.appendChild(elem);
    }
}


var Rigamaroads = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.playfield = (new yoob.Playfield()).init({});

        var freeSpots = [];
        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = 0; y < GRID_HEIGHT; y++) {
                freeSpots.push([x, y]);
            }
        }
        this.freeSpots = freeSpots;

        this.canvasView = (new yoob.PlayfieldCanvasView()).init({
            playfield: this.playfield,
            canvas: this.canvas,
            cellWidth: CELL_WIDTH,
            cellHeight: CELL_HEIGHT
        });

        // NESW convention.
        // 1111 = +, 0000 = space
        // 1 = we have a connection in that direction
        // 0 = we don't
        // X = we haven't decided yet
        this.canvasView.drawCell = function(ctx, value, playfieldX, playfieldY,
                                            canvasX, canvasY, cellWidth, cellHeight) {
            var cx; var cy; var q1; var q2;
            var drawArc = false;

            if (value === '1100') {
                cx = canvasX + cellWidth;
                cy = canvasY;
                q1 = 1;
                q2 = 2;
                drawArc = true;
            } else if (value === '0110') {
                cx = canvasX + cellWidth;
                cy = canvasY + cellHeight;
                q1 = 2;
                q2 = 3;
                drawArc = true;
            } else if (value === '0011') {
                cx = canvasX;
                cy = canvasY + cellHeight;
                q1 = 3;
                q2 = 4;
                drawArc = true;
            } else if (value === '1001') {
                cx = canvasX;
                cy = canvasY;
                q1 = 4;
                q2 = 5;
                drawArc = true;
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(canvasX, canvasY, cellWidth, cellHeight);
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 4;

                if (value.charAt(0) === '1') {
                    ctx.beginPath();
                    ctx.moveTo(canvasX + cellWidth / 2, canvasY);
                    ctx.lineTo(canvasX + cellWidth / 2, canvasY + cellHeight / 2);
                    ctx.stroke();
                }
                if (value.charAt(1) === '1') {
                    ctx.beginPath();
                    ctx.moveTo(canvasX + cellWidth,     canvasY + cellHeight / 2);
                    ctx.lineTo(canvasX + cellWidth / 2, canvasY + cellHeight / 2);
                    ctx.stroke();
                }
                if (value.charAt(2) === '1') {
                    ctx.beginPath();
                    ctx.moveTo(canvasX + cellWidth / 2, canvasY + cellHeight);
                    ctx.lineTo(canvasX + cellWidth / 2, canvasY + cellHeight / 2);
                    ctx.stroke();
                }
                if (value.charAt(3) === '1') {
                    ctx.beginPath();
                    ctx.moveTo(canvasX,                 canvasY + cellHeight / 2);
                    ctx.lineTo(canvasX + cellWidth / 2, canvasY + cellHeight / 2);
                    ctx.stroke();
                }

                if (value === '1000' || value === '0100' || value === '0010' || value === '0001') {
                    /*
                    ctx.beginPath();
                    ctx.fillStyle = Math.random() > 0.5 ? "orange" : "red";
                    ctx.arc(canvasX + cellWidth / 2, canvasY + cellHeight / 2, cellHeight / 4, 0, 2 * Math.PI, false);
                    ctx.fill();
                    */
                    ctx.beginPath();
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 4;
                    ctx.arc(canvasX + cellWidth / 2, canvasY + cellHeight / 2, cellHeight / 4, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            
            if (drawArc) {
                ctx.fillStyle = 'black';
                ctx.fillRect(canvasX, canvasY, cellWidth, cellHeight);
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 4;

                ctx.beginPath();
                var r = cellWidth / 2;
                ctx.arc(cx, cy, r, QUADRANT * q1, QUADRANT * q2, false);
                ctx.stroke();
            }
        };

        this.animation = (new yoob.Animation()).init({'object': this});
        this.animation.start();
    };

    this.pickFor = function(x, y) {
        var pf = this.playfield;

        // assert(pf.get(x, y) === undefined);

        var north = pf.get(x, y - 1) || 'XXXX';
        var east = pf.get(x + 1, y) || 'XXXX';
        var south = pf.get(x, y + 1) || 'XXXX';
        var west = pf.get(x - 1, y) || 'XXXX';

        var connector = function(c) {
            if (c === '1') return '1';
            if (c === '0') return '0';
            if (c === 'X') return Math.random() > 0.75 ? "1" : "0";
        };

        return (
            connector(north.charAt(2)) +
            connector(east.charAt(3)) +
            connector(south.charAt(0)) +
            connector(west.charAt(1))
        );
    };

    this.plunkIntoFreeSpot = function() {
        var pos = Math.trunc(Math.random() * this.freeSpots.length);
        var spot = this.freeSpots.splice(pos, 1)[0];
        if (spot === undefined) {
            return false;  // we're done
        }
        var x = spot[0];
        var y = spot[1];

        var countConnections = function(s) {
            var count = 0;
            for (var i = 0; i < s.length; i++) {
                if (s.charAt(i) === '1') count++;
            }
            return count;
        };

        var pick;
        for (var i = 0; i < 10; i++) {
            pick = this.pickFor(x, y);
            if (countConnections(pick) > 1) break;
        }

        this.playfield.put(x, y, pick);

        return true;
    };

    this.update = function() {
        for (var i = 0; i < 10; i++) {
            var plunked = this.plunkIntoFreeSpot();
            if (!plunked) {
                this.draw();
                this.animation.stop();
                return;
            }
        }
    };

    this.draw = function() {
        this.canvasView.draw();
    };
}
