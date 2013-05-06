
/* github.com/akhoury/console.fu */

'use strict';

(function(undefined){
  if (!window.cfu) {
    window.cfu = {};
  }

  var CFU = function () {
    this.BlacklistHitException = {};
    this.dbkey = "CFU";
    this.origin = window.location.origin;

    // loading window.localStorage if any
    var blst = window.localStorage.getItem(this.dbkey+"_"+"blacklist")||"[]";
    var cfns = window.localStorage.getItem(this.dbkey+"_"+"console_fns")||"{\"log\":false,\"error\":false,\"warn\":false,\"debug\":false}";
    this.blacklist = JSON.parse(blst);
    this.console_fns = JSON.parse(cfns);

    // temp memory only
    this.intercepted_msgs = [];

    //saving references to the original console.x functions
    this.old_console_log = console.log;
    this.old_console_error = console.error;
    this.old_console_warn = console.warn;
    this.old_console_debug = console.debug;
    this.old_console_info = console.info;
  };

  CFU.prototype = {
    clear : console.clear,

    add_to_blacklist : function (w) {
      this.blacklist.push(w);
      this.persist_blacklist();
    },

    remove_from_blacklist : function (w) {
      var i = this.blacklist.indexOf(w);
      if (i > -1 ) {
        this.blacklist.splice(i, 1);
        this.persist_blacklist();
      }
    },

    clear_blacklist : function () {
      this.blacklist = [];
      window.localStorage.setItem(this.dbkey + "_" + "blacklist", JSON.stringify("[]"));
    },

    get_blacklist : function () {
      return this.blacklist;
    },

    intercept_fn : function (fn) {
      switch (fn) {
        case "log":
          var log = this.intercept(window.console.constructor.prototype.log, this.blacklist_interceptor);

          /*
              issue #1 - not fixed yet, applies on the rest of the functions as well.

              neither of the two statements is "overriding" the console.x being used by jQuery for example
              what I don't understand is the XHR log requests for example, which execute in the same "window"
              unless it's using a different "logging" probably native.. or if it "closes over" the console.x before
              this extension's script fires.

              if manually tested in the same "window" console, the overloading works fine, like the README example

              to clarify, this script is NOT a background script, this gets injected into EACH page and live in its DOM.
              see injector.js and manifest.json

          */

          window.console.constructor.prototype.log = log;
          window.console.log = log;
          break;
        case "error":
          var error = this.intercept(window.console.constructor.prototype.error, this.blacklist_interceptor);
          window.console.constructor.prototype.error = error;
          window.console.error = error;
          break;
        case "warn":
          var warn = this.intercept(window.console.constructor.prototype.warn, this.blacklist_interceptor);
          window.console.constructor.prototype.warn = warn;
          window.console.warn = warn;
          break;
        case "debug":
          var debug = this.intercept(window.console.constructor.prototype.debug, this.blacklist_interceptor);
          window.console.constructor.prototype.debug = debug;
          window.console.debug = debug;
          break;
        case "info":
          var info = this.intercept(window.console.constructor.prototype.info, this.blacklist_interceptor);
          window.console.constructor.prototype.info = info;
          window.console.info = info;
          break;
      }
      this.console_fns[fn] = true;
      this.persist_functions();

    },

    restore_fn : function (fn) {
      switch (fn) {
        case "log":
          window.console.constructor.prototype.log = this.old_console_log; break;
        case "error":
          window.console.constructor.prototype.error = this.old_console_error; break;
        case "warn":
          window.console.constructor.prototype.warn = this.old_console_warn; break;
        case "debug":
        window.console.constructor.prototype.debug = this.old_console_debug; break;
        case "info":
          window.console.constructor.prototype.info = this.old_console_info; break;
      }
      this.console_fns[fn] = false;
      this.persist_functions();
    },

    blacklist_interceptor : function(){
      var self = window.cfu
        , args = Array.prototype.slice.call(arguments)[0];
      try {
        Object.keys(args).forEach(function(k){
          self.blacklist.forEach(function(needle){
            var str = self.stringify(args[k]);
            window.console.log("Indexing STR: " + str + " for needle: " + needle);
            var found = str.indexOf(needle);
            if ( found > -1 ) {
              window.console.log("Found hit at index: " + found + " not printing");
              self.intercepted_msgs.push({keyword: needle, message: str});
              throw self.BlacklistHitException;
            }
          });
        });
      }
      catch (e) {
        if (e === self.BreakException) {
          return false;
        }
      }
      return true;
    },

    // utils
    augment : function (base, extra) {
      return (function () {
        return function () {
          base.apply(this, arguments);
          extra.apply(this, arguments);
        };
      })();
    },

    intercept : function (base, conditionFn) {
      return (function(){
        return function () {
          if (conditionFn(arguments)) {
            base.apply(this, arguments);
          }
        };
      })();
    },

    persist_blacklist : function () {
      window.localStorage.setItem(this.dbkey + "_" + "blacklist", JSON.stringify(this.blacklist));
    },

    persist_functions : function () {
      window.localStorage.setItem(this.dbkey + "_" + "console_fns", JSON.stringify(this.console_fns));
    },

    /* getSerialize and stringify functions */
    /* https://github.com/isaacs/json-stringify-safe */

    getSerialize : function (fn, decycle) {
      var seen = [];
      decycle = decycle || function(key, value) {
        return '[Circular]';
      };
      return function(key, value) {
        var ret = value;
        if (typeof value === 'object' && value) {
          if (seen.indexOf(value) !== -1)
            ret = decycle(key, value);
          else
            seen.push(value);
        }
        if (fn) ret = fn(key, ret);
        return ret;
      }
    },

    stringify : function (obj, fn, spaces, decycle) {
      return JSON.stringify(obj, this.getSerialize(fn, decycle), spaces);
    }

  };

  var cfu = window.cfu = new CFU();
  Object.keys(cfu.console_fns).forEach(function(k) {
    if (cfu.console_fns[k]) {
      cfu.intercept_fn(k);
    }
  });
  console.log("[cfu] loaded");
})();