HirsuteMiasma = function() {
    var canvas;
    var ctx;
    var request;

    var x;
    var y;
    var v;  // darkness
    var theta = 0;  // in degrees
    var dist = 5;
    var tick = 0;
    var grab = 0;
    var flickMode = 0;

    var status = document.getElementById('status');
    var cycle = document.getElementById('cycle');
    var terminal = document.getElementById('terminal');

    this.draw = function() {
        x = canvas.width / 2;
        y = canvas.height / 2;

        ctx.beginPath();
        ctx.lineWidth = 2;
        var prevV = v;
        v = Math.floor((Math.cos(tick / 100) + 1) * 128);
        if (status) status.innerHTML = v;
      
        if ((prevV === 1 && v === 0) || (prevV === 254 && v === 255)) {
            grab = 350;
        }

        if (flickMode) {
            if (prevV === 255) v = 0; else v = 255;
        }
          
        ctx.strokeStyle = "rgb(" + v +"," + v + "," + v + ")";
        ctx.moveTo(x, y);
        while (!(x < 0 || x > canvas.width || y < 0 || y > canvas.height)) {
            var rad = (theta / 360) * (Math.PI * 2);

            var dx = dist * Math.cos(rad);
            var dy = dist * Math.sin(rad);

            var newX = x + dx;
            var newY = y + dy;

            ctx.lineTo(newX, newY);

            x = newX;
            y = newY;

            if (Math.random() > 0.5) {
                theta += 22.5;
            } else {
                theta -= 22.5;
            }
        }
        ctx.stroke();

        if (cycle) flickMode = cycle.checked;
        if (!flickMode) {
            if (!grab) {
              tick++;
            } else {
              if (terminal.checked && v === 0) {
              } else {
                grab--;
              }
            }
        }
    }

    this.start = function(c) {
        canvas = c;
        ctx = canvas.getContext('2d');
        this.draw();
        var $this = this;
        var animFrame = function(time) {
            $this.draw();
            request = requestAnimationFrame(animFrame);
        };
        request = requestAnimationFrame(animFrame);
    }
}
