var script1 = document.createElement("script");
script1.type = "text/javascript";
script1.src = chrome.extension.getURL("/console.fu.js");
document.getElementsByTagName('html')[0].appendChild(script1);

/*

try {
    document.getElementsByTagName("head")[0].appendChild(script1);
    var script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src = chrome.extension.getURL("/console.fu.js");

} catch(e) {
    console.log(e);
}

*/