function ProgressionController() {
    var counter;
    var request;
    var canvas;

    this.draw = function(timeElapsed) {
      var ctx = canvas.getContext('2d');

      var counter_elem = document.getElementById('counter');
      if (counter_elem) {
          counter_elem.innerHTML = Math.floor(counter);
              // + "<br/>" + timeElapsed;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "black";
      ctx.moveTo(0,0);
      var y = 200;
      var w = (canvas.width / counter);
      for (var i = 1; i <= counter; i++) {
          ctx.lineTo(w * i, y);
          y = (y == 200 ? 0 : 200);
      }
      ctx.lineTo(canvas.width,0);
      ctx.stroke();

      counter += timeElapsed / 45.0;
    };

    this.start = function(c) {
      canvas = c;
      counter = 1;
      var $this = this;
      var lastTime = null;
      var animFrame = function(time) {
          var timeElapsed = lastTime == null ? 0 : time - lastTime;
          lastTime = time;
          $this.draw(timeElapsed);
          requestAnimationFrame(animFrame);
      };
      requestAnimationFrame(animFrame);
    };
}

