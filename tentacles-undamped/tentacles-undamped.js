"use strict";

function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "animation.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;

            var container = document.getElementById(containerId);
            var t = new Tentacles();
            var canvas = yoob.makeCanvas(container, 500, 500);
            t.init({
                'canvas': canvas
            });
        };
        document.body.appendChild(elem);
    }
}

var TWOPI = Math.PI * 2;
var DEGREES = TWOPI / 360;

var Tentacle = function() {
    var thetas = [];
    var numSegments = 8;

    this.init = function(cfg) {
        this.x = cfg.x || 0;
        this.y = cfg.y || 0;
        this.r = cfg.r || 50;
        this.w = cfg.w || 24;
        this.phase = cfg.phase || Math.random() * TWOPI;
        this.segmentWidthReduction = cfg.segmentWidthReduction || 0.75;
        this.segmentLengthReduction = cfg.segmentLengthReduction || 0.85;
        this.segmentSpeedReduction = cfg.segmentSpeedReduction || 0.95;
        this.segmentRangeReduction = cfg.segmentRangeReduction || 0.95;
        this.range = cfg.range || 2;
        this.speed = cfg.speed || 50;
        this.delay = cfg.delay || Math.random() * 200;
        return this;
    };

    this.draw = function(ctx, tick, theta) {
        var v = (tick - this.delay) * 5.0;

        var speed = this.speed;
        var range = this.range;
        for (var i = 0; i < numSegments; i++) {
            thetas[i] = (Math.sin(v / speed + this.phase) / range) - theta;
            speed *= this.segmentSpeedReduction;
            range *= this.segmentRangeReduction;
        }

        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineCap = "round";
        ctx.moveTo(this.x, this.y);

        var r = this.r;
        var w = this.w;
        var x = this.x;
        var y = this.y
        for (var i = 0; i < numSegments; i++) {
            x += r * Math.cos(thetas[i]);
            y += r * Math.sin(thetas[i]);
            ctx.lineTo(x, y);
            ctx.lineWidth = w;
            ctx.stroke();
            w *= this.segmentWidthReduction;
            r *= this.segmentLengthReduction;
        }
    };
};

var Tentacles = function() {
    var ctx = undefined;
    var canvas = undefined;

    var tick = 0;

    var numTentacles = 13;
    var tentacles = [];

    this.init = function(cfg) {
        canvas = cfg.canvas;
        ctx = canvas.getContext("2d");
        this.animation = new yoob.Animation().init({'object': this});

        for (var i = 0; i < numTentacles; i++) {
            tentacles.push(new Tentacle().init({
                x: canvas.width / 2,
                y: canvas.height / 2
            }));
        }
        
        this.animation.start();
    };

    this.draw = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var tentNo = 0; tentNo < tentacles.length; tentNo++) {
            var theta = (TWOPI / tentacles.length) * tentNo;
            tentacles[tentNo].draw(ctx, tick, theta);
        }
    };

    this.update = function() {
        tick += 1;
    };
};
