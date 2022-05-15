
const image_input = document.getElementById("image_send");
const target_image = document.getElementById("snipped-small-img");

function showImage_message(image_input, target_image) {
    var fr=new FileReader();
    fr.onload = function(e) { target_image.src = this.result; };
    fr.readAsDataURL(image_input.files[0]);
    document.getElementById("main_chat").classList.add('lg:grid-rows-[130px_1fr_290px]','grid-rows-[55px_1fr_160px]', 'md:grid-rows-[75px_1fr_260px]');
    document.getElementById("message_box_input").classList.add('md:h-[234px]', 'h-[150px]');
    document.getElementById("image_preview").classList.remove('hidden');
    document.getElementById("image_preview").classList.add('flex');
    document.getElementById("snipped-image-name").innerHTML = (image_send.value).replace(/^.*[\\\/]/, '');
    scrollToBottom();
}
const user_username = JSON.parse(document.getElementById('user_username').textContent);
document.querySelector('#submit').onclick = document.querySelector('#submit-msg').onclick = function (e) {
    const messageInputDom = document.querySelector('#input');
    let image = document.getElementById("snipped-small-img").src
    const file_formats = ['data:image/png;', 'data:image/gif;', 'data:image/jpeg;', 'data:image/jpg;', 'data:image/webp;', 'data:image/svg;']
    let message = messageInputDom.value;
    const file_limit = 6; // File limit in Megabytes
    let valid_image = '';
    if((document.getElementById("snipped-small-img").src).startsWith('data:')){
        if((image_input.files[0].size * ((10)**-6)) < file_limit) {
            for(let i = 0; i < file_formats.length; i++) {
                if(image.startsWith(file_formats[i])){
                    valid_image = image;
                    break;
                }
            }
            if(valid_image == ''){
                alert("invalid file format")
                image_input.value = '';
                document.getElementById("snipped-small-img").src = '';
                messageInputDom.value = '';
            }
        }
        else{
            alert("file too large");
            image_input.value = '';
            document.getElementById("snipped-small-img").src = '';
            messageInputDom.value = '';
        }
    }
    if((message.trim() == '' && !image_input.files.length > 0)){
        message = null;
    }
    if(message == null){

    }
    else{
        chatSocket.send(JSON.stringify({
            'message': message,
            'image_url': valid_image,
            'username': user_username,
            'room': roomName,
            'date': date,
        }));
        valid_format = true;
        messageInputDom.value = '';
        document.getElementById("snipped-small-img").src = '';
        document.getElementById("main_chat").classList.remove('lg:grid-rows-[130px_1fr_290px]','grid-rows-[55px_1fr_160px]', 'md:grid-rows-[75px_1fr_260px]');
        document.getElementById("message_box_input").classList.remove('md:h-[234px]', 'h-[150px]');
        document.getElementById("image_preview").classList.remove('flex');
        document.getElementById("image_preview").classList.add('hidden');
    }
}
document.querySelector('#input').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("submit").click();
    }
});

function scrollToBottom() {
    let objDiv = document.getElementById("chat-text");
    objDiv.scrollTop = objDiv.scrollHeight;
}
scrollToBottom();
const roomName = JSON.parse(document.getElementById('room-name').textContent);
                
// wss for https 

const chatSocket = new WebSocket(
    [(location.protocol == 'https:') ? 'wss://' : 'ws://'] +
    window.location.host +
    '/ws/chat/' +
    roomName +
    '/'
);

