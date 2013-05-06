
/* github.com/akhoury/console.fu */

'use strict';

(function(undefined){
    if (!window.cfu) {
        window.cfu = {};
    }
    
    var CFU = function () {
        this.debug = false;
        this.BreakException = {};
        this.dbkey = "CFU";
        this.origin = window.location.origin;
        var blst = window.localStorage.getItem(this.dbkey+"_"+"blacklist")||"[]";
        var cfns = window.localStorage.getItem(this.dbkey+"_"+"console_fns")||"{\"log\":false,\"error\":false,\"warn\":false}";
        this.blacklist = JSON.parse(blst);
        this.console_fns = JSON.parse(cfns);
        this.intercepted_msgs = [];
    };

    CFU.prototype = {
        old_console_log : console.log,
        old_console_error : console.error,
        old_console_trace : console.trace,
        old_console_warn : console.warn,
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
                    console.log = this.intercept(console.log, this.blacklist_interceptor);break;
                case "error":
                    console.error = this.intercept(console.error, this.blacklist_interceptor); break;
                case "warn":
                    console.warn = this.intercept(console.warn, this.blacklist_interceptor); break;
            }
            this.console_fns[fn] = true;
            this.persist_functions();

        },

        restore_fn : function (fn) {
            switch (fn) {
                case "log":
                    console.log = this.old_console_log; break;
                case "error":
                    console.error = this.old_console_error; break;
                case "warn":
                    console.warn = this.old_console_warn; break;
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
                        var found = args[k].toString().indexOf(needle);
                        if ( found > -1 ) {
                            self.intercepted_msgs.push({keyword: needle, message: JSON.stringify(args)});
                            throw self.BreakException;
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