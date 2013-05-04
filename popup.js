$(function(){

//    CONSOLE_FU.get_blacklist().forEach(function(w){
//        $('#blacklisted')
//            .append($('<div>')
//                .addClass('blacklisted-word')
//                .text(w));
//    });

    $('#add').on('click', function(){
        //CONSOLE_FU.add_to_blacklist($('#newword').val());

        console.log("adding keyword");

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "add_to_blacklist", data: $('#newword')}, function(response) {

            });
        });

    });

});