
const messageSocket = new WebSocket(
    [(location.protocol == 'https:') ? 'wss://' : 'ws://'] +
    window.location.host +
    '/ws/chat/'

);
var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

messageSocket.onmessage = function(e){
    let data = JSON.parse(e.data)
    console.log(data)
    if (data) {
        const rooms_0 = ["general", "memes", "questions", "coding", "off_topic", "gaming", "announcements"];
        for(let i = 0; i < rooms_0.length; i++){
            var msg_obj = eval('data.last_message_' + rooms_0[i])
            if(msg_obj){
                if(document.querySelector(`#last_message_${rooms_0[i]}`) || document.querySelector(`#last_message_author_${rooms_0[i]}`) || document.querySelector(`#last_message_time_${rooms_0[i]}`)){
                    document.querySelector(`#last_message_${rooms_0[i]}`).remove();
                    document.querySelector(`#last_message_author_${rooms_0[i]}`).remove();
                    document.querySelector(`#last_message_time_${rooms_0[i]}`).remove()
                    document.querySelector(`#${rooms_0[i]}`).innerHTML += (
                    `<div class="row-start-1 mt-[1px] md:mt-[3px] w-[115px] md:w-[170px] leading-tight break-words block overflow-hidden text-left h-[28px] md:h-[40px]" id='last_message_${rooms_0[i]}'>`+ sanitizeHTML(msg_obj[0]) + '...' + '</div>'
                    );
                    document.querySelector(`#${rooms_0[i]}`).innerHTML += (
                        `<div class="row-start-2 mt-auto" id="last_message_author_${rooms_0[i]}">`+ '- ' + sanitizeHTML(msg_obj[1]) +'</div>'
                    );
                    document.querySelector(`#time_${rooms_0[i]}`).innerHTML += (
                        `<div id="last_message_time_${rooms_0[i]}">`+ sanitizeHTML(msg_obj[2]) +'</div>'
                    );
                }   
                else{
                    document.querySelector(`#${rooms_0[i]}`).innerHTML += (
                    `<div class="row-start-1 mt-[1px] md:mt-[3px] w-[115px] md:w-[170px] leading-tight break-words block overflow-hidden text-left h-[28px] md:h-[40px]" id="last_message_${rooms_0[i]}">`+ sanitizeHTML(msg_obj[0]) +'</div>'
                    );
                    document.querySelector(`#${rooms_0[i]}`).innerHTML += (
                        `<div class="row-start-2 mt-auto" id="last_message_author_${rooms_0[i]}">`+ '- ' + sanitizeHTML(msg_obj[1]) +'</div>'
                    );
                    document.querySelector(`#time_${rooms_0[i]}`).innerHTML += (
                        `<div id="last_message_time_${rooms_0[i]}">`+ sanitizeHTML(msg_obj[2]) +'</div>'
                    );
                                
                }
            }
        }
    }
}