const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Bee_Music';

const songList = $('.song-list')
const cd = $('.panel-playlist__cd');
const cdSize = cd.offsetWidth;
const audio = $('.audio');
const titleCtrlPanel =$('.panel-playlist__name');
const artistCtrlPanel =$('.panel-playlist__artist');
const toggleBtn = $('.panel-center__toggle');
const timeBar = $('.panel-time__bar');
const prevBtn = $('.fa-fast-backward');
const nextBtn = $('.fa-fast-forward');
const shuffleBtn = $('.fa-random');
const repeatBtn = $('.fa-redo-alt');
const playlist = $('#playlist');
const minutesSong = $('.panel-time__duration-mins');
const secondsSong = $('.panel-time__duration-secs');


var currentIndex = 0;
// var isPlaying = false;
// var isShuffle = false;
// var isRepeat = false;

const app = {
    songs : [
        {
            name: "Chạy Ngay Đi (Onionn Remix)",
            singer: "Sơn Tùng M-TP",
            path: "./music/Chạy Ngay Đi (Onionn Remix).mp3",
            image: "./img/playlist/img1.jpg"
        },
        {
            name: "Chạy Ngay Đi",
            singer: "Sơn Tùng M-TP",
            path: "./music/Chạy Ngay Đi.mp3",
            image: "./img/playlist/img2.jpg"
        },
        {
            name: "Hãy Trao Cho Anh",
            singer: "Sơn Tùng M-TP",
            path: "./music/Hãy Trao Cho Anh.mp3",
            image: "./img/playlist/img3.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Sơn Tùng M-TP",
            path: "./music/Muộn Rồi Mà Sao Còn.mp3",
            image: "./img/playlist/img4.jpg"
        },
        {
            name: "Nơi Này Có Anh (Masew Bootleg)",
            singer: "Sơn Tùng M-TP",
            path: "./music/Noi-Nay-Co-Anh-Masew-Bootleg-Son-Tung-M-TP-Masew.mp3",
            image: "./img/playlist/img5.jpg"
        },
        {
            name: "Lạc Trôi (Triple D Remix)",
            singer: "Sơn Tùng M-TP",
            path: "./music/Lac-Troi-Triple-D-Remix-Son-Tung-M-TP.mp3",
            image: "./img/playlist/img6.jpg"
        }
    ],

    isPlaying : false,
    isShuffle : false,
    isRepeat : false,

    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    // setConfig: function(key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },

    loadConfig: function() {
        this.isShuffle = this.config.isShuffle;
        this.isRepeat = this.config.isRepeat;
        // --------- or
        // Object.assign(this, this.config) // Not recommneded
    },

    start: function() {
        // Assign settings from config to app
        // this.loadConfig()

        this.defineProperties();
        this.renderSongs();
        this.handleEvents();
        this.loadCurrentSong();
        // this.scrollToActiveSong();
        // this.getCurrentSong();
    },

    renderSongs: function() { // ==> OK
        const htmls = this.songs.map((song, index) => {
            return `
                <li class="song ${index === currentIndex ? 'active' : ''} row" data-index="${index}">
                    <div class="playlist__label col l-1 m-1 c-1">${index + 1}</div>
                    <div class="playlist__label col l-5 m-5 c-5">${song.name}</div>
                    <div class="playlist__label col l-3 m-3 c-4">${song.singer}</div>
                    <div class="playlist__label col l-1 m-1 c-2">2:59</div>
                    <div class="playlist__label col l-2 m-2 c-0">m-tp M-TP</div>
                </li>
            `
        })
        songList.innerHTML = htmls;
    },

    handleEvents: function() {
        const _this = this;
        // Handle when scroll to shrik/grow cd
        document.onscroll = function() { // ==> OK
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdSize = cdSize - scrollTop;
            cd.style.width = newCdSize > 0 ? newCdSize + 'px': 0;
            cd.style.height = newCdSize > 0 ? newCdSize + 'px': 0;
            cd.style.opacity = newCdSize / cdSize;
        }

        // Handle when click play btn
        toggleBtn.onclick = function() { // ==> OK
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play()
            }
        }

        // When song is played
        audio.onplay = function() { // ==> OK
            _this.isPlaying = true;
            toggleBtn.classList.add('playing');
            cdRotate.play()
        }

        // When song is paused
        audio.onpause = function() { // ==> OK
            _this.isPlaying = false;
            toggleBtn.classList.remove('playing')
            cdRotate.pause()
        }

        // When progress bar is changed
        audio.ontimeupdate = function(e) { // ==> OK
            // console.log(e.target)
            // const seekTime = e.target.value / 100 * audio.duration;
            // audio.currentTime = seekTime;

            if (audio.duration) {
                const progress = Math.floor(audio.currentTime / audio.duration * 100);
                timeBar.value = progress;
            }

            // var minutes = Math.floor(seekTime / 60);
            // var seconds = Math.floor(seekTime / 60);
            // minutesSong.innerText = minutes;
            // if (seconds < 10) {
            //     secondsSong.innerText = `0${seconds}`
            // } else {
            //     secondsSong.innerText = seconds;
            // }

            // console.log(minutes)
        }

        // Handle when seek
        timeBar.onchange = function(e) { // ==> OK
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // Handle when CD roatates
        const cdRotate = cd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause()

        // When click next button
        nextBtn.onclick = function() { // ==> OK
            if (_this.isShuffle) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.renderSongs();
            _this.scrollToActiveSong()
        }

        // When click previous button
        prevBtn.onclick = function() { // ==> OK
            if (_this.isShuffle) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.renderSongs();
        }

        // When click shuffle button
        shuffleBtn.onclick = function(e) { // ==> OK
            _this.isShuffle = !_this.isShuffle;
            e.target.classList.toggle('active');
            // _this.setConfig('isShuffle', _this.isShuffle);
        }

        // When song is ended
        audio.onended = function() { // ==> OK
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click()
            }
        }
        // Handle when song is repeated
        repeatBtn.onclick = function(e) { // ==> OK
            _this.isRepeat = !_this.isRepeat;
            e.target.classList.toggle('active');
            _this.setConfig('isRepeat', _this.isRepeat);
        }

        // Click song to play
        playlist.onclick = function(e) { // ==> OK
            const songElement = e.target.closest('.song:not(.active)');
            console.log(songElement)
            if (
                songElement 
                // || e.target.closest('.option')
                ) {
                // Handle when click song
                if (songElement) {
                    // console.log(songElement.getAttribute('data-index'))
                    // ---------or
                    // console.log(songElement.dataset.index)
                    currentIndex = Number(songElement.dataset.index);
                    _this.loadCurrentSong()
                    audio.play();
                    _this.renderSongs();
                }

                // Handle when click option button
                // if (e.target.closest('.option')) {

                // }
            }
        }
    },

    // getCurrentSong: function() {
    //     return this.songs[currentIndex]
    // },

    defineProperties: function() { 
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[currentIndex]
            }
        })
    },

    loadCurrentSong: function() { // ==> OK
        titleCtrlPanel.innerText = this.currentSong.name;
        artistCtrlPanel.innerText = this.currentSong.singer;
        // cd.style.backgroundImage = `url(${this.currentSong.image.replaceAll('"','')})`;
        cd.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() { // ==> OK
        currentIndex++
        if (currentIndex >= this.songs.length) {
            currentIndex = 0
        }
        // console.log(this, currentIndex, this.currentIndex)
        this.loadCurrentSong();
    },

    prevSong: function() { // ==> OK
        currentIndex--
        if (currentIndex < 0) {
            currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() { // ==> OK
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === currentIndex)
        currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('#playlist .song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }, 300)
    }
}

app.start();



// ----------------------------- TOAST MESSAGE -----------------------------
toast = function({
    title = '', 
    message = '', 
    type = '', 
    duration = 3000
}) {
    const main = document.getElementById('toast')
    if (main) {
        const toast = document.createElement('div')
        const icons = {
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warn: 'fas fa-exclamation-circle',
            error: 'fas fa-exclamation-circle',
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `wipeIn ease 0.25s, fadeOut ease-in-out 1s ${delay}s forwards`;
        
        toast.innerHTML = `
        <i class="toast__icon ${icon}"></i>
        <div class="toast__body">
            <h3 class="toast__title">${ title}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <i class="toast__close fas fa-times"></i>
        `;
        
        main.appendChild(toast);

        // Auto remove toast
        const autoRemovId = setTimeout(() => {
            main.removeChild(toast)
        }, duration + 1000) // times remvoe from DOM

        // const closeBtn = $('.toast__close');
        // closeBtn.onclick = function() {
        //     // main.outerHTML = ''
        //     console.log({main})
        //     main.removeChild(this)

        // }
        // -------or
        toast.onclick = function(e) {
            // console.log(e.target)
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemovId)
            }
        }

    }

    
}

function showSuccessToast() {
    toast({
    title: 'Ooops...',
    message: 'This funnction will be upgraded soon',
    type: 'success',
    duration: 3000
});
}

function showInfoToast() {
    toast({
    title: 'Ooops...',
    message: 'This funnction will be upgraded soon',
    type: 'info',
    duration: 3000
});
}

function showWarningToast() {
    toast({
    title: 'Ooops...',
    message: 'This funnction will be upgraded soon',
    type: 'warn',
    duration: 3000
});
}

function showErrorToast() {
    toast({
    title: 'Ooops...',
    message: 'This funnction will be upgraded soon',
    type: 'error',
    duration: 5000
});
}

