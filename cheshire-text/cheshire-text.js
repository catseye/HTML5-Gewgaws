function launch(prefix, containerId) {
    var container = document.getElementById(containerId);
    container.style.background = 'white';
    container.style.color = 'black';
    container.style.textAlign = 'left';

    var ps = [
      "The Cat only grinned when it saw Alice. It looked good-natured, she       thought: still it had very long claws and a great many teeth, so she felt       that it ought to be treated with respect.     ",
      "'Cheshire Puss,' she began, rather timidly, as she did not at all know       whether it would like the name: however, it only grinned a little wider.       'Come, it's pleased so far,' thought Alice, and she went on. 'Would you       tell me, please, which way I ought to go from here?'     ",
      "'That depends a good deal on where you want to get to,' said the Cat.     ",
      "'I don't much care where—' said Alice.     ",
      "'Then it doesn't matter which way you go,' said the Cat.     ",
      "'—so long as I get somewhere,' Alice added as an explanation.     ",
      "'Oh, you're sure to do that,' said the Cat, 'if you only walk long       enough.'     ",
      "Alice felt that this could not be denied, so she tried another question.       'What sort of people live about here?'     ",
      "'In that direction,' the Cat said, waving its right paw round, 'lives a       Hatter: and in that direction,' waving the other paw, 'lives a March Hare.       Visit either you like: they're both mad.'     ",
      "'But I don't want to go among mad people,' Alice remarked.     ",
      "'Oh, you can't help that,' said the Cat: 'we're all mad here. I'm mad.       You're mad.'     ",
      "'How do you know I'm mad?' said Alice.     ",
      "'You must be,' said the Cat, 'or you wouldn't have come here.'     ",
      "Alice didn't think that proved it at all; however, she went on 'And how do       you know that you're mad?'     ",
      "'To begin with,' said the Cat, 'a dog's not mad. You grant that?'     ",
      "'I suppose so,' said Alice.     ",
      "'Well, then,' the Cat went on, 'you see, a dog growls when it's angry, and       wags its tail when it's pleased. Now I growl when I'm pleased, and wag my       tail when I'm angry. Therefore I'm mad.'     ",
      "'I call it purring, not growling,' said Alice.     ",
      "'Call it what you like,' said the Cat. 'Do you play croquet with the Queen       to-day?'     ",
      "'I should like it very much,' said Alice, 'but I haven't been invited       yet.'     ",
      "'You'll see me there,' said the Cat, and vanished.     ",
      "Alice was not much surprised at this, she was getting so used to queer       things happening. While she was looking at the place where it had been, it       suddenly appeared again.     ",
      "'By-the-bye, what became of the baby?' said the Cat. 'I'd nearly forgotten       to ask.'     ",
      "'It turned into a pig,' Alice quietly said, just as if it had come back in       a natural way.     ",
      "'I thought it would,' said the Cat, and vanished again.     ",
      "Alice waited a little, half expecting to see it again, but it did not       appear, and after a minute or two she walked on in the direction in which       the March Hare was said to live. 'I've seen hatters before,' she said to       herself; 'the March Hare will be much the most interesting, and perhaps as       this is May it won't be raving mad—at least not so mad as it was in       March.' As she said this, she looked up, and there was the Cat again,       sitting on a branch of a tree.     ",
      "'Did you say pig, or fig?' said the Cat.     ",
      "'I said pig,' replied Alice; 'and I wish you wouldn't keep appearing and       vanishing so suddenly: you make one quite giddy.'     ",
      "'All right,' said the Cat; and this time it vanished quite slowly,       beginning with the end of the tail, and ending with the grin, which       remained some time after the rest of it had gone.     ",
      "'Well! I've often seen a cat without a grin,' thought Alice; 'but a grin       without a cat! It's the most curious thing I ever saw in my life!'     "
    ];

    for (var i = 0; i < ps.length; i++) {
        var p = document.createElement('p');
        // a slightly odd-looking trick to replace all occurrences of a substring in a string
        // http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript#1145525
        var text = ps[i].split('grin').join('<span style="color: black">grin</span>');
        text = text.split('Cat').join('Text');
        text = text.split('Puss').join('Text');
        text = text.split('cat').join('text');
        text = text.split('walked').join('read');
        text = text.split('walk').join('read');
        p.innerHTML = text;
        container.appendChild(p);
    }

    var scale = 1000;
    var alpha = scale;
    var intervalId = setInterval(function() {
        var col = "rgba(0,0,0," + (alpha / scale) + ")";
        container.style.color = col;
        if (alpha > 0) alpha -= 1;
    }, 100);
}
