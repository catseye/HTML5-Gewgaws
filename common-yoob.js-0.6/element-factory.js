/*
 * This file is part of yoob.js version 0.7-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * Functions for creating elements.
 *
 * I dunno -- maybe just setting innerHTML would be better.
 */

yoob.makeCanvas = function(container, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);
    return canvas;
};

yoob.makeButton = function(container, label) {
    var button = document.createElement('button');
    button.innerHTML = label;
    container.appendChild(button);
    return button;
};

yoob.makeCheckbox = function(container, name, labelText) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = 'cb_' + name;
    checkbox.checked = false;
    var label = document.createElement('label');
    label.htmlFor = 'cb_' + name;
    label.appendChild(document.createTextNode(labelText));
    
    container.appendChild(checkbox);
    container.appendChild(label);
    
    return checkbox;
};

yoob.makeSlider = function(container, min, max, value) {
    var slider = document.createElement('input');
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.value = value;
    container.appendChild(slider);
    return slider;
};
