"use strict";

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
                var input = yoob.makeTextArea(
                    container, 80, 10
                );
                yoob.makeLineBreak(container);
                var caseSensitive = yoob.makeCheckbox(
                    container, true, "Case-sensitive"
                );
                var span = document.createElement('span');
                span.innerHTML = "&nbsp;&nbsp;";
                container.appendChild(span);
                var puncSensitive = yoob.makeCheckbox(
                    container, true, "Punctuation-sensitive"
                );
                var preserve = yoob.makeSelect(
                    container, "&nbsp; Preserve:", [
                        ['paragraph_breaks', "Paragraph breaks only", true],
                        ['line_breaks', "All line breaks"],
                        ['no_breaks', "Nothing"]
                    ]
                );
                
                var button = yoob.makeButton(container, "Uniquify");
                
                yoob.makeLineBreak(container);
                
                var output = document.createElement('pre');
                container.appendChild(output);
                output.style.textAlign = "left";
                output.style.whiteSpace = "pre-wrap";
                output.style.wordBreak = "normal";

                button.style.cursor = 'pointer';
                button.onclick = function() {
                    button.style.cursor = 'wait';
                    var preserveWhat = preserve.options[preserve.selectedIndex].value;
                    output.innerHTML = uniquify(
                        input.value, preserveWhat,
                        caseSensitive.checked, puncSensitive.checked
                    );
                    button.style.cursor = 'pointer';
                };
            }
        };
        document.body.appendChild(elem);
    }
}

function stripPunctuation(s) {
    var t = '';
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if ((c >= "0" && c <= "9") || (c >= "A" && c <= "Z") || (c >= 'a' && c <= 'z')) {
            t += c;
        }
    }
    return t;
}

function uniquify(text, preserve, caseSensitive, puncSensitive) {
    var set = {}
    var result = '';

    text = text.replace('\r', '\n').replace('\t', ' ');

    var lines = text.split('\n');

    for (var l = 0; l < lines.length; l++) {
        var words = lines[l].split(" ");

        var textLine = '';
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word === '') {
                continue;
            }
            var z = word;
            if (!puncSensitive) {
                z = stripPunctuation(z);
            }
            if (!caseSensitive) {
                z = z.toUpperCase();
            }
            if (!set[z]) {
                textLine += ' ' + word;
            }
            set[z] = true;
        }

        result += textLine.substring(1);

        if (preserve === 'line_breaks') {
            result += '\n';
        } else if (preserve === 'paragraph_breaks') {
            if (words.length === 1 && words[0] === '') {
                result += '\n\n';
            } else {
                result += ' ';
            }
        } else {
            result += ' ';
        }
    }

    return result;
};
