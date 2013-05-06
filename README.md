console.fu, a Chrome Extension
==============================

Built this to suppress console.[log,error,warn] messages that spam your dev console,
use keywords to blacklist messages
> when debugging a highly active Ajaxy page, I f*cking hate the non stop XHR message spam !

Usage (in console)
==================

```javascript
console.error("fun foo yeuu");
> fun foo yeuu

// now let's block this message from printing again
cfu.add_to_blacklist("foo")
cfu.intercept_fn('error')

console.error("fun foo yeuu");
// nothing prints

/* Moar things */

// restore the functions to default
cfu.restore_fn('error')

// or maybe remove the keyword
cfu.remove_from_blacklist("foo")

// or just blow the whole list
cfu.clear_blacklist()

// make sure it's gone
cfu.get_blacklist()
> []

// that's all for now

```

Install
=======
it's not on the Chrome extension market because it's still shitty.

```sh
git clone https://github.com/akhoury/console.fu.git
```
* then open Chrome type "chrome://extensions" in the address bar
* Check Developer mode
* Load unpacked extension
* read the hAlp menu when you click on the extension icon.
* you see a bug, report it, I'll fix it - or fix it your self and submit a pull request.


TODO
====
* better UI in the extension's popup, to check settings there instead of using the console
* RegEx instead of lame keywords
* testing
* i don't know, can you come up with something ?

License
-

MIT
Copyright (c) 2013 Aziz Khoury <bentael@gmail.com>
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

* tl;dr -- FREE do whatever you want

  [Aziz khoury]: bentael@gmail.com


