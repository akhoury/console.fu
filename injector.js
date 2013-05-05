try {
    var script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src = chrome.extension.getURL("/console.fu.js");
    document.getElementsByTagName("head")[0].appendChild(script1);

} catch(e) {
    console.log(e);
}