/*....................These code lines are used for mode toggle......................*/

const modeBtn=document.querySelector("#toggle-mode-btn");
const icon = modeBtn.querySelector("i");
modeBtn.addEventListener("click",()=>{

        document.querySelector('body').classList.toggle("light-mode");

    if(icon.className=="fa-solid fa-moon"){
        icon.className="fa-solid fa-sun";
        sessionStorage.setItem("mode","dark");
    }else{
        icon.className="fa-solid fa-moon";
        sessionStorage.setItem("mode","light");
    }
});


window.addEventListener("DOMContentLoaded",()=>{
    let mode= sessionStorage.getItem("mode");
    if(mode===null){
        mode="dark";
    }

    if(mode=="dark"){
        document.querySelector("body").classList.remove("light-mode");
        icon.className = "fa-solid fa-sun";
    }else{
        document.querySelector("body").classList.add("light-mode");
        icon.className = "fa-solid fa-moon";    
    }

});