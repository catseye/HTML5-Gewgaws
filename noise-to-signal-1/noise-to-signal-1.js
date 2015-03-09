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

            var canvas = yoob.makeCanvas(container, 600, 200);

            var gewgaw = (new NoiseToSignal1()).init({ canvas: canvas });
        };
        document.body.appendChild(elem);
    }
}

var NoiseToSignal1 = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.counter = 0.0;

        this.zn = 1;
        var source = document.createElement('canvas');
        source.width = 200 / this.zn;
        source.height = 200 / this.zn;
        this.source = source;
        this.parts = [
            document.createElement('canvas'),
            document.createElement('canvas')
        ];
        this.drawInitial(source);
        this.split(source, this.parts);

        this.animation = (new yoob.Animation()).init({'object': this});
        this.animation.start();
    };

    this.draw = function() {
        var canvas = this.canvas;
        var ctx = this.ctx;
        var scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var spd = 100;
        scale = Math.sin((this.counter / spd) - Math.PI);
        if (Math.abs(scale) >= 0.00001) {
            ctx.save();
            ctx.translate(canvas.width * (1/3), 0);
            ctx.scale(scale, 1);
            ctx.drawImage(
                this.parts[0], 0, 0,
                this.parts[0].width * this.zn, this.parts[0].height * this.zn
            );
            ctx.restore();
        }

        scale = Math.sin(this.counter / spd);
        if (Math.abs(scale) > 0.00001) {
            ctx.save();
            ctx.translate(canvas.width * (2/3), 0);
            ctx.scale(scale, 1);
            ctx.drawImage(
                this.parts[1], 0, 0,
                this.parts[1].width * this.zn, this.parts[1].height * this.zn
            );
            ctx.restore();
        }
    };

    this.update = function() {
        this.counter += 1;
    };

    this.drawInitial = function(canvas) {
        var ctx = canvas.getContext('2d');
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.arc(canvas.width/2, canvas.height/2, (canvas.height/2) * 0.8, 0, 2 * Math.PI, false);
        ctx.stroke();
    };
    
    this.split = function(source, dests) {
        var srcCtx = source.getContext('2d');
        var w = source.width;
        var h = source.height;
        var srcImageData = srcCtx.getImageData(0, 0, w, h);
    
        var destCtxs = [];
        var destImageDatas = [];
        for (var i = 0; i < dests.length; i++) {
            dests[i].width = w;
            dests[i].height = h;
            var destCtx = dests[i].getContext('2d');
            destCtx.clearRect(0, 0, w, h);
            destCtxs.push(destCtx);
            destImageDatas.push(destCtx.getImageData(0, 0, w, h));
        }
    
        var destfuncs = [
            function(x, y) { return (y * w + x); },
            function(x, y) { return (y * w + ((w-1) - x)); }
        ];
    
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                var destNum = Math.trunc(Math.random() * dests.length);
                var index = (y * w + x) * 4;
                var destIndex = destfuncs[destNum](x, y) * 4;
    
                // interesting glitch variation:
                // try using destIndex as the SOURCE index...
    
                destImageDatas[destNum].data[destIndex] = srcImageData.data[index];
                destImageDatas[destNum].data[destIndex + 1] = srcImageData.data[index + 1];
                destImageDatas[destNum].data[destIndex + 2] = srcImageData.data[index + 2];
                destImageDatas[destNum].data[destIndex + 3] = srcImageData.data[index + 3];
            }
        }
    
        for (var i = 0; i < dests.length; i++) {
            destCtxs[i].putImageData(destImageDatas[i], 0, 0);
        }
    };
};