var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.message || data.image_url) {
        var dict = superusers;
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes()
                    
        if(data.image_url && data.message == ''){
            if_image = `<img src="${data.image_url}">` + '</div>'+'</div>'+'</div>'
        }
        if(data.image_url && data.message !== ''){
            if_image = sanitizeHTML(data.message) + `<img src="${data.image_url}" class='mt-2'>` + '</div>'+'</div>'+'</div>'
        }
        if(data.message !== '' && data.image_url == ''){
            if_image = sanitizeHTML(data.message) + '</div>'+'</div>'+'</div>'
        }
        var message_1 = 
            '<p id="date" class="row-start-2 text-[11px] mt-[3px] md:mt-1 md:text-[13px] dark:text-white">'+ time + '</p>'+
            '</div>'+'</div>'+'<div id="text" class="row-start-2 mt-1 ml-auto mr-[8px] md:mr-[30px] text-left bg-[#484CA5] max-w-[44%] rounded-tl-[25px] rounded-br-[25px] rounded-bl-[25px] dark:bg-[#6164E8]">'+
            '<div id="content" class="text-[12px] md:text-[15px] text-white mt-[11px] mb-[11px] ml-4 mr-4">'
        var message_0 = 
            '<div id="message" class="grid mt-3 mr-[8px] md:mr-[30px] ml-auto w-full grid-rows-[29px_1fr] md:grid-rows-[45px_1fr]">' + 
            '<div class="row-start-1 mr-[8px] md:mr-[30px] ml-auto grid grid-cols-[29px_1fr] md:grid-cols-[45px_1fr]">' +
            `<img class="col-end-2 w-[28px] h-[28px] md:w-[44px] md:h-[44px] rounded-full" src="${data.profile_pic}">` +
            '<div id="user-color-1" class="col-start-2 ml-[8px] md:ml-[14px] grid grid-rows-[10px_10px_1fr] md:grid-rows-[20px_20px_1fr]">'
                    
        if(dict.includes(data.username)){
            your_message = message_0 +'<b id="b2" style="color: rgb(252, 93, 93);" class="row-start-1 text-[12px] md:text-[18px]">'+ data.username + '</b>' + message_1 + if_image
        }
        else{
            your_message = message_0 + '<b id="b2" style="color: rgb(34 197 94);" class="row-start-1 text-[12px] md:text-[18px]">'+ data.username + '</b>'+ message_1 + if_image
        }           
        if(data.username == user_username) {
            document.querySelector('#messages').innerHTML += (your_message);
        }
        else{
            if(dict.includes(data.username)){
                document.querySelector('#messages').innerHTML += (
                    '<div id="message" class="grid ml-[8px] md:ml-[30px] w-full grid-rows-[29px_1fr] md:grid-rows-[45px_1fr] mt-3">'+
                        '<div class="row-start-1 grid grid-cols-[29px_1fr] md:grid-cols-[45px_44%]">'+
                            `<img class="col-start-1 w-[28px] h-[28px] md:w-[44px] md:h-[44px] rounded-full" src="${data.profile_pic}">`+
                            '<div id="user-color" class="ml-[8px] md:ml-[14px] col-start-2 grid grid-rows-[10px_10px_1fr] md:grid-rows-[20px_20px_1fr]">'+
                                '<b id="b2" style="color: rgb(252, 93, 93);" class="row-start-1 text-[12px] md:text-[18px]">'+ data.username + '</b>'+
                                '<p id="date" class="row-start-2 text-[11px] mt-[3px] md:mt-1 md:text-[13px] dark:text-white">'+ time + '</p>'+
                            '</div>'+
                        '</div>'+
                        '<div id="text" class="row-start-2 mt-1 max-w-[44%] mr-auto text-left bg-[#F1F0F7] rounded-tr-[25px] rounded-br-[25px] rounded-bl-[25px] dark:bg-[#4D4D4D]">'+ 
                            '<div id="content" class="text-[12px] md:text-[15px] text-black mt-[11px] mb-[11px] ml-4 mr-4 dark:text-white">'
                                    + sanitizeHTML(data.message) + `<img src="${data.image_url}">`+
                            '</div>'+
                        '</div>'+
                    '</div>'
            
                    );
            }
            else{
            document.querySelector('#messages').innerHTML += (
                '<div id="message" class="grid ml-[8px] md:ml-[30px] w-full grid-rows-[29px_1fr] md:grid-rows-[45px_1fr] mt-3">'+
                    '<div class="row-start-1 grid grid-cols-[29px_1fr] md:grid-cols-[45px_44%]">'+
                        `<img class="col-start-1 w-[28px] h-[28px] md:w-[44px] md:h-[44px] rounded-full" src="${data.profile_pic}">`+
                        '<div id="user-color" class="ml-[8px] md:ml-[14px] col-start-2 grid grid-rows-[10px_10px_1fr] md:grid-rows-[20px_20px_1fr]">'+
                            '<b id="b2" style="color: rgb(34 197 94);" class="row-start-1 text-[12px] md:text-[18px]">'+ data.username + '</b>'+
                            '<p id="date" class="row-start-2 text-[11px] mt-[3px] md:mt-1 md:text-[13px] dark:text-white">'+ time + '</p>'+
                        '</div>'+ 
                        '</div>'+
                        '<div id="text" class="row-start-2 mt-1 max-w-[44%] mr-auto text-left bg-[#F1F0F7] rounded-tr-[25px] rounded-br-[25px] rounded-bl-[25px] dark:bg-[#4D4D4D]">'+ 
                            '<div id="content" class="text-[12px] md:text-[15px] text-black mt-[11px] mb-[11px] ml-4 mr-4 dark:text-white">' 
                                        + sanitizeHTML(data.message) + `<img src="${data.image_url}">`+
                            '</div>'+
                        '</div>'+
                    '</div>'
                    );
            }
        }
    } else {

    }
    scrollToBottom();                 
}