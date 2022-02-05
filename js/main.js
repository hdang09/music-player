const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const nav = $('#nav');
const navItemLinks = $$('.nav__item-link');
const navListTitles = $$('.nav__list-title');
const menuNavBtn = $('.nav__logo-menu');
const cd = $('.panel-playlist__cd');
const cdSize = cd.offsetWidth;
const songList = $('.song-list');
const shrinkBtn = $('.shrink-btn');
const toggleBtn = $('.panel-center__toggle');
const progressBar = $('.panel-time__bar');
const audio = $('.audio');
const currentTimeSong = $('.panel-time__current');
const lengthSongPanel = $('.panel-length');
const nextBtn = $('.panel-center__icon.fas.fa-fast-forward');
const prevBtn = $('.panel-center__icon.fas.fa-fast-backward');
const playlist = $('#playlist');
const repeatBtn = $('.panel-center__icon.fas.fa-redo-alt');
const shuffleBtn = $('.panel-center__icon.fas.fa-random');
const ctrlPanel = $('#control-panel');
const panelPlayer = $('.panel-player');
const songName = $('.panel-playlist__name')
const artistName = $('.panel-playlist__artist')
const songNode = $('#playlist .song');


var currentIndex = 0;
var isPlaying = false;
var isRepeat = false;
var isShuffle = false;
var isClickShrinkBtn = false;
var isMaximize = false;
var isShrinking = false;

/*
1. Render songs ==> OK
2. Scroll top ==> OK
3. Play / pause / seek ==> OK
4. CD rotate ==> OK
5. Next / prev ==> OK
6. Random ==> OK
7. Next / Repeat when ended ==> OK
8. Active song (songName, artist) ==> OK
9. Scroll active song into view ==> OK
10. Play song when click
*/
songs = [
    {
        name: 'Chạy Ngay Đi (Onionn Remix)',
        singer: 'Sơn Tùng M-TP',
        image: './img/playlist/img1.jpg',
        path: './music/Chạy Ngay Đi (Onionn Remix).mp3',
        album: 'm-tp M-TP'
    },
    {
        name: 'Chạy Ngay Đi',
        singer: 'Sơn Tùng M-TP',
        image: './img/playlist/img2.jpg',
        path: './music/Chạy Ngay Đi.mp3',
        album: 'm-tp M-TP'
    },
    {
        name: 'Hãy Trao Cho Anh',
        singer: 'Sơn Tùng M-TP',
        image: './img/playlist/img3.jpg',
        path: './music/Hãy Trao Cho Anh.mp3',
        album: 'm-tp M-TP'
    },
    {
        name: 'Muộn Rồi Mà Sao Còn',
        singer: 'Sơn Tùng M-TP',
        image: './img/playlist/img4.jpg',
        path: './music/Muộn Rồi Mà Sao Còn.mp3',
        album: 'm-tp M-TP'
    },
    {
        name: 'Nơi Này Có Anh (Masew Bootleg)',
        singer: 'Sơn Tùng M-TP',
        image: './img/playlist/img5.jpg',
        path: './music/Noi-Nay-Co-Anh-Masew-Bootleg-Son-Tung-M-TP-Masew.mp3',
        album: 'm-tp M-TP'
    },
    {
        name: 'Lạc Trôi (Triple D Remix)',
        singer: 'Sơn Tùng M-TP',
        image: './img/playlist/img6.jpg',
        path: './music/Lac-Troi-Triple-D-Remix-Son-Tung-M-TP.mp3',
        album: 'm-tp M-TP'
    },
]

function renderSongs() {
    var htmls = songs.map((song, index) => {
        return `
        <li class="row song ${currentIndex === index ? 'active' : ''}">
            <div class="playlist__label order col l-1 m-1 c-1">${++index}</div>
            <div class="playlist__label col l-5 m-5 c-5">${song.name}</div>
            <div class="playlist__label col l-3 m-3 c-4">${song.singer}</div>
            <div class="playlist__label length col l-1 m-1 c-2">2:59</div>
            <div class="playlist__label col l-2 m-2 c-0">${song.album}</div>
        </li>
        `
    })
    songList.innerHTML = htmls.join('')
}


