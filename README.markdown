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

This is really just a set of notes for establishing a consistent interface
for starting these gewgaws.

You can't currently, but you ought to be able to say something like this to
start any of these gewgaws:

    <script src="yoob/whatevs.js"></script>
    <script src="any-gewgaw.js"></script>
    <script>
      yoob.gewgaws["any-gewgaw.js"].launch({container: 'foo'});
    </script>

...where `foo` is the id of a `div` (probably) element somewhere in the
page.  The `launch` method should create the elements needed for the
gewgaw (often a canvas and a control panel div) inside the container.

There should maybe be some kind of "full window"/"fullscreen" flags in
there too — "full window" would expand the container to fill the
browser window, and "full screen" would probably add a full-screen-ifying
button.

And yoob.js requirements...?  Oh gosh, there are fancy Javascript ways for
specifying those sort of things nowadays, aren't there.  Oh, but they're all
so heavyweight.  Bah.
