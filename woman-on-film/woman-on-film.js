function launch(prefix, containerId) {
    var deps = [
        "element-factory.js",
        "path.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded == deps.length) {
                var container = document.getElementById(containerId);

                var map = yoob.makeCanvas(container, 432, 284);
                map.style.background = "transparent";
                map.style.position = "absolute";
                map.style.zIndex = "100";

                var quotation_container = yoob.makeSpan(container);
                quotation_container.style.width = "432px";
                quotation_container.style.height = "284px";
                quotation_container.style.background = "transparent";
                quotation_container.style.position = "absolute";
                quotation_container.style.zIndex = "50";

                var quotation = yoob.makeSpan(quotation_container);
                quotation.style.width = "432px";
                quotation.style.height = "284px";
                quotation.style.background = "transparent";
                quotation.style.display = "table-cell";
                quotation.style.verticalAlign = "middle";
                quotation.style.padding = "2px";
                quotation.style.fontSize = "150%";
                quotation.style.textShadow = "2px 2px 2px #404040";
                quotation.style.color = "white";
                quotation.style.lineHeight = "30px";

                var canvas = yoob.makeCanvas(container, 432, 284);
                yoob.makeLineBreak(container);

                var buttons_container = yoob.makeDiv(container);
                var buttons = {};
                buttons.up = yoob.makeButton(buttons_container, '↑');

                yoob.makeLineBreak(buttons_container);
                buttons.left = yoob.makeButton(buttons_container, '←');
                buttons.showMap = yoob.makeButton(buttons_container, 'map');
                buttons.right = yoob.makeButton(buttons_container, '→');
                yoob.makeLineBreak(buttons_container);
                buttons.down = yoob.makeButton(buttons_container, '↓');

                for (key in buttons) {
                    buttons[key].style.fontSize = '125%';
                    buttons[key].style.lineHeight = '25px';
                }

                var t = new WomanOnFilm();
                t.init(canvas, quotation, map, buttons);
            }
        };
        document.body.appendChild(elem);
    }
}

/* ================================================================== */

