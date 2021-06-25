const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  musicAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevMusic = wrapper.querySelector("#prev"),
  nextMusic = wrapper.querySelector("#next"),
  progressBar = wrapper.querySelector(".progress-bar"),
  progressArea = wrapper.querySelector(".progress-area"),
  currentTime = wrapper.querySelector(".current-time"),
  maxDuration = wrapper.querySelector(".max-duration"),
  moreMusicIcon = wrapper.querySelector("#more-music"),
  musicList = wrapper.querySelector(".music-list"),
  closeIcon = musicList.querySelector("#close");

let musicNumber = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicNumber);
  playingNow();
});

function loadMusic(index) {
  musicName.innerText = allMusic[index - 1].name;
  musicArtist.innerText = allMusic[index - 1].artist;
  musicImg.src = `img/${allMusic[index - 1].img}.jpg`;
  musicAudio.src = `songs/${allMusic[index - 1].song}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  musicAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  musicAudio.pause();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// Next Prev Buttons
const playNextMusic = () => {
  musicNumber++;
  musicNumber > allMusic.length
    ? (musicNumber = 1)
    : (musicNumber = musicNumber);
  loadMusic(musicNumber);
  playMusic();
  playingNow();
};

nextMusic.addEventListener("click", () => {
  playNextMusic();
});

const playPrevMusic = () => {
  musicNumber--;
  musicNumber < 1
    ? (musicNumber = allMusic.length)
    : (musicNumber = musicNumber);
  loadMusic(musicNumber);
  playMusic();
  playingNow();
};

prevMusic.addEventListener("click", () => {
  playPrevMusic();
});

musicAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  let progBar = (currentTime / duration) * 100;
  progressBar.style.width = `${progBar}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");

  musicAudio.addEventListener("loadeddata", () => {
    let audioDuration = musicAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);

  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidthValue = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = musicAudio.duration;

  musicAudio.currentTime = (clickedOffSetX / progressWidthValue) * songDuration;
  playMusic();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let repeatIconTxt = repeatBtn.innerText;

  switch (repeatIconTxt) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
    default:
      break;
  }
});

musicAudio.addEventListener("ended", () => {
  let repeatIconTxt = repeatBtn.innerText;

  switch (repeatIconTxt) {
    case "repeat":
      playNextMusic();
      break;
    case "repeat_one":
      musicAudio.currentTime = 0;
      loadMusic(musicNumber);
      playMusic();
      break;
    case "shuffle":
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicNumber == randomIndex);
      musicNumber = randomIndex;
      loadMusic(musicNumber);
      playMusic();
      playingNow();
      break;
    default:
      break;
  }
});

moreMusicIcon.addEventListener("click", () => {
  musicList.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  musicList.classList.remove("show");
});

const ulTag = musicList.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTags = `<li li-index=${i + 1}>
  <div class="row">
    <span>${allMusic[i].name}</span>
    <p>${allMusic[i].artist}</p>
  </div>
  <audio class="${allMusic[i].song}" src="songs/${
    allMusic[i].song
  }.mp3"></audio>
  <span id="${allMusic[i].song}" class="audio-duration">3:40</span>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTags);

  let liAudioTag = ulTag.querySelector(`.${allMusic[i].song}`);
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].song}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t_duration", `${totalMin}:${totalSec}`)
  });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let x = 0; x < allLiTags.length; x++) {
    let audioTag = allLiTags[x].querySelector(".audio-duration")

    if(allLiTags[x].classList.contains("playing")) {
      allLiTags[x].classList.remove("playing")
      let adDuration = audioTag.getAttribute("t_duration")
      audioTag.innerText = adDuration
    }

    if (allLiTags[x].getAttribute("li-index") == musicNumber) {
      allLiTags[x].classList.add("playing");
      audioTag.innerText = "Playing"
    }
    allLiTags[x].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let liIndex = element.getAttribute("li-index");
  musicNumber = liIndex;
  loadMusic(musicNumber);
  playMusic();
  playingNow();
}
