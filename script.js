let i = 0;
let current = false;
let playbtn = document.querySelector("#play");
let audio = new Audio();
let currentPlaybackPosition = 0;
let contentloaded = false;
let songs = [];
let ul = document.querySelector(".list");
let next = document.querySelector(".next");
let prev = document.querySelector(".prev");
let gif = document.querySelector(".playicon");

function updateSeekBar() {
    const seekBar = document.querySelector(".seek-bar");
    const progressBar = document.querySelector(".progress-bar");
    const thumb = document.querySelector(".thumb");

    const percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percentage + "%";
    thumb.style.left = percentage + "%";
}
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function updateTimeDisplay() {
    const currentTimeElement = document.querySelector(".current-time");
    const totalTimeElement = document.querySelector(".total-time");

    currentTimeElement.textContent = formatTime(audio.currentTime);
    totalTimeElement.textContent = formatTime(audio.duration);
}


function handleSeekbarClick(event) {
    const seekBar = document.querySelector(".seek-bar");
    const progressBar = document.querySelector(".progress-bar");
    const thumb = document.querySelector(".thumb");

    const seekBarRect = seekBar.getBoundingClientRect();
    const clickX = event.clientX - seekBarRect.left;
    const percentage = (clickX / seekBarRect.width) * 100;

    progressBar.style.width = percentage + "%";
    thumb.style.left = percentage + "%";

    const seekTime = (percentage / 100) * audio.duration;
    audio.currentTime = seekTime;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function createListItems() {
    for (let index = 0; index < songs.length; index++) {
        const song = songs[index];
        let li = document.createElement("li");
        li.classList.add("lis");
        li.innerHTML = `<img src="music.svg" alt="M" class="music">${song.replaceAll("%20", " ")}<img src="play.svg" alt="P" class="play2 play3">`;
        li.addEventListener("click", function () {
            playSelectedSong(index);
        });
        ul.appendChild(li);
    }
}

async function main() {
    if (!contentloaded) {
        songs = await getSongs();
        createListItems();
        contentloaded = true;
    }
    if (current == false) {
        playCurrentSong();
        current = true;
        console.log(current);
    } else if (current == true) {
        currentPlaybackPosition = audio.currentTime;
        playbtn.src = "http://127.0.0.1:5500/play.svg";
        gif.src = "https://img.icons8.com/ios/50/audio-wave--v1.png";
        audio.pause();
        current = false;
        console.log(current);
    }
}

function playCurrentSong() {
    audio.src = "http://127.0.0.1:5500/songs/" + songs[i];
    audio.currentTime = currentPlaybackPosition;
    playbtn.src = "http://127.0.0.1:5500/pause.svg";
    gif.src = "http://127.0.0.1:5500/playing.gif";

    updateCurrentSongDisplay();
    audio.play();
}

function playSelectedSong(index) {
    i = index;
    currentPlaybackPosition = 0;
    playCurrentSong();
}

function playNextSong() {
    i = (i + 1) % songs.length;
    currentPlaybackPosition = 0;
    playCurrentSong();
}

function playPrevSong() {
    i = (i - 1 + songs.length) % songs.length;
    currentPlaybackPosition = 0;
    playCurrentSong();
}

function updateCurrentSongDisplay() {
    const currentSongDisplay = document.getElementById("currentSongDisplay");
    currentSongDisplay.textContent = `Currently playing: ${songs[i].replaceAll("%20", " ")}`;
}


play.addEventListener("click", function () {
    main();
});

next.addEventListener("click", function () {
    playNextSong();
});

prev.addEventListener("click", function () {
    playPrevSong();
});

document.querySelector(".seek-bar").addEventListener("click", handleSeekbarClick);

audio.addEventListener("timeupdate", function () {
    updateSeekBar();
    updateTimeDisplay();
});

let volumeBar = document.querySelector(".volume-bar");
let volumeIcon = document.querySelector(".volume-icon img");

function updateVolumeBar() {
    const percentage = audio.volume * 100;
    volumeBar.querySelector(".volume-progress").style.width = percentage + "%";
}

audio.volume = 1;

audio.addEventListener("volumechange", function () {
    updateVolumeBar();
});

volumeBar.addEventListener("click", function (event) {
    const volumeBarRect = volumeBar.getBoundingClientRect();
    const clickX = event.clientX - volumeBarRect.left;
    const percentage = (clickX / volumeBarRect.width);

    audio.volume = Math.max(0, Math.min(1, percentage));
    updateVolumeBar();
});

