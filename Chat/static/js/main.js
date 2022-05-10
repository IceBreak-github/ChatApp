const settings = document.getElementById("settings");
const grey = document.getElementById("grey");
const src = document.getElementById("id_image");
const target = document.getElementById("target");
/*
const mode_toggle = document.getElementById("mode_toggle");

let theme_save = 0;
*/
const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

var elements = ['id_username', 'id_old_password','id_new_password1', 'id_new_password2', 'id_email', 'id_confirm_password'];

function openThing(open, close) {
    open.style = "display: block";
    document.getElementById(open.id + '_button').classList.remove('font-[500]', 'dark:text-white');
    document.getElementById(open.id + '_button').className += ' text-[#6164E8] font-[600]';
    document.getElementById(open.id + '_under').style = "display: block";
    document.getElementById(open.id + '_submit').style = "display: block";
    document.getElementById(open.id + '_button_mobile').classList.remove('font-[500]', 'dark:text-white');
    document.getElementById(open.id + '_button_mobile').className += ' bg-[#CDD1F8] font-bold dark:bg-[#332E5E]';
    for (const element of close) {
      element.style = "display: none";
      document.getElementById(element.id + '_button').classList.add('font-[500]', 'dark:text-white');
      document.getElementById(element.id + '_button').classList.remove('text-[#6164E8]', 'font-[600]');
      document.getElementById(element.id + '_under').style = "display: none";
      document.getElementById(element.id + '_submit').style = "display: none";
      document.getElementById(element.id + '_button_mobile').classList.remove('bg-[#CDD1F8]', 'font-bold', 'dark:bg-[#332E5E]');
      document.getElementById(element.id + '_button_mobile').classList.add('font-[500]');
    }
  }
function showImage(src,target) {
    var fr=new FileReader();
    fr.onload = function(e) { target.src = this.result; };
    src.addEventListener("change",function() {
        fr.readAsDataURL(src.files[0]);
    });
}
function themeCheck(){
  if(userTheme == "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    for(i = 0; i < elements.length; i++) {
      document.getElementById(elements[i]).style.cssText = "background-color: #2D2D2D; color: white;";
    }
    document.querySelector('.scroll').style.cssText = "scrollbar-color: #838383 #373737;";
    document.querySelector('.scroll').innerHTML += ('<style> .scroll::-webkit-scrollbar-thumb{background: #838383;} .scroll::-webkit-scrollbar-track{background: #373737;} </style>')
  }
}
function themeSwitch(){
  if(document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem("theme", "light");
    for(i = 0; i < elements.length; i++) {
      document.getElementById(elements[i]).removeAttribute('style');
    }
    document.querySelector('.scroll').style.cssText = "scrollbar-color: #C5C5C5 #EFEFEF;";
    document.querySelector('.scroll').innerHTML += ('<style> .scroll::-webkit-scrollbar-thumb{background: #C5C5C5; ;} .scroll::-webkit-scrollbar-track{background: #EFEFEF;} </style>')
  }
  else{
    document.documentElement.classList.add('dark');
    localStorage.setItem("theme", "dark");
    for(i = 0; i < elements.length; i++) {
      document.getElementById(elements[i]).style.cssText = "background-color: #2D2D2D; color: white;";
    }
    document.querySelector('.scroll').style.cssText = "scrollbar-color: #838383 #373737;";
    document.querySelector('.scroll').innerHTML += ('<style> .scroll::-webkit-scrollbar-thumb{background: #838383;} .scroll::-webkit-scrollbar-track{background: #373737;} </style>')
  }
}

showImage(src,target);
themeCheck();




