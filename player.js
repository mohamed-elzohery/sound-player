let audio = document.getElementById('audio');
const durationSpan = document.querySelector('.total-duration');
const currentSpan = document.querySelector('.current');
const volumeBar = document.querySelector('.volume');
const shuffleBtn = document.querySelector('#shuffle');
const loopBtn = document.querySelector('#loop');
const playpauseBtn = document.querySelector('#playpause');
const muteBtn = document.querySelector('#mute');
const speedBtn = document.querySelector('#speed');
const slowBtn = document.querySelector('#slow');
const progressBar = document.getElementById('progress');
const file = document.querySelector('#file-selector');
const songList = document.querySelector('.player__list');
const songsItems = document.getElementsByClassName('song')
const allSongs = document.getElementsByClassName('song__audio');

audio.volume = volumeBar.value / 100;

audio.addEventListener('timeupdate', () => {
    let duration = Math.ceil(audio.duration);
    if(duration > 100){
        progressBar.setAttribute("max", 100);
        progressBar.value = (audio.currentTime / duration) * 100;
    }else{
        progressBar.setAttribute("max", duration);
        progressBar.value = Math.ceil(audio.currentTime);
    }
    durationSpan.innerHTML = formatDuration(duration);
    currentSpan.innerHTML = formatDuration(audio.currentTime);    
});

audio.addEventListener('ended', () => {
    if(shuffleBtn.getAttribute("status") === "active"){
        playNextSong();
        return;
    }else if(audio.getAttribute('loop')){
        return;
    }
    pauseAudio();
})

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

loopBtn.addEventListener('click', (e) => {
    console.log(loopBtn.getAttribute('loop'))
    if(loopBtn.classList.contains('player__btn--active')){
        audio.removeAttribute("loop");
        loopBtn.classList.remove('player__btn--active');
        return;
    }
    audio.setAttribute('loop', "on");
    loopBtn.classList.add('player__btn--active');
    shuffleBtn.classList.remove('player__btn--active');
});

shuffleBtn.addEventListener('click', () => {
    if(shuffleBtn.getAttribute('status') == "active"){
        shuffleBtn.setAttribute("status", "disabled");
        shuffleBtn.classList.remove('player__btn--active');
        return;
    }
    shuffleBtn.setAttribute("status", "active");
    shuffleBtn.classList.add('player__btn--active');
})

playpauseBtn.addEventListener('click', () => {
    if(playpauseBtn.getAttribute("status") === "paused"){
        return playAudio();
    }
    return pauseAudio();
});


volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value / 100;
    let icon;
    if(audio.volume === 0){
        icon = "/svg/sprite.svg#icon-volume-mute2";
    }else if(audio.volume > .7){
        icon = "/svg/sprite.svg#icon-volume-high";
    }else if(audio.volume < .3){
        icon = "/svg/sprite.svg#icon-volume-low";
    }else{
        icon = "/svg/sprite.svg#icon-volume-medium";
    }
    volumeBar.previousElementSibling.firstElementChild.firstElementChild.setAttribute("href", icon);
});

speedBtn.addEventListener('click', () => {
    const currentPbSpeed = audio.playbackRate;
    slowBtn.classList.remove('disabled');
    if(currentPbSpeed == 1){
        audio.playbackRate = currentPbSpeed * 2;
        speedBtn.classList.add('disabled');
        return;
    }
    audio.playbackRate = currentPbSpeed * 2;
});

slowBtn.addEventListener('click', () => {
    const currentPbSpeed = audio.playbackRate;
    speedBtn.classList.remove('disabled');
    if(currentPbSpeed == 1){
        audio.playbackRate = currentPbSpeed / 2;
        slowBtn.classList.add('disabled');
        return;
    }
    audio.playbackRate = currentPbSpeed / 2;
});

file.addEventListener('change', () => {
    let uploadedFile = file.files[0];
    if(['wav', 'mp3', 'mp4'].some(e => uploadedFile.name.endsWith(e))){
        addFile(uploadedFile);
        return;
    }

    throw Error('Unsupported file format')
});



function formatDuration(duration){
    let mins = '00';
    if(duration % 60 !== duration){
        mins = Math.ceil(duration / 60).toString().padStart(2, "0");
        duration = duration - mins * 60;
    }
    const seconds = Math.ceil(duration).toString().padStart(2, "0");
    return mins + ':' + seconds
}

function  settingAudioData(audio){
    durationSpan.innerHTML = formatDuration(audio.duration);
    currentSpan.innerHTML = formatDuration(audio.currentTime)
    progressBar.setAttribute("max", audio.duration);
    progressBar.value = audio.currentTime;
}

function playAudio(){
    if(audio.src === ""){
        playNextSong();
        return;
    }
    playpauseBtn.firstElementChild.firstElementChild.setAttribute("href", "/svg/sprite.svg#icon-pause2");
    playpauseBtn.setAttribute("status", "playing");
    audio.play();
}

function pauseAudio(){
    audio.pause();
    playpauseBtn.firstElementChild.firstElementChild.setAttribute("href", "/svg/sprite.svg#icon-play3");
    playpauseBtn.setAttribute("status", "paused")
}


function addFile(file){
    const newSong = document.createElement('li');
    newSong.classList.add('song');
    newSong.innerHTML = 
    `<audio src="${URL.createObjectURL(file)}" class="song__audio" preload="auto"></audio>
    <span class="song__name">${file.name}</span>
    <span class="playing"></span>
    <button class="delete-btn">x</button>`;
    songList.appendChild(newSong);

    const allDeleteBtns = document.getElementsByClassName('delete-btn');

    //Place events of each song item
    [...allDeleteBtns].forEach(btn => {
    btn.addEventListener('click', (e)=>{
        e.stopPropagation()
        btn.parentElement.remove();
        console.log(btn.parentElement.firstElementChild.src === audio.src);
        console.log(audio.src)
        if(audio.src === btn.parentElement.firstElementChild.src){
            audio.removeAttribute('src');
            playNextSong()
        }
    })
});

[...songsItems].forEach(song => {
    song.addEventListener('click', playSelectedSong)
});
}

function playNextSong(){
    let index = [...allSongs].findIndex(ele => {
        return ele.src == audio.src;
    });
    console.log(index)
    if(![...allSongs].length){
        audio.currentTime = 0;//stop player 
        pauseAudio()
        throw Error('no songs added yet');
    }
    if((index == -1) || (index >= [...allSongs].length-1)){
        index = 0;
    }else{
        index++;
    }
    speedBtn.classList.remove('disabled');
    slowBtn.classList.remove('disabled');
    audio.src = [...allSongs][index].src;//play next song
    playAudio();
}


function playSelectedSong(e){
    console.log(e.target)
    audio.src = e.target.firstElementChild.src;
    playAudio();
}