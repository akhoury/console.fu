$(function(){

    if (!window.CONSOLE_FU) {
        var fu = window.CONSOLE_FU = {};
    }
    var BreakException = {}
        ,   dbkey = "CONSOLE_FU_BLACKLISTS"
        ,   origin = window.location.origin
        ,   storage = window.localStorage.getItem(dbkey) || (function(){window.localStorage.setItem(dbkey, {});return {}})()
        ,   blacklist = fu.blacklist = window.localStorage.getItem(dbkey)[origin] || []
        ,   intercepted = fu.intercepted = [];
       // ,   port = chrome.runtime.connect();

    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

        if (msg.action == 'add_to_blacklist') {
            alert("Message recieved!");
        }
    });

    }, false);

    fu.prototype = {
        old_console_log : console.log,
        old_console_error : console.error,
        old_console_trace : console.trace,
        old_console_warn : console.warn,
        clear : console.clear,

        add_to_blacklist : function (w) {
            console.log("adding "  + w + " to bl");
            this.blacklist.push(w);
            this.persist_blacklist();
        },

        remove_from_blacklist : function (w) {
            console.log("removing " + w + " from bl");
            var i = this.blacklist.indexOf(w);
            if (i > -1 ) {
                this.blacklist.splice(i, 1);
                this.persist_blacklist();
            }
        },

        clear_blacklist : function () {
            console.log("clearing blacklist");
            this.blacklist = [];
            window.localStorage.clear();
        },

        get_blacklist : function () {
            this.blacklist = window.localStorage.getItem(dbkey)[origin] || [];
            return this.blacklist;
        },

        intercept_fn : function (fn_prop) {
            switch (fn_prop) {
                case "log":
                    console.log = this.intercept(console.log, this.blacklist_interceptor); break;
                case "error":
                    console.error = this.intercept(console.error, this.blacklist_interceptor); break;
                case "trace":
                    console.trace = this.intercept(console.trace, this.blacklist_interceptor); break;
                case "warn":
                    console.warn = this.intercept(console.warn, this.blacklist_interceptor); break;
            }
        },

        restore_fn : function (fn_prop) {
            switch (fn_prop) {
                case "log":
                    console.log = this.old_console_log; break;
                case "error":
                    console.error = this.old_console_error; break;
                case "trace":
                    console.trace = this.old_console_trace; break;
                case "warn":
                    console.warn = this.old_console_warn; break;
            }
        },

        blacklist_interceptor : function(){
            var self = this
              , args = Array.prototype.slice.call(arguments)[0]
              , blacklist = self.get_blacklist();
            try {
                Object.keys(args).forEach(function(k){
                    blacklist.forEach(function(needle){
                        var found = args[k].toString().indexOf(needle);
                        if ( found > -1 ) {
                            self.intercepted.push({keyword: needle, message: JSON.stringify(args)});
                            throw BreakException;
                        }
                    });
                });
            }
            catch (e) {
                if (e === BreakException) {
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
            window.localStorage.setItem(this.dbkey[this.origin], this.blacklist);
        }

    };
});