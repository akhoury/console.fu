console.fu
==========

when debugging a highly active Ajaxy page, I fucking hate the XHR
Suppress console.[log,error,warn,trace] messages that spam your dev console,
use keywords to blacklist messages and shit

Usage (in console)
==================

```javascript

cfu.add_to_blacklist("Unsafe JavaScript attempt to access frame with URL")
cfu.intercept_fn('error')

// restore the functions to default
cfu.restore_fn('error')

```

TODO
====
* better UI in the extension's popup, to check settings there instead of using the console
* RegEx instead of lame keywords
* testing
* i don't know, can you come up with something ?

License
-

MIT

*Free Software, Fuck Yeah!*

  [Aziz khoury]: bentael@gmail.com


