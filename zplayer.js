const sample = document.querySelector('.player__controllers');

sample.addEventListener('timeupdate', ()=>{
    console.log(sample.currentTime)
})