function handleEvents() {
    // When click toggle button
    toggleBtn.onclick = function() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play()
        }
    }
    
    // When seek the music
    progressBar.onchange = function(e) {
        var seekTime = e.target.value / 100 * audio.duration;
        audio.currentTime = seekTime;
        
        mins = Math.floor(seekTime / 60);
        mins = mins < 10 ? '0' + mins : mins;
        secs = Math.floor(seekTime % 60);
        secs = secs < 10 ? '0' + secs : secs;
        currentTimeSong.innerHTML = `<span>${mins}</span>:<span>${secs}</span>`;
    }
    
    // When music is played
    audio.onplay = function() {
        isPlaying = true;
        toggleBtn.classList.add('playing');
        toggleBtn.title = 'Pause'
        cdRotate.play();
    };

    audio.onpause = function() {
        isPlaying = false;
        toggleBtn.classList.remove('playing');
        toggleBtn.title = 'Play';
        cdRotate.pause()
    }

    audio.ontimeupdate = function() {
        mins = Math.floor(audio.currentTime / 60);
        mins = mins < 10 ? '0' + mins : mins;
        secs = Math.floor(audio.currentTime % 60);
        secs = secs < 10 ? '0' + secs : secs;
        currentTimeSong.innerHTML = `<span>${mins}</span>:<span>${secs}</span>`;

        progressBar.value = Math.floor(audio.currentTime / audio.duration * 100);

        endSong = audio.currentTime === audio.duration;
        if (isRepeat || endSong) {
            if (isRepeat && endSong) {
                repeatSong();
                exit;
            }
            if (endSong) {
                nextBtn.click()
            }
        }
    }

    prevBtn.onclick = function() {
        if (isShuffle) {
            shuffleSong();
        } else {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = songs.length - 1;
            }
        }

        playCurrentSong();
        renderSongs();
        scrollToActiveSong();
    }

    nextBtn.onclick = function() {
        if (isShuffle) {
            shuffleSong();
        } else {
            currentIndex++;
            if (currentIndex >= songs.length) {
                currentIndex = 0;
            }
        }

        playCurrentSong();
        renderSongs();
        scrollToActiveSong();

    }

    repeatBtn.onclick = function() {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active');
    }

    shuffleBtn.onclick = function() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active');
    }
    shrinkBtn.onclick = function() {
        isClickShrinkBtn = !isClickShrinkBtn;
        minimizePlaylist();
    }

    // document.onscroll = function() {
    //     minimizePlaylist();
    // }

    ctrlPanel.onclick = function() {
        isMaximize = !isMaximize;
        if (!isMaximize) {
            maximizePlaylist();
        } else {
            // minimizePlaylist();
        }
    }
    
    const cdRotate = cd.animate([
        { transform: 'rotate(360deg)' }
    ], {
        duration: 10000,
        iterations: Infinity
    })
    cdRotate.pause()

    playlist.onclick = function(e) {
        var singleSong = e.target.closest('.song:not(.active)');
        if (singleSong) {
            currentIndex = Number(singleSong.querySelector('.order').innerText - 1)
            renderSongs();
            playCurrentSong();

        }
    }

    menuNavBtn.onclick = function() {
        if (isShrinking) {
            expandNavMenu()
        } else {
            shrinkNavMenu()
        }
    }
}

function defineProperties() { 
    Object.defineProperty(this, 'currentSong', {
        get: function() {
            return songs[currentIndex]
        }
    })
};

function getCurrentSong() {
    return songs[currentIndex]
}

function playCurrentSong() {
    cd.style.backgroundImage = `url('${getCurrentSong().image}')`;
    songName.innerText = getCurrentSong().name;
    artistName.innerText = getCurrentSong().singer;
    audio.src = this.currentSong.path;
    audio.play();

    audio.onloadedmetadata = function() {
        minsLength = Math.floor(audio.duration / 60);
        minsLength = minsLength < 10 ? '0' + minsLength : minsLength;
        secsLngth = Math.floor(audio.duration % 60);
        secsLngth = secsLngth < 10 ? '0' + secsLngth : secsLngth;

        lengthSongPanel.innerHTML = 
        `<span>${minsLength}</span>:<span>${secsLngth}</span>`;
        // lengthSongPlaylist.innerHTML = 
        // `<span>${minsLength}</span>:<span>${secsLngth}</span>`;
    }
}

function repeatSong() {
    audio.currentTime = 0;
    audio.play()
}

function shuffleSong() {
    var oldIndex = currentIndex;
    do {
        currentIndex = Math.floor(Math.random() * songs.length);
    } while (oldIndex === currentIndex)

    playCurrentSong();
    renderSongs();
}

function scrollToActiveSong() {
    console.log($('.song.active'))
    $('.song.active').scrollIntoView({
        behavior: 'smooth',
    })
} 

function minimizePlaylist() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    var newCdSize = cdSize - scrollTop;

    cd.style.width = (newCdSize < 0 || isClickShrinkBtn) ? 0 : newCdSize + 'px';
    cd.style.height = (newCdSize < 0 || isClickShrinkBtn) ? 0 : newCdSize + 'px';


    if (newCdSize !== cdSize || isClickShrinkBtn) {
        shrinkBtn.style.display = 'none';
        panelPlayer.style.display = 'none';
        ctrlPanel.style.padding = '0 30px';
        ctrlPanel.classList.add('flex-c');
    } else {
        shrinkBtn.style.display = screen.width < 1024 ? 'block' : 'none';
        panelPlayer.style.display = 'block';
        ctrlPanel.style.padding = '20px 30px';
        ctrlPanel.classList.remove('flex-c');
    }
}

function maximizePlaylist() {
    cd.style.width = cdSize + 'px';
    cd.style.height = cdSize + 'px';

    shrinkBtn.style.display = screen.width < 1024 ? 'block' : 'none';
    panelPlayer.style.display = 'block';
    ctrlPanel.style.padding = '20px 30px';
    ctrlPanel.classList.remove('flex-c');
}

function shrinkNavMenu() {
    isShrinking = true;
    nav.style.width = 65 + 'px';
    nav.style.paddingLeft = 0;

    navItemLinks.forEach(navItemLink => {
        navItemLink.style.display = 'none'
    })

    $('.nav__item').style.paddingRight = 0;
    $('.nav__item.active').style.border = 0;

    navListTitles.forEach(navListTitle => {
        navListTitle.style.display = 'none';
    })
}

function expandNavMenu() {
    isShrinking = false;
    nav.style.width = 330 + 'px';
    nav.style.paddingLeft = '40px';
    console.log(nav.style)

    navItemLinks.forEach(navItemLink => {
        navItemLink.style.display = 'inline-block'
    })

    $('.nav__item').style.paddingRight = '20px';
    $('.nav__item.active').style.borderRight = '5px solid #000';

    navListTitles.forEach(navListTitle => {
        navListTitle.style.display = 'block';
    })
}

function start() {
    defineProperties();
    renderSongs();
    handleEvents();
    playCurrentSong();
}

start()