function makePathSets() {
  return [
// first attempt
[
new yoob.Path({title:"outline",strokeStyle:"black",lineWidth:"4",
    points:[49.666666666666664,141.33333333333334,57,94.66666666666667,65,86.66666666666667,81.33333333333333,76,81.66666666666667,72.66666666666667,80,69,75.33333333333333,73.66666666666667,66,79,58.666666666666664,79,54,75.66666666666667,53.333333333333336,65.66666666666667,48,62,44,62,46,65.66666666666667,42,65.33333333333333,40.666666666666664,62.333333333333336,42.666666666666664,59.333333333333336,43,57,41,55,41.666666666666664,54,44.333333333333336,53.333333333333336,50.333333333333336,54.666666666666664,55.333333333333336,49.666666666666664,59,40.666666666666664,65.33333333333333,29.333333333333332,73,14,87.33333333333333,2,92,1.3333333333333333,100.33333333333333,3.6666666666666665,109.33333333333333,7.333333333333333,116.66666666666667,15.333333333333334,122.66666666666667,28.333333333333332,128,41,130.66666666666666,51.333333333333336,134.33333333333334,57.333333333333336,139,58.666666666666664,136.66666666666666,65,132,71.33333333333333,130.33333333333334,73,144.33333333333334,78.33333333333333,143,80.66666666666667,156,92,167.66666666666666,106.33333333333333,179.33333333333334,124,188,141]}),
new yoob.Path({title:"face",strokeStyle:"black",
    points:[74,47,77.66666666666667,51.333333333333336,80.33333333333333,50.333333333333336,82.33333333333333,57.666666666666664,87.33333333333333,63.333333333333336,94.33333333333333,67.66666666666667,103.33333333333333,69.33333333333333,108,66,113.66666666666667,60.333333333333336,116,52,117,50,118,35,115,33.666666666666664,113.66666666666667,34.333333333333336,111.66666666666667,33,106,36.666666666666664,105.33333333333333,34.666666666666664,106.66666666666667,30.666666666666668,101.33333333333333,26.333333333333332,97.33333333333333,18.333333333333332,96.33333333333333,17,93.33333333333333,18,88,21.333333333333332,80.66666666666667,33,80,44.333333333333336,78.33333333333333,43.666666666666664,74,45.333333333333336,74,47.333333333333336]}),
new yoob.Path({title:"eyebrow",strokeStyle:"black",
    points:[86.33333333333333,31.666666666666668,89.66666666666667,29.666666666666668,92.33333333333333,29.666666666666668,95,31.333333333333332,97,32.333333333333336]}),
new yoob.Path({title:"mouth outline",strokeStyle:"black",
    points:[94.33333333333333,58,100.33333333333333,56.333333333333336,103,56.333333333333336,109.33333333333333,56.666666666666664,108,58.666666666666664,107,61,103.33333333333333,62.333333333333336,99.33333333333333,61.333333333333336,95.33333333333333,58.333333333333336]}),
new yoob.Path({title:"lips",strokeStyle:"black",
    points:[95,57.666666666666664,100.66666666666667,58.666666666666664,106.33333333333333,58.666666666666664,109,57.333333333333336]}),
new yoob.Path({title:"nose",strokeStyle:"black",
    points:[104.66666666666667,36.666666666666664,107,44.666666666666664,109,48.666666666666664,107.33333333333333,50.666666666666664,104.33333333333333,52.333333333333336,102,51.333333333333336,98.66666666666667,50,99.33333333333333,47.333333333333336,101.33333333333333,46.333333333333336]}),
new yoob.Path({title:"left eye",strokeStyle:"black",
    points:[88.33333333333333,38,91.33333333333333,36,94.66666666666667,35.666666666666664,98,37.333333333333336,96,39.666666666666664,91.66666666666667,40.333333333333336,89,38.333333333333336]}),
new yoob.Path({title:"right eye",strokeStyle:"black",
    points:[107.66666666666667,38,110.33333333333333,39.333333333333336,114.33333333333333,40,116,38,114.33333333333333,35.333333333333336,110.66666666666667,36,107.66666666666667,38]}),
new yoob.Path({title:"inner coat",strokeStyle:"black",
    points:[63.666666666666664,141.66666666666666,83,77.66666666666667,89.66666666666667,84.66666666666667,97.33333333333333,85.33333333333333,105.66666666666667,81.66666666666667,108.66666666666667,119,113.66666666666667,141.33333333333334]}),
new yoob.Path({title:"left neck",strokeStyle:"black",
    points:[80,69,86,70.66666666666667,82.66666666666667,59]}),
new yoob.Path({title:"scarf",strokeStyle:"black",
    points:[106,81,112,77.33333333333333,113,74,118.66666666666667,70.66666666666667,129.33333333333334,72,120.66666666666667,64.66666666666667,113,64.33333333333333,112,68.66666666666667,104.66666666666667,69.33333333333333,94,71,86.33333333333333,70.66666666666667]}),
new yoob.Path({title:"button 1",strokeStyle:"black",
    points:[116.66666666666667,80.66666666666667,113.33333333333333,81.33333333333333,112.33333333333333,85,114.33333333333333,87.66666666666667,117.66666666666667,88.33333333333333,119.66666666666667,85.66666666666667,120,83,117.66666666666667,81]}),
new yoob.Path({title:"button 2",strokeStyle:"black",
    points:[123,112.66666666666667,119.66666666666667,109.66666666666667,116.33333333333333,110.33333333333333,114.33333333333333,114,115.33333333333333,117.66666666666667,119,119.66666666666667,122.33333333333333,117.66666666666667,123.33333333333333,113.33333333333333]})
],
// 2nd attempt
[
new yoob.Path({title:"coat",fillStyle:"#8A6A00",strokeStyle:"black",closed:"true",
    points:[50,142.16666666666666,50.833333333333336,126.83333333333333,54.833333333333336,100.83333333333333,57.666666666666664,92.66666666666667,64,87.83333333333333,64.83333333333333,84.83333333333333,81.33333333333333,74.66666666666667,83.5,79.66666666666667,90.16666666666667,84.5,98.5,85,112.16666666666667,77.16666666666667,112.83333333333333,74,120.16666666666667,70.5,122.33333333333333,67.5,143.5,78,143.33333333333334,81.16666666666667,154.16666666666666,90.16666666666667,175.16666666666666,116.16666666666667,188.5,141.83333333333334]}),
new yoob.Path({title:"inner coat",fillStyle:"grey",closed:"true",
    points:[62.833333333333336,142.16666666666666,83.5,80,90.16666666666667,84.66666666666667,98.66666666666667,85.33333333333333,103.66666666666667,82.16666666666667,110.16666666666667,126.5,113.16666666666667,141.5]}),
new yoob.Path({title:"neck",fillStyle:"#F2C763",closed:"true",
    points:[83.16666666666667,59.5,82.83333333333333,67.66666666666667,88.16666666666667,70.5,96.16666666666667,70.33333333333333,105.16666666666667,68,111.66666666666667,67.66666666666667,112.5,65.16666666666667,112,62,109,64.83333333333333,104.66666666666667,68.16666666666667,99.5,68.33333333333333,92.83333333333333,67,87.33333333333333,63.833333333333336]}),
new yoob.Path({title:"face",fillStyle:"#F5D998",strokeStyle:"black",closed:"true",
    points:[99,68.33333333333333,104.5,68.16666666666667,108.66666666666667,65.16666666666667,114.16666666666667,59.166666666666664,115.5,51.666666666666664,118,38.833333333333336,117.33333333333333,33.666666666666664,115,22.5,108.5,17.166666666666668,96,16.833333333333332,89.5,19,84,26.166666666666668,79.83333333333333,32.5,79.5,42,77.83333333333333,39,75,38,73,40,73.5,46.333333333333336,76.16666666666667,50.666666666666664,78.5,51.333333333333336,80.83333333333333,49.833333333333336,82.83333333333333,59,87.33333333333333,63.833333333333336,93.16666666666667,67.16666666666667]}),
new yoob.Path({title:"hair",fillStyle:"#550000",strokeStyle:"black",lineWidth:"3",closed:"true",
    points:[59.333333333333336,79,73.5,74.83333333333333,80.33333333333333,66.33333333333333,85.16666666666667,69.33333333333333,80.83333333333333,49.833333333333336,78.66666666666667,51.5,76.16666666666667,50.833333333333336,73.33333333333333,46.166666666666664,73.33333333333333,43.5,77.33333333333333,44.333333333333336,79.66666666666667,41.5,79.83333333333333,32.5,89.5,19,96,16.833333333333332,100,20.333333333333332,101.83333333333333,26.333333333333332,106.33333333333333,29.333333333333332,106.33333333333333,33.166666666666664,104.66666666666667,36,107.5,36.333333333333336,110.5,32.666666666666664,113.83333333333333,33.166666666666664,114.5,35.333333333333336,115.83333333333333,33.166666666666664,117.33333333333333,33.833333333333336,118.16666666666667,38.666666666666664,115.66666666666667,51.833333333333336,114.16666666666667,59.333333333333336,111.83333333333333,61.666666666666664,112.33333333333333,65,118.33333333333333,64.83333333333333,131.5,72,134.83333333333334,70,139.33333333333334,58.833333333333336,136.5,58.166666666666664,131,52,128.83333333333334,42,125.16666666666667,36.166666666666664,121.5,22.5,118.33333333333333,15,110.16666666666667,6.333333333333333,102,3.5,91.16666666666667,1,89,1.1666666666666667,73.83333333333333,11.333333333333334,67.16666666666667,23.5,64,31,59.833333333333336,39.666666666666664,50.833333333333336,53.5,47.833333333333336,54.333333333333336,43.833333333333336,50.166666666666664,42.666666666666664,53,39.666666666666664,54.666666666666664,43,56,43.333333333333336,57.666666666666664,40.333333333333336,60.833333333333336,40.166666666666664,64.16666666666667,45,65.16666666666667,43,61.333333333333336,46.5,60.666666666666664,52.5,64.5,53.833333333333336,71,53.166666666666664,74]}),
new yoob.Path({title:"scarf",fillStyle:"red",closed:"true",
    points:[80,67.33333333333333,82.16666666666667,72.5,81.5,75,83.66666666666667,79.83333333333333,90.33333333333333,84.66666666666667,98.66666666666667,85.33333333333333,112.16666666666667,77.16666666666667,113,74,120.5,70.33333333333333,122.5,67,118.33333333333333,64.83333333333333,113,65,111.83333333333333,67.33333333333333,105.16666666666667,68.16666666666667,96.16666666666667,70.5,88.33333333333333,70.66666666666667,80.66666666666667,66.33333333333333]}),
new yoob.Path({title:"left eye",fillStyle:"white",strokeStyle:"black",closed:"true",
    points:[89.6,38.1,91.2,38.9,93.7,39,95.6,38.5,96.4,37.4,95.1,36,94.1,35.7,91.5,35.8,90.5,36.6]}),
new yoob.Path({title:"left pupil",fillStyle:"green",closed:"true",
    points:[93.5,37.7,93.8,36.8,94.8,36.1,95.8,36.6,96.1,37.5,95.4,38.6,94.5,38.6]}),
new yoob.Path({title:"right eye",fillStyle:"white",strokeStyle:"black",closed:"true",
    points:[107.9,37.5,109.4,38.3,111.9,38.6,113.6,38.1,114.7,36.9,113.7,35.5,112.8,35.3,109.9,35.3,108.7,36.1]}),
new yoob.Path({title:"right pupil",fillStyle:"green",closed:"true",
    points:[112,36.8,112.4,36,113.2,35.5,114.1,36.1,114.3,36.9,113.7,37.7,112.8,37.7]}),
new yoob.Path({title:"left eyebrow",strokeStyle:"black",
    points:[87.66666666666667,30.11111111111111,90,29.11111111111111,92.22222222222223,29.22222222222222,95.22222222222223,30.444444444444443,96.55555555555556,31.666666666666668]}),
new yoob.Path({title:"lips",fillStyle:"red",closed:"true",
    points:[96.22222222222223,57.77777777777778,99.77777777777777,56.111111111111114,106.55555555555556,56.333333333333336,108.22222222222223,57.333333333333336,107.22222222222223,58.55555555555556,105.22222222222223,59.55555555555556,100.55555555555556,59.666666666666664]}),
new yoob.Path({title:"lip line",strokeStyle:"black",
    points:[96.22222222222223,57.888888888888886,103.22222222222223,57.888888888888886,108.11111111111111,57.44444444444444]}),
new yoob.Path({title:"nostrils",strokeStyle:"black",
    points:[99.5,49.7,101.9,49.7,103.1,51.1,104.5,51.4,106.1,50.9,106.6,49.4,107.8,49.3]}),
new yoob.Path({title:"septum",strokeStyle:"black",
    points:[107.3,47.1,106.2,46.4,105.4,43.5,105,39.8]}),
new yoob.Path({title:"button 1",fillStyle:"white",closed:"true",
    points:[114.33333333333333,88.16666666666667,117.33333333333333,88.33333333333333,119.66666666666667,86.16666666666667,119.83333333333333,83.5,117.83333333333333,81.33333333333333,114.83333333333333,81.16666666666667,112.83333333333333,82.66666666666667,112.66666666666667,85.5]}),
new yoob.Path({title:"button 2",fillStyle:"white",closed:"true",
    points:[114.5,116.5,114.33333333333333,113,117,110.5,120,110.66666666666667,122.16666666666667,112.33333333333333,122.83333333333333,115.5,120.83333333333333,118.33333333333333,117.66666666666667,119]})
],
// third attempt
[
new yoob.Path({title:"hair 3",fillStyle:"#444444",closed:"true",
    points:[99.66666666666667,2.6666666666666665,107.5,5.333333333333333,116.16666666666667,12.833333333333334,125.16666666666667,36.5,128.83333333333334,38.166666666666664,134.33333333333334,38.166666666666664,128.83333333333334,39.333333333333336,125.83333333333333,38.666666666666664,129.16666666666666,42.833333333333336,129.66666666666666,47,132.66666666666666,49.166666666666664,137.16666666666666,49.333333333333336,138.83333333333334,52.333333333333336,138.16666666666666,59,137.66666666666666,53.666666666666664,136.66666666666666,52.166666666666664,131.33333333333334,52.5,131.16666666666666,57,133.83333333333334,59.666666666666664,138.66666666666666,59.5,134.66666666666666,66.5,134.16666666666666,69.66666666666667,129.33333333333334,72,120.33333333333333,68.16666666666667,101.33333333333333,71,93.5,4]}),
new yoob.Path({title:"hair 2",fillStyle:"#aaaaaa",closed:"true",
    points:[54.333333333333336,72.83333333333333,51.833333333333336,65.5,47.333333333333336,62.666666666666664,43.166666666666664,61.833333333333336,44.833333333333336,65,41.833333333333336,65.33333333333333,39.5,62,40.333333333333336,60.333333333333336,37.166666666666664,57.166666666666664,40.333333333333336,54,41,48,40.166666666666664,43,44.833333333333336,38.333333333333336,55.166666666666664,36.833333333333336,63.333333333333336,31.333333333333332,67.33333333333333,22.5,72.33333333333333,15.333333333333334,72.5,12.833333333333334,79.66666666666667,5.333333333333333,89.33333333333333,0.5,94.5,0.6666666666666666,102,3.1666666666666665,99.66666666666667,5.5,105,6.333333333333333,114,12.833333333333334,107.66666666666667,11,113.83333333333333,16,110.33333333333333,15.833333333333334,117,24,117,27.5,110.83333333333333,19.666666666666668,101.33333333333333,11,94.33333333333333,9.833333333333334,99.66666666666667,12.166666666666666,109.66666666666667,20.5,111.66666666666667,24,107.83333333333333,22.666666666666668,111.33333333333333,29.333333333333332,104.83333333333333,25,101.66666666666667,16.833333333333332,96.66666666666667,13.666666666666666,65.33333333333333,36,61.333333333333336,73.66666666666667]}),
new yoob.Path({title:"hair 1",fillStyle:"grey",closed:"true",
    points:[82.33333333333333,67.66666666666667,78.5,67.66666666666667,73.83333333333333,74.16666666666667,65.5,78,58,78.66666666666667,53.166666666666664,74.66666666666667,53.833333333333336,70.16666666666667,58.166666666666664,69.83333333333333,58.666666666666664,63.166666666666664,62,58.5,59.666666666666664,58.333333333333336,53.166666666666664,65,47.166666666666664,61.333333333333336,44.166666666666664,60.666666666666664,43.333333333333336,55.5,40.333333333333336,54,44.166666666666664,50.5,48.666666666666664,54.333333333333336,55.5,48.666666666666664,56.333333333333336,45.333333333333336,59.166666666666664,42.333333333333336,59.333333333333336,40.333333333333336,62.5,37.666666666666664,63.833333333333336,31,69.83333333333333,25.5,76.33333333333333,18.833333333333332,75.66666666666667,24,81.83333333333333,18.166666666666668,80.66666666666667,23.166666666666668,92.33333333333333,15,84,11.5,95.5,4.5,89.66666666666667,10.5,96.33333333333333,13,97.5,17]}),
new yoob.Path({title:"neck",fillStyle:"#ffccaa",strokeStyle:"black",closed:"true",
    points:[82.42857142857143,75.85714285714286,81.85714285714286,49.714285714285715,96.14285714285714,64.57142857142857,104.57142857142857,64.57142857142857,112,59,112.14285714285714,69.71428571428571,102,78.57142857142857]}),
new yoob.Path({title:"face",fillStyle:"#ffccaa",strokeStyle:"black",closed:"true",
    points:[83.5,59.333333333333336,90,64.66666666666667,97.5,67.83333333333333,101.5,68.33333333333333,105.16666666666667,67.5,110.66666666666667,63.333333333333336,114.16666666666667,59.166666666666664,116,50.666666666666664,117.33333333333333,47,118.16666666666667,38.833333333333336,117.33333333333333,37,117.33333333333333,34,113.16666666666667,32.5,105,36.5,106.66666666666667,29.5,101.5,25.5,97.66666666666667,17.166666666666668,92.33333333333333,17.166666666666668,80.5,31.5,79.83333333333333,33.333333333333336,79.66666666666667,40.666666666666664,77.16666666666667,44.166666666666664,74,44.166666666666664,74.16666666666667,47.666666666666664,77.5,51.5,80.66666666666667,49.833333333333336]}),
new yoob.Path({title:"lips",fillStyle:"#ffaacc",strokeStyle:"black",closed:"true",
    points:[93.6,57.8,99,56,102.7,55.5,103.7,55.9,104.6,55.6,107.7,56,109.4,56.7,108,57.9,107.3,60,105.4,61.3,100.6,61.4,98.6,60.8,96.7,58.9]}),
new yoob.Path({title:"lip line",strokeStyle:"black",
    points:[94.5,57.9,106.1,58,109.1,56.8]}),
new yoob.Path({title:"left eye",fillStyle:"#faaaaa",strokeStyle:"black",closed:"true",
    points:[87.71428571428571,37.714285714285715,88.28571428571429,36.285714285714285,90.57142857142857,34.857142857142854,95.57142857142857,34.857142857142854,98,37,97.85714285714286,38.857142857142854,95,40.857142857142854,90.85714285714286,41,88.28571428571429,39.142857142857146]}),
new yoob.Path({title:"right eye",fillStyle:"#faaaaa",strokeStyle:"black",closed:"true",
    points:[106.71428571428571,38.57142857142857,109.28571428571429,40.714285714285715,113.42857142857143,41,114.85714285714286,39.142857142857146,115.14285714285714,36.42857142857143,113.71428571428571,35.142857142857146,109,35,107.14285714285714,37]}),
new yoob.Path({title:"nose",strokeStyle:"black",
    points:[104,36.285714285714285,105.57142857142857,45.285714285714285,105.71428571428571,50.57142857142857,107.71428571428571,49,100.57142857142857,49.57142857142857]}),
new yoob.Path({title:"coat 1",fillStyle:"brown",strokeStyle:"black",closed:"true",
    points:[50.4,142,50.8,127.8,53.6,118,54.8,102.6,56,96.4,58,91.6,64.2,87.8,65,84.6,71.8,81.2,82.4,74.2,121.6,69.2,143.2,78,142.2,80.2,150,86.2,173.2,113,188.4,141.2]}),
new yoob.Path({title:"coat 2",fillStyle:"brown",strokeStyle:"black",closed:"true",
    points:[112.6,73.8,118.8,79,143.6,79.4,143,93.4,145.6,113.6,155.8,141.6,189,141.8,175.2,116.6,157.4,94.4,142.6,80.6,144,78.8,117.2,66.8]}),
new yoob.Path({title:"vest",fillStyle:"#005500",strokeStyle:"black",closed:"true",
    points:[62.4,141.8,84.2,76.8,106.6,77,104.6,89,108,118.4,114.2,141.8]}),
new yoob.Path({title:"scarf",fillStyle:"blue",strokeStyle:"black",closed:"true",
    points:[82.42857142857143,77.14285714285714,82.57142857142857,71.85714285714286,80.85714285714286,67.57142857142857,82.42857142857143,63.857142857142854,83.71428571428571,68,86.57142857142857,70.71428571428571,92.85714285714286,71,101.57142857142857,69,112.28571428571429,68.28571428571429,113.28571428571429,67,112.85714285714286,64.28571428571429,119.57142857142857,64.71428571428571,122.71428571428571,70,119.28571428571429,69.57142857142857,112.71428571428571,72.42857142857143,112.28571428571429,76.71428571428571,99.14285714285714,85,90.85714285714286,85.14285714285714]}),
new yoob.Path({title:"left pupil",fillStyle:"black",closed:"true",
    points:[93.11111111111111,37.666666666666664,94.33333333333333,38.44444444444444,96,38.666666666666664,97.66666666666667,37.333333333333336,96.22222222222223,35.77777777777778,94.55555555555556,35.77777777777778]}),
new yoob.Path({title:"right pupil",fillStyle:"black",closed:"true",
    points:[111.44444444444444,37.333333333333336,112.55555555555556,35.111111111111114,114.11111111111111,35.333333333333336,114.88888888888889,36.44444444444444,114.55555555555556,37.666666666666664,113.11111111111111,38.22222222222222]}),
new yoob.Path({title:"r.sleeve",strokeStyle:"black",
    points:[56.2,141.8,62.6,112,74,84.6,81.2,84.2,79.6,80.4,74,78.8,64.6,84.2,62.4,93,73.8,84.8]}),
new yoob.Path({title:"button 1",fillStyle:"gainsboro",strokeStyle:"black",closed:"true",
    points:[111.8,83.2,112.4,86.4,116.8,87.8,120.2,85.2,120,82.8,116,80]}),
new yoob.Path({title:"button 2",fillStyle:"gainsboro",strokeStyle:"black",closed:"true",
    points:[114.4,112.8,114.8,117,117,118.6,120.6,119.2,122.6,117.2,123,112.4,120.4,110.4,117,110]})
]
];
}

