
class Configuration {
    constructor() {
        this.audio = new Audio()
        this.list = []
        this.listLength = 0
        this.duration = 0
        this.exten = ''
        this.dir = ''
        this.isPlaying = false
        this.listIndex = 0
        this.currentPlay = ''
        this.duration = 0
        this.currentTime = 0
        this.volume = 0
        this.currentTimeInPersentage = 0
        this.normalDuration = ''
        this.normalCurrentTime = ''
        this.nameList = ''
        this.currentlyPlayingIndex = 0
    }

    _setNormalTime(totalSeconds) {

        let hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60)

        if (isNaN(hours)) {
            return `0:0:0`
        }

        return `${hours}:${minutes}:${seconds}`

    }

    update() {
        this.listLength = this.list.length
        this.dir = this.audio.src


        this.duration = this.audio.duration
        this.currentTime = this.audio.currentTime
        const arr = []
        for (let item of this.list) {
            let name = item.split('/')[item.split('/').length - 1]
            // console.log(name)
            name = name.split('.').shift()
            arr.push(name)
        }
        this.nameList = arr


        this.normalDuration = this._setNormalTime(this.duration)
        this.normalCurrentTime = this._setNormalTime(this.currentTime)
        this.currentlyPlayingIndex = this.listIndex
        this.volume = this.audio.volume
        this.currentTimeInPersentage = this.currentTime / this.duration * 100
        this.currentPlay = this.dir.split('/')[this.dir.split('/').length - 1]
        this.isPlaying = !this.audio.paused
        this.exten = this.dir.split('.')[this.dir.split('.').length - 1] || ''
    }

}

class Event extends Configuration {
    onAudioEnded(callback) {
        if (typeof (callback) !== 'function')
            throw new Error('onAudioEnded requires a callback function')
        this.audio.onended = callback

        return this
    }
    onPlay(callback) {
        if (typeof (callback) !== 'function')
            throw new Error('onPlay requires a callback function ')
        this.audio.onplay = callback
        return this
    }

    onPause(callback) {
        if (typeof (callback) !== 'function')
            throw new Error('onPause requires a callback function')
        this.audio.onpause = callback
        return this
    }
    onAbort(callback) {
        if (typeof (callback) !== 'fucntion')
            throw new Error('onAbout requires a callback function')
        this.audio.onabort = callback
        return this
    }
    onChange(callback) {
        if (typeof (callback) !== 'function')
            throw new Error('onChange requires a callback function')
        this.audio.onload = callback
        return this
    }
}



