import MongoBeat from './../lib/_mongobeat.js'


const playBtn = document.querySelector('#play')
const nextBtn = document.querySelector('#next')
const prevBtn = document.querySelector('#prev')
const rageInput = document.querySelector('input[type=range]')
const stopBtn = document.querySelector('#stop')
const progressBar = document.querySelector('.progressbar div')
const timeOutput = document.querySelector('#time-output')
const audio = new MongoBeat()
const audioList = [
    'assets/media/audio.mp3',
    'assets/media/audio2.mp3',
    'assets/media/audio3.mp3',
    'assets/media/audio4.mp3',
    'assets/media/audio5.mp3',
    'assets/media/audio6.mp3',
]
audio.setList(audioList)

playBtn.onclick = function () {
    audio.toggle(function (data, error) {
        if (error) return console.log('there was an error with toggler')
        console.log(data.isPlaying ? 'playing' : 'paused')

    }).realTime((data, error) => {
        if (error) return console.log('there was an error', error)
        progressBar.style.width = data.currentTimeInPersentage + '%'
        timeOutput.innerText = data.normalCurrentTime
    })
}

stopBtn.onclick = function () {
    audio.stop()
}
prevBtn.onclick = function () {
    audio.prevTrack()
}
nextBtn.onclick = function () {
    audio.nextTrack()
}
rageInput.oninput = function () {
    const volume = Number(event.target.value)
    audio.setVolume(volume)
}

audio.onPlay(() => {
    playBtn.className = "fa fa-pause"

}).onPause(function () {
    playBtn.className = 'fa fa-play'

}).onAudioEnded(function () {
    playBtn.className = 'fa fa-play'
    console.log('running')
    audio.nextTrack()
})
    .onChange(function () {
        console.log('audio changed')
    })
