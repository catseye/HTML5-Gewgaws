HTML5-Gewgaws
=============

This is a collection of gewgaws written for HTML5, generally (if not
exclusively) in Javascript.

"Gewgaw" means exactly what it sounds like.  But if you insist on a more
specific description, think: small entertainments that are somewhere
between automata, games, and art.

(A corollary of this is that if something is a proper HTML5 game or automaton
or whatever, it will probably have its own repo instead of being in this one.)

If you want to see these gewgaws in action, you should head on over to
[the online Gallery at Cat's Eye Technologies](http://catseye.tc/node/Online_Installation).

Many of these gewgaws make use of the [yoob.js](http://catseye.tc/node/yoob.js)
library.  Generally, the gewgaw will use the yoob.js files from the
`common-yoob.js-0.x` directory in the root of this repo.  If it needs a
different version of yoob.js for some reason, it may use a local `yoob`
subdirectory.

The contents of this repo are in the public domain; see the file `UNLICENSE`
for more information.  This includes any images found within, which I have
either obtained from public domain sources, or hereby place into the public
domain.  This includes, too, the bits and pieces of `yoob.js`, which is
itself in the public domain.

### Consistent Gewgaw Interface ###

We're still working this out, but the idea is that these gewgaws present a
simple, consistent interface for injecting themselves into an HTML5 page
(giving themselves their own "standard UI"; but this is of course optional,
and they can be manually instantiated too.)

You ought to be able to say something like this to start any of these gewgaws:

    <script src="some-gewgaw.js"></script>
    <script>
      launch('../path/to/scripts', 'element_id', config);
    </script>

...where `element_id` is the id of a container `div` (probably) somewhere
in the page.  The `launch` function will create the UI elements needed for
the gewgaw (often a canvas and a control panel div) inside this container.

Calling `launch()` will load any Javascript resources required by the
gewgaw.  `config` is an optional object which will be passed to the gewgaw's
`init()` method, and may specify locations of other resources such as images.

There should maybe be some kind of "full window"/"fullscreen" flags in
there too — "full window" would expand the container to fill the
browser window, and "full screen" would probably add a full-screen-ifying
button.