class Controls extends Event {
    play(callback) {
        try {
            this.audio.play()
            this.update()
            const then = this

            if (typeof callback === 'function')
                callback({
                    state: 'sucess',
                    playing: then.dir,
                    isPlaying: then.isPlaying
                })

        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }

    pause(callback) {
        try {
            this.audio.pause()
            this.update()
            const then = this

            if (typeof callback === 'function')
                callback({
                    state: 'sucess',
                    playing: then.dir,
                    isPlaying: then.isPlaying
                })

        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }

    toggle(callback) {
        try {
            if (this.isPlaying) {
                this.audio.pause()
            }
            else {
                this.audio.play()
            }
            this.update()
            const then = this

            if (typeof callback === 'function')
                callback({
                    state: 'sucess',
                    playing: then.dir,
                    isPlaying: then.isPlaying
                })

        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }
    setVolume(vol, callback) {
        try {
            if (typeof vol !== 'number')
                throw new Error('setVolume method requires an intiger value')
            vol = (vol / 100)
            this.audio.volume = vol
            const then = this
            if (typeof callback === 'function')
                callback({
                    state: 'sucess',
                    volume: then.volume
                }, undefined)
            this.update()

        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }

        return this
    }
    restart(callback) {
        try {
            const playing = this.isPlaying
            this.audio.currentTime = 0
            if (playing) {
                this.play()
            } else {
                this.pause()
            }
            this.update()
            if (typeof callback === 'function')
                callback({
                    state: 'sucessful'
                })
        } catch (error) {
            console.log(error)
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }
    stop(callback) {
        try {
            const playing = this.isPlaying
            this.audio.currentTime = 0
            this.pause()

            this.update()
            if (typeof callback === 'function')
                callback({
                    state: 'sucessful'
                })
        } catch (error) {
            console.log(error)
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }

    nextTrack(callback) {
        try {
            if (this.listLength === 0)
                throw new Error('theres no playlist available')

            this.listIndex++

            if (this.listIndex >= this.listLength) {
                this.listIndex = 0
            } else if (this.listIndex < 0) {
                this.listIndex = this.listLength - 1
            }

            const playing = this.isPlaying

            this.setByIndex(this.listIndex)
            if (playing) {
                this.play()
            } else {
                this.pause()
            }

            this.update()

            if (typeof callback === 'function')
                callback({
                    state: 'sucessful',
                })
        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }

    prevTrack(callback) {
        try {
            if (this.listLength === 0)
                throw new Error('theres no playlist available')

            this.listIndex--

            if (this.listIndex >= this.listLength) {
                this.listIndex = 0
            } else if (this.listIndex < 0) {
                this.listIndex = this.listLength - 1
            }

            const playing = this.isPlaying

            this.setByIndex(this.listIndex)
            if (playing) {
                this.play()
            } else {
                this.pause()
            }
            this.update()
            if (typeof callback === 'function')
                callback({
                    state: 'sucessful',
                })
        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }
}


// audioStream section
class AudioStream extends Controls {
    constructor() {
        super()
    }
    async setList(arr, callback) { // add playlist
        try {
            if (!Array.isArray(arr)) {
                throw new Error('addList expects an array withing the parameta')
            }
            this.list = arr
            if (typeof arr[0] === 'string')
                await this.audio.setAttribute('src', arr[0])

            this.update()

            if (typeof callback === 'function') // optional callback allowed
                callback({ // return a success object
                    state: 'sucess',
                    data: this.list
                })
            console.log(this.audio.duration)
        } catch (error) {
            console.log('there was an error', error)
            if (typeof callback == 'function') {
                callback(undefined, error)
            }
        }
        return this
    }

    addToList(data, insertInfront) { // adding track to list
        // add new audio to list
        if (!data) {
            throw new Error('addToList method requires a string or Array of strings ')
        }
        if (typeof data === 'string')
            data = [data]

        if (insertInfront) {
            // insert track infront
            this.list = [...data, ...this.list]
        } else {
            // insert track behind
            this.list = [...this.list, ...data]
        }
        return this
    }

    async addTrack(track) { // add a single track
        try {
            if (typeof track != 'string')
                throw new Error('add signle track requires a string')
            // this.audio.src = track
            await this.audio.setAttribute('src', track)
            this.update()
            const then = this
            if (typeof callback === 'function')
                callback({
                    state: 'sucess',
                    isPlaying: then.isPlaying,
                })
        } catch (error) {
            if (typeof callback === 'function')
                callback(undefined, error)
        }
        return this
    }
    setByIndex(index, callback) { // set audio by an index
        try {
            if (typeof index !== 'number')
                throw new Error('setByIndex method requires an Intiger')
            if (index >= this.list.length) {
                index = 0
            } else if (index < 0) {
                index = this.list.length - 1
            }
            const playing = this.isPlaying
            this.audio.src = this.list[index]
            if (playing) {
                this.play()
            } else {
                this.pause()
            }
            this.listIndex = index
            this.update()
            const then = this
            if (typeof callback === 'function')
                callback({
                    state: 'sucess',
                    isPlaying: then.isPlaying
                })
        } catch (error) {
            callback(undefined, error)
        }
        return this
    }
    setTimeInSec(time) {
        const playState = this.isPlaying
        this.play()
        this.audio.currentTime = (isNaN(time)) ? 0 : time

        this.audio.addEventListener('loadmetadata', function () {
            this.duration = this.audio.duration
            this.currentTime = this.audio.currentTime
        })

        if (!playState) {
            this.pause()
        }
        return this
    }

    realTime(callback, speed) {
        if (typeof callback !== 'function')
            throw new Error('realTime method requires a callback function')
        let interval = undefined

        interval = setInterval(() => {
            this.update()
            if (!this.isPlaying) {
                clearInterval(interval)
                return
            }
            callback({
                state: 'sucess',
                currentTime: this.currentTime,
                duration: this.duration,
                volume: this.volume,
                dir: this.dir,
                currentTimeInPersentage: this.currentTimeInPersentage,
                normalCurrentTime: this.normalCurrentTime,
                normalDuration: this.normalDuration
            })
            this.update()
        }, speed || 500)
        return this
    }

}

export default AudioStream
