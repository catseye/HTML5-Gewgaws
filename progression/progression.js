function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "animation.js",
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);
                var t = new Progression();
                var canvas = yoob.makeCanvas(container, 800, 200);
                var counterElem = yoob.makeParagraph(container);
                t.init(canvas, counterElem);
            }
        };
        document.body.appendChild(elem);
    }
}

function Progression() {
    var counter;
    var canvas;
    var ctx;

    this.draw = function(timeElapsed) {
      if (this.counter_elem) {
          this.counter_elem.innerHTML = Math.floor(counter);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.moveTo(0, 0);
      var y = 200;
      var w = (canvas.width / counter);
      for (var i = 1; i <= counter; i++) {
          ctx.lineTo(w * i, y);
          y = (y == 200 ? 0 : 200);
      }
      ctx.lineTo(canvas.width, 0);
      ctx.stroke();
      counter += timeElapsed / 60.0;
    };

    this.init = function(c, counter_elem) {
      canvas = c;
      this.counter_elem = counter_elem;
      ctx = canvas.getContext('2d');
      counter = 1;
      this.animation = (new yoob.Animation()).init({
          object: this,
          mode: 'proportional'
      });
      this.animation.start();
    };
}
