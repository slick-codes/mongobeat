
class AudioStream {
	constructor() {
		this.audio = new Audio()
		this.isPaused = null
		this.duration = 0
		this.streamExten = undefined // get audio file extension
		this.streamName = '' // name of the audio
		this.dir = ''
		this.volume = this.audio.volume
		this.volumeInPersent = this.audio.volume * 100
		this.currentTime = this.audio.currentTime
		this.currentTimeInPersentage = 0
		console.log(this.audio.volume * 100)
	}
	updateStream() { // update stream state
		this.isPaused = this.audio.paused
		this.duration = this.audio.duration

		//get extention
		const dir = this.audio.src
		let extension = dir.split('.')
		let extn = extension[extension.length - 1]

		this.streamExten = '.' + extn
		this.volume = this.audio.volume
		this.volumeInPersent = Math.round(this.audio.volume * 100)
		this.dir = extension.join('.')
		extension.pop()
		this.streamName = dir.split('/')[dir.split('/').length - 1]
		this.currentTime = this.audio.currentTime
		this.currentTimeInPersentage = this.currentTime / this.duration * 100
	}
	addStream(audioDir) { // 
		// let err = undefined
		try {
			this.audio.src = audioDir
			this.updateStream()
		} catch (error) {
			throw new Error('mogobeat error', error)
		}
	}

	addNewStream(audio) {
		this.addStream(audio)
	}

	playStream(callback) {
		let err = undefined
		try {
			this.audio.play()
			this.updateStream()
		} catch (error) {
			err = error
		}
		if (typeof callback === 'function')
			callback(err)
	}

	pauseStream(callback) {
		let err = undefined
		try {
			this.audio.pause()
			this.updateStream()
		} catch (error) {
			err = error
		}
		if (typeof callback === 'function')
			callback(err)
	}
	stopStream() {
		this.audio.duration = 0
		this.pauseStream()
	}
	restartStream() {
		this.audio.duration = 0
		this.playStream()
	}
	beforeStopStream(callback) {
		if (typeof callback !== 'function')
			return console.error('beforeStopStream method requires one callback function')
		callback()
		this.stopStream()
	}

	toggleStream(callback) {
		try {
			if (this.isPaused) {
				this.playStream()
			} else if (!this.isPaused) {
				this.pauseStream()
			}
		} catch (error) {
			if (!callback) {
				throw new Error(error)
				return
			}

			callback(error)
			return
		}
		callback(undefined, this.isPaused, this)


	}

	setVolume(vol) {
		if (typeof vol !== 'number')
			return console.error('setStreamVolume method requires a intiger value')
		vol = (vol / 100)
		this.audio.volume = vol
		this.updateStream()
	}

	realTimeStream(callback, speed) {
		if (typeof (callback) !== 'function')
			return console.error('realTimeStream method requires a callback function')
		let interval = undefined;

		interval = setInterval(() => {
			this.updateStream()
			if (this.isPaused) clearInterval(interval)
			callback(this.isPaused)
		}, speed || 500)
	}

	// event stack
	onPlay(callback) {
		if (typeof (callback) != 'function')
			return console.error('onPlay method expects a callback ')
		this.audio.onplay = callback
		return this
	}

	onPause(callback) {
		if (typeof (callback) != 'function')
			throw new Error('onPause method expects a callback')
		this.audio.onpause = callback
		return this
	}

	onChange(callback) {
		if (typeof (callback) != 'function') {
			throw new Error('onChange method expects a callback')
		}
		this.audio.onchange = callback
		return this
	}

	onAudioEnded(callback) {
		if (typeof (callback) != 'function')
			return console.log('onAudioEnded method expects a callback ')
		this.audio.onended = callback
		return this
	}

}



export default {
	AudioStream
}