"use strict";

var bgimg = new Image();

function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;
            var container = document.getElementById(containerId);

            yoob.makeParagraph(container,
                'When you are finished, see <a href="http://feldmangallery.com/media/pdfs/Ukeles_MANIFESTO.pdf">(Ukeles, 1969)</a> for further instructions</p>'
            );

            container = yoob.makeDiv(container);
            var msg = yoob.makeParagraph(
                container,
                "Not enough room to display the canvas! Resize your browser! Or use a device with a larger screen!"
            );
            msg.style.display = 'none';

            var canvas = yoob.makeCanvas(container, 500, 310);
            canvas.style.position = 'absolute';
            canvas.style.background = 'transparent';
            canvas.style.zIndex = "100";
            canvas.style.cursor = "pointer";

            var backing = yoob.makeCanvas(container, 500, 310);
            backing.style.zIndex = "0";

            backing.style.display = canvas.style.display;
            backing.style.marginTop = canvas.style.marginTop;
            backing.style.left = canvas.offsetLeft + "px";
            backing.style.top = canvas.offsetTop + "px";
            backing.width = canvas.width;
            backing.height = canvas.height;
            backing.getContext('2d').drawImage(bgimg, 0, 0, backing.width, backing.height);
            canvas.style.zIndex = "100";
            backing.style.zIndex = "0";

            var artURL = config.artURL || 'art.jpg';
            var gewgaw = new ArtRestorationSimulator();
            gewgaw.init(canvas, backing, artURL);

        };
        document.body.appendChild(elem);
    }
}


var ArtRestorationSimulator = function() {
    var backing;
    var canvasCtx;
    var backingCtx;
    var intervalId;
    var imageData;
    var mouseDown;
    var canvasX;
    var canvasY;

    var mask = [
        "   ***    ",
        "  ******  ",
        " ******** ",
        " *********",
        "**********",
        "**********",
        "********* ",
        " ******** ",
        "  ******  ",
        "    ***   "
    ];

    this.init = function(canvas, b, bgimgURL) {
        this.canvas = canvas;
        backing = b;
        backingCtx = backing.getContext('2d');
        canvasCtx = this.canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = "rgba(50,80,100,255)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

        var $this = this;
        this.canvas.addEventListener('mousedown', function(e) {
            return $this.onmousedown(e, e);
        });
        this.canvas.addEventListener('touchstart', function(e) {
            return $this.onmousedown(e, e.touches[0]);
        });

        this.canvas.addEventListener('mousemove', function(e) {
            return $this.onmousemove(e, e);
        });
        this.canvas.addEventListener('touchmove', function(e) {
            return $this.onmousemove(e, e.touches[0]);
        });

        this.canvas.addEventListener('mouseup', function(e) {
            return $this.onmouseup(e, e);
        });
        this.canvas.addEventListener('touchend', function(e) {
            return $this.onmouseup(e, e.touches[0]);
        });

        var $this = this;
        bgimg.onload = function() {
            backingCtx.drawImage(bgimg, 0, 0, backing.width, backing.height);
        };
        bgimg.src = bgimgURL;        
    };

    this.onmousedown = function(e, touch) {
        mouseDown = true;
    };

    this.onmouseup = function(e, touch) {
        mouseDown = false;
    };

    this.onmousemove = function(e, touch) {
        if (!mouseDown) return;
        canvasX = touch.pageX - this.canvas.offsetLeft;
        canvasY = touch.pageY - this.canvas.offsetTop;
        canvasCtx.putImageData(imageData, 0, 0);
        if (mouseDown) {
            var range = 10;
            var w = this.canvas.width;
            for (var dx = 0; dx < range; dx++) {
                var x = canvasX - range + dx;
                for (var dy = 0; dy < range; dy++) {
                    if (mask[dy].charAt(dx) !== '*') continue;
                    var y = canvasY - range + dy;
                    var index = (y * w + x) * 4;
                    imageData.data[index + 3] -= 12;
                }
            }
        }
    };
}