/* ================================================================== */

var quotationMapStyle = "rgba(150,100,0,0.66)";
var zQuotationMapStyle = "rgba(0,100,150,0.66)";
var mQuotationMapStyle = "rgba(0,150,100,0.66)";

var clonePathSet = function(pathSet) {
    var n = [];
    for (var i = 0; i < pathSet.length; i++) {
        n.push(pathSet[i].clone());
    }
    return n;
};

var mapWithJitter = function(path, jitter) {
    var r = function() {
        return Math.random() * jitter - (jitter / 2);
    };
    return path.map(function(x, y) {
        return [x + r(), y + r()];
    });
};


function WomanOnFilm() {
    var cx;
    var cy;
    var hx;
    var hy;
    var canvas;
    var ctx;
    var map;
    var mapctx;
    var quotation;
    var buttons;
    var mapShown = false;
    var count = 0;
    var transitionFromDx = undefined;
    var transitionFromDy = undefined;
    var transitionCount = undefined;

    var pathSets = makePathSets();
    var jPathSets = [];
    var currentJitter = 0.7;
    var currentJitterRate = 6;

    var persPathSet = undefined;

    var cmap;
    cmap = [
      // row 2 (well actually 1)
      [
        undefined,
        undefined,
        {
          onenter: function() {
            setQuotation(
              "I love Los Angeles. I love Hollywood. They're so beautiful. " +
              "Everything's plastic, but I love plastic. I want to be plastic."
            );
          },
          mapstyle: quotationMapStyle
        },
        {
          // WARHOL 1
          draw: function () {
            drawPaths(ctx, "#aaffff", jPathSets[0], 0, 0);
            drawPaths(ctx, "#ffaaff", jPathSets[1], hx, 0);
            drawPaths(ctx, "#ffffaa", jPathSets[2], 0, hy);
            drawPaths(ctx, "#aaaaaa", jPathSets[0], hx, hy);
            drawPaths(ctx, "transparent", jPathSets[0], 0, 0, 2, 2,
                {lineWidth: 2, strokeStyle:"rgba(0,0,0,0.5)"});
          }
        },
        {
          // WARHOL 2
          draw: function () {
            drawPaths(ctx, "#ffffff", jPathSets[0], 0, 0);
            drawPaths(ctx, "#ffaaaa", jPathSets[1], hx, 0, 1, 1,
                {lineWidth: 2, strokeStyle:"black"});
            drawPaths(ctx, "#aaffaa", jPathSets[2], 0, hy);
            drawPaths(ctx, "#aaaaff", jPathSets[0], hx, hy);
            drawPaths(ctx, "transparent", jPathSets[1], 0, 0, 2, 2,
                {lineWidth: 2, fillStyle:"rgba(0,0,0,0.5)"});
          }
        },
        {
          // WARHOL 3
          draw: function () {
            drawPaths(ctx, "#ff00aa", jPathSets[0], 0, 0);
            drawPaths(ctx, "#ffaa00", jPathSets[1], hx, 0);
            drawPaths(ctx, "#aa00ff", jPathSets[2], 0, hy, 1, 1,
              {lineWidth: 2, strokeStyle:"#ff00ff"});
            drawPaths(ctx, "#aaff00", jPathSets[2], hx, hy, 1, 1,
              {lineWidth: 2, strokeStyle:"#00aaff"});
            drawPaths(ctx, "transparent", jPathSets[2], 0, 0, 2, 2);
          }
        }
      ],
      // row 3
      [
        {
          draw: function () {
            drawPaths(ctx, "white", jPathSets[0], 0, 0, 2, 2);
          }
        },
        {
          draw: function () {
            drawPaths(ctx, "white", jPathSets[1], 0, 0, 2, 2);
          }
        },
        {
          draw: function () {
            drawPaths(ctx, "white", jPathSets[2], 0, 0, 2, 2);
          }
        },
        undefined,
        undefined,
        {
          // merge node
          onenter: function() {
            setQuotation(
              "Right when I was being shot and ever since, I knew that I was watching " +
              "television. The channels switch, but it's all television."
            );
          },
          mapstyle: quotationMapStyle
        },
        {
          // TV 1
          draw: function () {
            ctx.fillStyle = "#d0d0d0";
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
            ctx.fillStyle = "#404040"; // bah
            ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

            // sun
            ctx.beginPath();
            ctx.arc(canvas.width * 0.17, canvas.height * 0.25,
                    canvas.height * 0.10, 0, Math.PI * 2, false);
            ctx.fillStyle = "#f7f7f7";
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

            // cactus
            ctx.beginPath();
            var cacx = 0.85;
            var cacxl = cacx - 0.045;
            var cacxr = cacx + 0.040;
            
            ctx.moveTo(canvas.width * cacx, canvas.height * 0.75);
            ctx.lineTo(canvas.width * cacx, canvas.height * 0.25);

            ctx.moveTo(canvas.width * cacx, canvas.height * 0.45);
            ctx.lineTo(canvas.width * cacxl, canvas.height * 0.45);
            ctx.lineTo(canvas.width * cacxl, canvas.height * 0.33);

            ctx.moveTo(canvas.width * cacx, canvas.height * 0.55);
            ctx.lineTo(canvas.width * cacxr, canvas.height * 0.55);
            ctx.lineTo(canvas.width * cacxr, canvas.height * 0.45);

            ctx.lineWidth = 15;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#101010";
            ctx.stroke();

            drawPaths(ctx, "transparent", jPathSets[0], 0, 0, 2, 2,
                function(p) {
                    if (p.title === 'outline') {
                        return {strokeStyle:"black",fillStyle:"#808080",
                                lineWidth:4};
                    }
                    if (p.title === 'left eye' || p.title === 'right eye') {
                        return {strokeStyle:"black",fillStyle:"#959595",
                                lineWidth:0.5};
                    }
                    return true;
                });
          }
        },
        {
          // TV 2
          draw: function () {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            var x1 = 0;
            var y1 = 0;
            var x2 = canvas.width;
            var y2 = canvas.height;
            var cx = canvas.width * 0.75;
            var cy = canvas.height * 0.25;
            var c = 128;
            var f = 0.25;
            for (var i = 0; i < 10; i++) {
                ctx.fillStyle = "rgba(" + c + ",0,0,1.0)";
                if (i === 9) ctx.fillStyle = "#222222";
                ctx.fillRect(x1, y1, x2-x1, y2-y1);
                ctx.strokeRect(x1, y1, x2-x1, y2-y1);
                var nx1 = x1 + Math.abs(cx-x1) * f;
                var nx2 = x2 - Math.abs(cx-x2) * f;
                var ny1 = y1 + Math.abs(cy-y1) * f;
                var ny2 = y2 - Math.abs(cy-y2) * f;

                if (i < 9) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1); ctx.lineTo(nx1, ny1);
                    ctx.moveTo(x2, y1); ctx.lineTo(nx2, ny1);
                    ctx.moveTo(x1, y2); ctx.lineTo(nx1, ny2);
                    ctx.moveTo(x2, y2); ctx.lineTo(nx2, ny2);
                    ctx.stroke();
                }

                c = Math.floor(c * 0.75);
                x1 = nx1; y1 = ny1; x2 = nx2; y2 = ny2;
            }
            drawPaths(ctx, "transparent", jPathSets[1], 0, 0, 2, 2);
          }
        },
        {
          // TV 3
          draw: function () {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
            ctx.fillStyle = "#000060";
            ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

            // moon
            var moonRadius = canvas.height * 0.08;
            var moonX = canvas.width * 0.80;
            ctx.beginPath();
            ctx.arc(moonX, canvas.height * 0.25,
                    moonRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = "#b0b090";
            ctx.fill();

            // reflection
            ctx.strokeStyle = "#7070ff";
            ctx.lineWidth = 2;
            var lines = [[0.5, 0.70], [1.0, 0.75], [0.5, 0.80]];
            for (var i = 0; i < lines.length; i++) {
                var r = moonRadius * lines[i][0] + 3 * Math.cos(count / 10.0);
                var y = canvas.height * lines[i][1] + 3 * Math.sin((count + (i * 10)) / 10.0);
                ctx.beginPath();
                ctx.moveTo(moonX - r, y);
                ctx.lineTo(moonX + r, y);
                ctx.stroke();
            }

            drawPaths(ctx, "transparent", jPathSets[2], 0, 0, 2, 2);
          }
        },
        {
          onenter: function() {
            setQuotation(
              "... when you do something exactly wrong, you always turn up something."
            );
          },
          mapstyle: quotationMapStyle
        },
        {
          draw: function () {
            // COMPOSITE WOMAN
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPaths(ctx, "transparent", jPathSets[0], 0, 0, 2, 2,
                {lineWidth: 2, fillStyle:"rgba(0,0,0,0.2)"});
            drawPaths(ctx, "transparent", jPathSets[1], 0, 0, 2, 2,
                {lineWidth: 2, fillStyle:"rgba(0,0,0,0.2)"});
            drawPaths(ctx, "transparent", jPathSets[2], 0, 0, 2, 2,
                {lineWidth: 2, fillStyle:"rgba(0,0,0,0.2)"});
          }
        },
        {
          draw: function () {
            // RGB NEON
            drawPaths(ctx, "white", jPathSets[0], 0, 0, 2, 2,
                {lineWidth: 1, strokeStyle:"rgba(255,0,0,0.8)"});
            drawPaths(ctx, "transparent", jPathSets[1], 0, 0, 2, 2,
                {lineWidth: 1, strokeStyle:"rgba(0,255,0,0.8)"});
            drawPaths(ctx, "transparent", jPathSets[2], 0, 0, 2, 2,
                {lineWidth: 1, strokeStyle:"rgba(0,0,255,0.8)"});
          }
        },
        {
          draw: function () {
            // STARS
            if (count % 4 !== 0) return;
            foreachPaths(ctx, "black", jPathSets[1], 0, 0, 2, 2,
                function(path, x, y) {
                    ctx.beginPath();
                    ctx.fillStyle = "yellow";
                    ctx.strokeStyle = "white";
                    var r = Math.random() * 2;
                    if (Math.random() > 0.5) {
                        r *= 1.5;
                        //ctx.fillStyle = "white";
                        //ctx.strokeStyle = "#aaaaaa";
                    }
                    ctx.arc(x, y, r, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            );
          }
        },
        {
          onenter: function() {
            setQuotation(
              "[...] one anxiously awaits a movie in which her harmony won't be drowned out by the filmmaker's noodling.",
              'http://www.metroactive.com/papers/metro/09.19.96/grace-heart-9638.html'
            );
          },
          draw: function () {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          },
          mapstyle: mQuotationMapStyle
        }
      ],
      // row 4
      [
        {
          draw: function () {
            // SEQUENCE OF TRACINGS
            drawPaths(ctx, "white", jPathSets[0], 0, 0, 1, 1,
                function(p) {
                    return p.title === 'outline';
                });
            drawPaths(ctx, "white", jPathSets[0], hx, 0, 1, 1,
                function(p) {
                    return p.title === 'outline'
                        || p.title === 'inner coat'
                        || p.title === 'scarf';
                });
            drawPaths(ctx, "white", jPathSets[0], 0, hy, 1, 1,
                function(p) {
                    return p.title === 'outline'
                        || p.title === 'inner coat'
                        || p.title === 'left neck'
                        || p.title === 'scarf'
                        || p.title === 'face';
                });
            drawPaths(ctx, "white", jPathSets[0], hx, hy, 1, 1);
          }
        },
        undefined,
        {
          onenter: function() {
            setQuotation(
              "People sometimes say that the way things happen in movies is unreal, " +
              "but actually it's the way things happen in life that's unreal."
            );
          },
          mapstyle: quotationMapStyle
        },
        {
          draw: function () {
            drawPaths(ctx, "#00aa00", jPathSets[0], 0, 0, 1, 1,
                function(p) {
                    if (p.title === 'outline') {
                        return {fillStyle:"#aa00aa"};
                    } else {
                        return {lineWidth: 2, strokeStyle:"#000000"};
                    }
                });
            drawPaths(ctx, "#aa00aa", jPathSets[0], hx, 0, 1, 1,
                function(p) {
                    if (p.title === 'outline') {
                        return {fillStyle:"#0000aa"};
                    } else {
                        return {lineWidth: 2, strokeStyle:"#000000"};
                    }
                });
            drawPaths(ctx, "#0000aa", jPathSets[0], 0, hy, 1, 1,
                function(p) {
                    if (p.title === 'outline') {
                        return {fillStyle:"#00aa00"};
                    } else {
                        return {lineWidth: 2, strokeStyle:"#000000"};
                    }
                });
            drawPaths(ctx, "#00aa00", jPathSets[0], hx, hy, 1, 1,
                function(p) {
                    if (p.title === 'outline') {
                        return {fillStyle:"#0000aa",
                                lineWidth: 2, strokeStyle:"#ffffff"};
                    } else {
                        return {lineWidth: 2, strokeStyle:"#ffffff"};
                    }
                });
          }
        },
        {
          draw: function () {
            // EIGHT ELVISES
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var dx = 50;
            var dy = 71;
            var s = 1.25;
            var o = {strokeStyle: "black", lineWidth: 1};
            drawPaths(ctx, "transparent", jPathSets[1],   0-dx, dy,   s, s, o)
            drawPaths(ctx, "transparent", jPathSets[1], (hx*0.25)-dx, dy+4, s, s, o);
            drawPaths(ctx, "transparent", jPathSets[1], (hx*0.50)-dx, dy+8, s, s, o);
            drawPaths(ctx, "transparent", jPathSets[1], (hx*0.75)-dx, dy,   s, s, o);
            drawPaths(ctx, "transparent", jPathSets[1], (hx*1.00)-dx, dy-4, s, s, o);
            drawPaths(ctx, "transparent", jPathSets[1], (hx*1.12)-dx, dy,   s, s, o);
            drawPaths(ctx, "transparent", jPathSets[1], (hx*1.20)-dx, dy-4, s, s, o);
            drawPaths(ctx, "transparent", jPathSets[1], (hx*1.25)-dx, dy-4, s, s, o);
          }
        },
        {
          // LOTS OF COLOUR
          draw: function () {
            drawPaths(ctx, "#bbbbbb", jPathSets[2], 0, 0, 1, 1,
                function(p) {
                    if (p.title === 'coat 1' || p.title === 'coat 2') {
                        return {fillStyle:"#004444", strokeStyle:"black"};
                    }
                    if (p.title === 'hair 1') {
                        return {fillStyle:"#800000"};
                    }
                    if (p.title === 'hair 2') {
                        return {fillStyle:"#ff0000"};
                    }
                    if (p.title === 'hair 3') {
                        return {fillStyle:"#440000"};
                    }
                    if (p.title === 'scarf') {
                        return {fillStyle:"#d0d000",
                          strokeStyle:"black",
                          lineWitdh:2};
                    }
                    if (p.title === 'vest') {
                        return {fillStyle:"white"};
                    }
                });
            drawPaths(ctx, "white", jPathSets[2], hx, 0, 1, 1,
                function(p) {
                    if (p.title === 'coat 1' || p.title === 'coat 2') {
                        return {fillStyle:"#440044", strokeStyle:"black"};
                    }
                    if (p.title === 'hair 1') {
                        return {fillStyle:"#008000"};
                    }
                    if (p.title === 'hair 2') {
                        return {fillStyle:"#00ff00"};
                    }
                    if (p.title === 'hair 3') {
                        return {fillStyle:"#004400"};
                    }
                    if (p.title === 'scarf') {
                        return {fillStyle:"#009999",
                          strokeStyle:"black",
                          lineWitdh:2};
                    }
                    if (p.title === 'vest') {
                        return {fillStyle:"black"};
                    }
                });
            drawPaths(ctx, "white", jPathSets[2], 0, hy, 1, 1,
                function(p) {
                    if (p.title === 'coat 1' || p.title === 'coat 2') {
                        return {fillStyle:"#444400", strokeStyle:"black"};
                    }
                    if (p.title === 'hair 1') {
                        return {fillStyle:"#000080"};
                    }
                    if (p.title === 'hair 2') {
                        return {fillStyle:"#0000ff"};
                    }
                    if (p.title === 'hair 3') {
                        return {fillStyle:"#000044"};
                    }
                    if (p.title === 'scarf') {
                        return {fillStyle:"black",
                          strokeStyle:"black",
                          lineWitdh:2};
                    }
                    if (p.title === 'vest') {
                        return {fillStyle:"#808080"};
                    }
                });
            drawPaths(ctx, "#bbbbbb", jPathSets[2], hx, hy, 1, 1);
          }
        },
        undefined,
        undefined,
        undefined,
        undefined,
        {
          // "RONALD MC-WOMAN-ON-FILM"
          onenter: function () {
            currentJitter = 1.25;
            currentJitterRate = 3;
            quotation.innerHTML = '';
            quotation.style.background = 'transparent';
          },
          draw: function () {
            drawPaths(ctx, "yellow", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "orange", lineWidth: 16});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "white", lineWidth: 14});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "red", lineWidth: 12});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "white", lineWidth: 10});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "orange", lineWidth: 8});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "white", lineWidth:  7});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "yellow", lineWidth: 6});
            drawPaths(ctx, "transparent", jPathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "orange", lineWidth: 4});
            drawPaths(ctx, "transparent", jPathSets[0], 0, 0, 2, 2,            
              {strokeStyle: "red", lineWidth: 2});
            drawPaths(ctx, "transparent", pathSets[0], 0, 0, 2, 2,
              {strokeStyle: "black", lineWidth: 1});
          }
        },
        {
          // ANGEL / DEVIL
          draw: function () {
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

            drawPaths(ctx, "red", jPathSets[1], -10, hy * 0.25, 1, 1,
              {fillStyle: "white", strokeStyle: "white", lineWidth: 2});

            ctx.beginPath();
            var bx = 65;
            var by = 20;
            var bw = 40;
            ctx.moveTo(bx, by);
            ctx.bezierCurveTo(bx, by - 10, bx + bw, by - 10, bx + bw, by);
            ctx.bezierCurveTo(bx + bw, by + 10, bx, by + 10, bx, by);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "yellow";
            ctx.stroke();

            drawPaths(ctx, "white", jPathSets[1], hx, hy * 0.25, 1, 1,
              {fillStyle: "red", strokeStyle: "red", lineWidth: 2});

            ctx.beginPath();
            var bx = hx + 70;
            var by = 20;
            var bw = 50;
            ctx.moveTo(bx, by);
            ctx.bezierCurveTo(bx, by + 30, bx + bw, by + 30, bx + bw, by);
            ctx.bezierCurveTo(bx + bw, by + 40, bx, by + 40, bx, by);
            ctx.fillStyle = "red";
            ctx.fill();

            drawPaths(ctx, "transparent", jPathSets[1], 0, 0, 2, 2,
              {fillStyle: "black", strokeStyle: "white", lineWidth: 2});
            drawPaths(ctx, "transparent", jPathSets[1], 0, 0, 2, 2,
              {strokeStyle: "red", lineWidth: 0.5});
          }
        },
        {
          // MOVING BARS
          draw: function () {
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var numBars = 10;
            var barWidth = Math.ceil(canvas.width / numBars);
            for (var i = 0; i < numBars + 2; i++) {
                ctx.fillStyle = i % 2 === 0 ? "black": "white";
                var offs = (count + 40) % (barWidth * 2);
                ctx.fillRect(i * barWidth - offs, 0, barWidth, canvas.height);
            }
            drawPaths(ctx, "transparent", jPathSets[2], 0, 0, 2, 2);
            for (var i = 0; i < numBars + 4; i++) {
                ctx.fillStyle = i % 4 === 0 ? "black": "transparent";
                var offs = (count + 40) % (barWidth * 4);
                ctx.fillRect(i * barWidth - offs, 0, barWidth, canvas.height);
            }
            drawPaths(ctx, "transparent", jPathSets[2], 0, 0, 2, 2,
                function(p) {
                    if (p.title === 'left eye' ||
                        p.title === 'right eye' ||
                        p.title === 'nose' ||
                        p.title === 'lips' ||
                        p.title === 'lip line')
                        return {strokeStyle:"#400040", fillStyle:"#faaaaa",
                                lineWidth:0.5};
                    if (p.title === 'left pupil' ||
                        p.title === 'right pupil' ||
                        p.title === 'button 1' || p.title === 'button 2')
                        return true;
                    return false;
                });
          }
        }
      ],
      [
        // row 5
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          onenter: function() {
            setQuotation(
              "Now there was a Law in the Pyramid, tried and healthful, " +
              "which held that no male should have freedom to adventure " +
              "into the Night Land, before the age of twenty-two; " +
              "<em>and no female ever</em>.",
              "http://en.wikipedia.org/wiki/The_Night_Land"
            );
          },
          mapstyle: zQuotationMapStyle
        }
      ],
      [
        // row 6
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          onenter: function() {
            setQuotation(
              "And pride had we taken of ourselves to perceive those " +
              "monsters which had most of ugliness and horror to commend " +
              "them; for, thereby did we stand to have won the game of " +
              "watching, until such time as a more fearsome Brute be " +
              "discovered.",
              "http://en.wikipedia.org/wiki/The_Night_Land"
            );
          },
          mapstyle: zQuotationMapStyle
        },
        {
          // HIGH JITTER 2
          onenter: function () {
            currentJitter = 0;
            quotation.innerHTML = '';
            quotation.style.background = 'transparent';
          },
          draw: function () {
            drawPaths(ctx, "gainsboro", jPathSets[1], 0, 0, 2, 2);
            if (currentJitter < 20)
                currentJitter += 0.025;
          }
        },
        {
          // HIGH JITTER 1
          onenter: function () {
            currentJitter = 4;
            quotation.innerHTML = '';
            quotation.style.background = 'transparent';
          },
          draw: function () {
            drawPaths(ctx, "#303030", jPathSets[0], 0, 0, 2, 2);
          }
        }
      ],
      [
        // row 7 (actually 6)
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          // HIGH JITTER 3
          onenter: function () {
            persPathSet = clonePathSet(pathSets[2]);
            quotation.innerHTML = '';
            quotation.style.background = 'transparent';
          },
          draw: function () {
            //var color = "rgba(" + (count % 256) + ",0,0,1.0)";
            drawPaths(ctx, "white", persPathSet, 0, 0, 2, 2);
            // TODO this could be made more efficient
            // by in-place rewriting of points, but... whateva
            var newPathSet = [];
            for (var i = 0; i < persPathSet.length; i++) {
                newPathSet.push(mapWithJitter(persPathSet[i], 1));
            }
            persPathSet = newPathSet;
          }
        }
      ],
      [
        // row 8 (actually 7)
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          onenter: function() {
            setQuotation(
              "And so went the play; yet with ever, it doth " +
              "seem to me now, something of a half-known shudder to the " +
              "heart, and a child's rejoicing unknowingly in that safety " +
              "which had power to make light the seeming of such matters.",
              "http://en.wikipedia.org/wiki/The_Night_Land"
            );
          },
          mapstyle: zQuotationMapStyle
        }
      ]
    ];

    this.getCfg = function(cx, cy) {
        var g = cmap[cy];
        if (g === undefined) return undefined;
        return g[cx];

    };

    this.reJitterPaths = function() {
        for (var i = 0; i <= 2; i++) {
            var newPaths = [];
            for (var j = 0; j < pathSets[i].length; j++) {
                newPaths.push(mapWithJitter(pathSets[i][j], currentJitter));
            }
            jPathSets[i] = newPaths;
        }
    };

    this.showMap = function(setting) {
        if (setting === undefined) {
            mapShown = !mapShown;
        } else {
            mapShown = setting;
        }
        if (mapShown) {
            map.style.display = "inline";
            quotation.style.display = "none";
        } else {
            map.style.display = "none";
            quotation.style.display = "table-cell";
        }
    };

    this.drawMap = function() {
        mapctx.clearRect(0, 0, map.width, map.height);
        var mapWidth = 14;
        var mapHeight = cmap.length;
        var sizeX = 25;
        var sizeY = 25;
        
        var offX = (map.width - (sizeX * mapWidth)) / 2 + sizeX * 0.2;
        var offY = (map.height - (sizeY * mapHeight)) / 2 + sizeY * 0.2;

        for (var y = 0; y <= mapHeight; y++) {
            var g = cmap[y];
            if (g !== undefined) {
                for (var x = 0; x <= mapWidth; x++) {
                    var style = "transparent";
                    if (g[x] !== undefined) {
                        style = g[x].mapstyle || "rgba(0,0,0,0.5)";
                        if (x == cx && y == cy) {
                            style = "rgba(255,0,0,0.5)";
                        }
                        mapctx.fillStyle = style;
                        mapctx.fillRect(x * sizeX + offX, y * sizeY + offY,
                                     sizeX * 0.8, sizeY * 0.8);
                        mapctx.lineWidth = 1;
                        mapctx.strokeStyle = "rgba(255,255,255,0.5)";
                        mapctx.strokeRect(x * sizeX + offX, y * sizeY + offY,
                                       sizeX * 0.8, sizeY * 0.8);
                    }
                }
            }
        }
    };

    this.enableArrowButtons = function() {
        buttons.up.disabled = (this.getCfg(cx, cy-1) === undefined);
        buttons.down.disabled = (this.getCfg(cx, cy+1) === undefined);
        buttons.left.disabled = (this.getCfg(cx-1, cy) === undefined);
        buttons.right.disabled = (this.getCfg(cx+1, cy) === undefined);
        this.showMap(false);
    };

    this.move = function(dx, dy) {
        if (this.getCfg(cx+dx, cy+dy) === undefined) return;
        cx += dx;
        cy += dy;
        this.enableArrowButtons();
        transitionFromDx = dx;
        transitionFromDy = dy;
        transitionCount = 0;
        count = 0;
        currentJitter = 0.7;
        currentJitterRate = 6;

        var cfg = this.getCfg(cx, cy);
        if (cfg.onenter !== undefined) {
            cfg.onenter();
        } else {
            quotation.innerHTML = '';
            quotation.style.background = 'transparent';
        }
        if (cfg.draw === undefined) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            cfg.draw();
        }
    };

    var drawPaths = function(ctx, style, paths, x, y, sx, sy, where) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(sx || 1, sy || 1);
        ctx.fillStyle = style;
        ctx.fillRect(0, 0, hx, hy);
        for (var p = 0; p < paths.length; p++) {
            var path = paths[p];
            var override = where;
            if (typeof override === 'function') {
                override = override(path);
            }
            if (override === false) continue;
            if (typeof override === 'object') {
                path.drawOverride(ctx, override);
            } else {
                path.draw(ctx, {lineWidth: 0.5});
            }
        }
        ctx.restore();
    };

    var foreachPaths = function(ctx, style, paths, x, y, sx, sy, callback) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(sx || 1, sy || 1);
        ctx.fillStyle = style;
        ctx.fillRect(0, 0, hx, hy);
        for (var p = 0; p < paths.length; p++) {
            var path = paths[p];
            for (var i = 0; i < path.points.length; i += 2) {
                callback(path, path.points[i], path.points[i+1])
            }
        }
        ctx.restore();
    };
    
    var setQuotation = function(text, link) {
        link = link || "http://en.wikipedia.org/wiki/Andy_Warhol";
        quotation.innerHTML = '<a href="' + link + '">«' + text + '»</a>';
        quotation.style.background = 'black';
    };

    this.init = function(c, q, m, b) {
        canvas = c;
        ctx = canvas.getContext('2d');
        quotation = q;
        quotation.innerHTML = '';
        map = m;
        buttons = b;

        var $this = this;

        buttons.up.onclick = function() { $this.move(0,-1); };
        buttons.down.onclick = function() { $this.move(0,1); };
        buttons.left.onclick = function() { $this.move(-1,0); };
        buttons.right.onclick = function() { $this.move(1,0); };
        buttons.showMap.onclick = function() { $this.showMap(); };

        mapctx = map.getContext('2d');
        cx = 0;
        cy = 1;
        hx = canvas.width / 2;
        hy = canvas.height / 2;
        this.enableArrowButtons();
        currentJitter = 0.7;
        this.reJitterPaths();
        var intervalId = setInterval(function() {
            var cfg = $this.getCfg(cx, cy);
            if (cfg === undefined) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                if (count % currentJitterRate === 0) {
                    $this.reJitterPaths();
                }
                if (cfg.draw !== undefined) {
                    cfg.draw();
                }
                $this.drawMap();
                count++;
            }
        }, 16);
    };
};
