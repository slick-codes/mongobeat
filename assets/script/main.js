import MongoBeat from './../lib/_mongobeat.js'


const playBtn = document.querySelector('#play')
const nextBtn = document.querySelector('#next')
const prevBtn = document.querySelector('#prev')
const rangeInput = document.querySelector('input[type=range]')
const stopBtn = document.querySelector('#stop')
const progressBar = document.querySelector('.progressbar div')
const timeOutput = document.querySelector('#time-output')
const durationOutput = document.querySelector('#duration-output')

const audio = new MongoBeat()

const playlistContainer = document.querySelector('.playlist')




const audioList = [
    'assets/media/audio.mp3',
    'assets/media/audio2.mp3',
    'assets/media/audio3.mp3',
    'assets/media/audio4.mp3',
    'assets/media/audio5.mp3',
    'assets/media/audio6.mp3',
]

audio.setList(audioList, function () {

    const updateProgressBar = (data, error) => {
        if (error) return console.log('there was an error', error)
        progressBar.style.width = data.currentTimeInPersentage + '%'
        timeOutput.innerText = data.normalCurrentTime
        durationOutput.innerText = data.normalDuration
    }
    console.log(audio.nameList)
    function setPlaylist() {
        const ul = document.createElement('ul')
        for (let index in audio.nameList) {
            const li = document.createElement('li')
            li.setAttribute('data-index', index)
            li.innerText = audio.nameList[index]
            ul.appendChild(li)

            li.onclick = function () {
                let index = event.target.getAttribute('data-index')
                index = Number(index)
                audio.setByIndex(index, () => (!audio.isPlaying) && audio.play())
                    .realTime(updateProgressBar, 200)
            }
        }
        playlistContainer.appendChild(ul)
    }
    setPlaylist()



    playBtn.onclick = function () {
        audio.toggle()
            .realTime(updateProgressBar, 200)
    }

    const progressBarContainer = document.querySelector('.progressbar')

    function setTime() {
        const elemWidth = event.target.offsetWidth
        const offsetX = event.offsetX
        const duration = audio.duration
        const calc = (offsetX / elemWidth * duration)

        audio.setTimeInSec(calc)
    }

    progressBarContainer.onclick = setTime
    // progressBarContainer.onmousemove = setTime

    stopBtn.onclick = () => audio.stop(function () {
        progressBar.style.width = 0
        timeOutput.innerText = '0:0:0'
        // durationOutput.innerText = '0:0:0'
    })
    prevBtn.onclick = () => audio.prevTrack()
    nextBtn.onclick = () => audio.nextTrack()

    const volumeOutput = document.querySelector('#output')

    window.onload = function () {
        volumeOutput.innerText = rangeInput.value + '%'
    }

    rangeInput.oninput = () => {
        const volume = Number(event.target.value)
        audio.setVolume(volume)
        volumeOutput.innerText = volume + '%'
    }

    audio.onPlay(() => playBtn.className = "fa fa-pause")
        .onPause(() => playBtn.className = 'fa fa-play')
        .onAudioEnded(function () {
            playBtn.className = 'fa fa-play'
            console.log('running')
            audio.nextTrack()
        })




})
// console.log(audio.duration)

