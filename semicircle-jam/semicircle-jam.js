function launch(prefix, containerId) {
    var deps = [
        "element-factory.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var gewgaw = new Ringbows();
                var canvas = yoob.makeCanvas(container, 600, 600);
                gewgaw.init({
                    canvas: canvas
                });
            }
        };
        document.body.appendChild(elem);
    }
}


var QUADRANT = Math.PI / 2;


Ringbows = function() {
    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "black";
        //this.ctx.globalCompositeOperation = 'source-over';
        //this.ctx.globalCompositeOperation = 'xor';

        this.index = 0;
        this.columns = 20;
        this.slots = new Array(this.columns);
        this.x1 = null;
        this.x2 = null;

        var $this = this;
        this.interval = setInterval(function() {
            $this.draw();
        }, 200);
    };

    this.draw = function() {

        if (this.index >= 20) {
            clearInterval(this.interval);
            return;
        }

        var xSpacing = this.canvas.width / this.columns;

        if (this.x2 === null) {
            this.x1 = Math.floor(Math.random() * this.columns) * xSpacing + xSpacing / 2;
        } else {
            this.x1 = this.x2;
        }
        this.x2 = Math.floor(Math.random() * this.columns) * xSpacing + xSpacing / 2;

        var xc = (this.x1 + this.x2) / 2;
        var r = Math.abs(this.x2 - xc);
        var y = this.canvas.height / 2;

        var orientation = this.index % 2;

        if (orientation === 0) {
            this.ctx.beginPath();
            this.ctx.arc(xc, y, r, QUADRANT * 0, QUADRANT * 2, false);
            this.ctx.stroke();
        } else if (orientation === 1) {
            this.ctx.beginPath();
            this.ctx.arc(xc, y, r, QUADRANT * 2, QUADRANT * 4, false);
            this.ctx.stroke();
        } else {
            alert('bad??');
        }

        this.index += 1;
    };
};
