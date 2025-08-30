/*....................Music toggle.....................*/

const musicBtn=document.querySelector("#music-btn");
const musicIcon = musicBtn.querySelector("i");
const music=new Audio("assets/Audios/8bit Dungeon Boss.mp3");
musicBtn.addEventListener("click",()=>{
    if(music.paused){
        music.play();
        music.loop=true;
        musicIcon.className="fa-solid fa-pause";
    }else{
        music.pause();
        musicIcon.className="fa-solid fa-music";
    }
});