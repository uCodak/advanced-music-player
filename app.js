const tracks = document.querySelectorAll(".toggle-trigger");
let trackList = Array.from(document.querySelectorAll("audio"));
let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;

// Add click listeners to each track
tracks.forEach((trigger, index) => {
    const parent = trigger.closest(".bg-white");
    const player = parent.querySelector(".player");
    const audio = parent.querySelector("audio");
    const playBtn = parent.querySelector(".play-toggle");
    const playIcon = parent.querySelector(".play-icon");
    const pauseIcon = parent.querySelector(".pause-icon");
    const timeDisplay = parent.querySelector(".time");

    audio.dataset.index = index;

    trigger.addEventListener("click", () => {
        document.querySelectorAll(".player").forEach(p => {
            if (p !== player) p.classList.add("hidden");
        });
        player.classList.toggle("hidden");
    });

    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            pauseAllExcept(audio);
            audio.play();
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");
            currentTrackIndex = parseInt(audio.dataset.index);
        } else {
            audio.pause();
            playIcon.classList.remove("hidden");
            pauseIcon.classList.add("hidden");
        }
    });

    audio.addEventListener("timeupdate", () => {
        const format = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
        timeDisplay.textContent = `${format(audio.currentTime)} / ${format(audio.duration || 0)}`;
    });

    audio.addEventListener("ended", () => {
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            playNextTrack();
        }
    });
});

function pauseAllExcept(currentAudio) {
    document.querySelectorAll("audio").forEach(a => {
        if (a !== currentAudio) {
            a.pause();
            a.currentTime = 0;
            const otherPlayer = a.closest(".player");
            otherPlayer.querySelector(".play-icon").classList.remove("hidden");
            otherPlayer.querySelector(".pause-icon").classList.add("hidden");
        }
    });
}

function playNextTrack() {
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * trackList.length);
        } while (newIndex === currentTrackIndex && trackList.length > 1);
        currentTrackIndex = newIndex;
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
    }

    const nextAudio = trackList[currentTrackIndex];
    const nextPlayer = nextAudio.closest(".player");
    document.querySelectorAll(".player").forEach(p => p.classList.add("hidden"));
    nextPlayer.classList.remove("hidden");
    pauseAllExcept(nextAudio);
    nextAudio.play();

    nextPlayer.querySelector(".play-icon").classList.add("hidden");
    nextPlayer.querySelector(".pause-icon").classList.remove("hidden");
}

function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    const prevAudio = trackList[currentTrackIndex];
    const prevPlayer = prevAudio.closest(".player");
    document.querySelectorAll(".player").forEach(p => p.classList.add("hidden"));
    prevPlayer.classList.remove("hidden");
    pauseAllExcept(prevAudio);
    prevAudio.play();

    prevPlayer.querySelector(".play-icon").classList.add("hidden");
    prevPlayer.querySelector(".pause-icon").classList.remove("hidden");
}

// Shuffle
document.querySelector(".shuffle-icon").addEventListener("click", () => {
    isShuffle = !isShuffle;
    alert(`Shuffle ${isShuffle ? 'enabled' : 'disabled'}`);
    document.querySelector(".shuffle-icon").classList.toggle("text-blue-500", isShuffle);
});

// Repeat
document.querySelector(".repeat-icon").addEventListener("click", () => {
    isRepeat = !isRepeat;
    alert(`Repeat ${isRepeat ? 'enabled' : 'disabled'}`);
    document.querySelector(".repeat-icon").classList.toggle("text-blue-500", isRepeat);
});

// Next
document.querySelector("#next").addEventListener("click", () => {
    playNextTrack();
});

// Previous
document.querySelector(".prev-icon").addEventListener("click", () => {
    playPreviousTrack();
});
