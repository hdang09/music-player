const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.panel-playlist__cd');
const cdSize = cd.offsetWidth;
const audio = $('.audio');
const titleCtrlPanel =$('.panel-playlist__name');
const artistCtrlPanel =$('.panel-playlist__artist');
const toggleBtn = $('.panel__center-toggle');
const timeBar = $('.panel-time_bar');
const prevBtn = $('.fa-fast-backward');
const nextBtn = $('.fa-fast-forward');
const shuffleBtn = $('.fa-random');
const repeatBtn = $('.fa-redo-alt');

var currentIndex = 0;
var isPlaying = false;
var isShuffle = false;
var isRepeat = false;

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

    start: function() {
        this.defineProperties();
        this.renderSongs();
        this.handleEvents();
        this.loadCurrentSong();
        // this.getCurrentSong();
    },

    renderSongs: function() {
        const htmlContainer = this.songs.map((song, index) => {
            return `
                <div class="row ${index === currentIndex ? 'active' : ''}">
                    <div class="playlist__label col l-1 m-1 c-1">${index + 1}</div>
                    <div class="playlist__label col l-4 m-4 c-5">${song.name}</div>
                    <div class="playlist__label col l-3 m-3 c-4">${song.singer}</div>
                    <div class="playlist__label col l-1 m-1 c-2">1:25</div>
                    <div class="playlist__label col l-3 m-3 c-0">The Ecstatic</div>
                </div>
            `
        })
        var htmlsContainer = `
            <h1 class="container__title">My Playlist</h1>
            <div class="row">
                <div class="playlist__title col l-1 m-1 c-1">#</div>
                <div class="playlist__title col l-4 m-4 c-5">TITLE</div>
                <div class="playlist__title col l-3 m-3 c-4">ARTIST</div>
                <div class="playlist__title col l-1 m-1 c-2">TIME</div>
                <div class="playlist__title col l-3 m-3 c-0">ALBUM</div>
            </div>
        ` + htmlContainer.join('');
        document.getElementById('playlist').innerHTML = htmlsContainer;
        console.log(currentIndex)
    },

    handleEvents: function() {
        const _this = this;
        // Handle when scroll to shrik/grod cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdSize = cdSize - scrollTop;
            cd.style.width = newCdSize > 0 ? newCdSize + 'px': 0;
            cd.style.height = newCdSize > 0 ? newCdSize + 'px': 0;
            cd.style.opacity = newCdSize / cdSize;
        }

        // Handle when click play btn
        toggleBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
                // _this.isPlaying = false;
            } else {
                // _this.isPlaying = true
                audio.play()
            }
            // toggleBtn.classList.toggle('playing')
        }

        // When song is played
        audio.onplay = function() {
            _this.isPlaying = true;
            toggleBtn.classList.add('playing');
            cdRotate.play()
        }

        // When song is paused
        audio.onpause = function() {
            _this.isPlaying = false;
            toggleBtn.classList.remove('playing')
            cdRotate.pause()
        }

        // When progress bar is changed
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progress = Math.floor(audio.currentTime / audio.duration * 100);
                timeBar.value = progress;
            }
        }

        // Handle when seek
        timeBar.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // Handle when CD roatates
        const cdRotate = cd.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause()

        // When click next button
        nextBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.renderSongs();
        }

        // When click previous button
        prevBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.renderSongs();
        }

        // When click shuffle button
        shuffleBtn.onclick = function(e) {
            _this.isShuffle = !_this.isShuffle;
            e.target.classList.toggle('active');
        }

        // When song is ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click()
            }
        }

        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            e.target.classList.toggle('active');
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

    loadCurrentSong: function() {
        titleCtrlPanel.innerText = this.currentSong.name;
        artistCtrlPanel.innerText = this.currentSong.singer;
        // cd.style.backgroundImage = `url(${this.currentSong.image.replaceAll('"','')})`;
        cd.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        currentIndex++
        if (currentIndex >= this.songs.length) {
            currentIndex = 0
        }
        // console.log(this, currentIndex, this.currentIndex)
        this.loadCurrentSong();
    },

    prevSong: function() {
        currentIndex--
        if (currentIndex < 0) {
            currentIndex = this.songs.length - 1;
        }
        console.log(currentIndex)
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === currentIndex)
        currentIndex = newIndex;
        this.loadCurrentSong();
    },
    repeatSong: function() {

    }
}

app.start();
