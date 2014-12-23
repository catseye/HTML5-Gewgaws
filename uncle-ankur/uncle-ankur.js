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
            var t = new UncleAnkur();
            var canvas = yoob.makeCanvas(container, 500, 500);
            t.init({
                'canvas': canvas
            });
        };
        document.body.appendChild(elem);
    }
}


Transform = function() {
    this.init = function(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        return this;
    };

    this.initRandom = function() {
        this.init(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        );
        return this;
    };

    this.applyToContext = function(ctx) {
        ctx.setTransform(this.a, this.b, this.c, this.d, this.e, this.f);
    };
};


UncleAnkur = function() {
    var canvas;
    var ctx;
    var linGrad;
    var radGrad;
    var xforms = new Array();
    var xformIndex = 0;

    this.draw = function() {
        ctx.fillStyle = linGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < xforms.length; i++) {
            ctx.save();            
            xforms[i].applyToContext(ctx);
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(230, 230, 150, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.restore();
        }
    }

    this.update = function() {
        xforms[xformIndex] = (new Transform()).initRandom();
        xformIndex = (xformIndex + 1) % xforms.length;
    };

    this.init = function(cfg) {
        canvas = cfg.canvas;
        numHighlights = cfg.numHighlights || 8;
        ctx = canvas.getContext("2d");
        linGrad = ctx.createLinearGradient(50, 0,  250, 400);

        linGrad.addColorStop(0, "aquamarine");
        linGrad.addColorStop(1, "darkolivegreen");
        
        radGrad = ctx.createRadialGradient(
            200, 200, 25,
            200, 200, 150);
        radGrad.addColorStop(0, "#c0e0ff");
        radGrad.addColorStop(1, "rgba(255,255,255,0)");

        for (var i = 0; i < numHighlights; i++) {
            xforms[i] = (new Transform()).initRandom();
        }

        this.animation = (new yoob.Animation()).init({
            'object': this
        });
        this.animation.start();
    };
};
