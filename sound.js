class Audio{
    constructor(){
        this.enabled = false
    }

    async init(){
        if(this.enabled) return
        console.log('audio enabled')
        this.audioContext = new AudioContext()
        this.listener = this.audioContext.listener
        this.listener.positionX.value = game.player.y
        this.listener.positionY.value = game.player.z
        this.listener.positionZ.value = game.player.x
        this.enabled = true

        for(let sound of sounds){
            if(!sound.playing){
                sound.source = await audio.load(sound.src, sound.x, sound.y, sound.z, sound.dist, sound.loop, sound.ambience)
                sound.playing = true
            }
        }
    }

    async addSound(sound){
        sound.source = await audio.load(sound.src, sound.x, sound.y, sound.z, sound.dist, sound.loop, sound.ambience, sound.gain)
        sound.playing = true
    }

    async delSound(sound){
        if(sound.source){
            sound.source.stop()
            sound.playing = false
        }
    }

    async load(url, x, y, z, dist=2000, loop, ambience, gain){
        if(!this.enabled) return
        const audioBuffer = await fetch(url)
            .then(res => res.arrayBuffer())
            .then(ArrayBuffer => this.audioContext.decodeAudioData(ArrayBuffer))
        let source = this.audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.loop = loop?loop:false
        let gainNode = this.audioContext .createGain()
        gainNode.gain.value = gain?gain:0.5
        if(!ambience){
            let panner = new PannerNode(this.audioContext)
            panner.positionX.value = y?y:game.player.y
            panner.positionY.value = z?z:game.player.z
            panner.positionZ.value = x?x:game.player.x
            //panner.panningModel = 'HRTF'
            panner.distanceModel = 'linear'
            panner.refDistance = 0
            panner.maxDistance = dist
            panner.rolloffFactor = 1
            source.panner = panner
            source.connect(gainNode).connect(source.panner).connect(this.audioContext.destination)
        }else{
            source.connect(gainNode).connect(this.audioContext.destination)
        }
        
        source.start()
        return source
    }

    setPanner(sound, x, y, z){
        if(!sound.source) return
        sound.source.panner.setPosition(y, z, x)
    }

    setPlayer(player){
        if(!this.enabled) return
        this.listener.positionX.value = game.player.y
        this.listener.positionY.value = game.player.z
        this.listener.positionZ.value = game.player.x
        this.listener.forwardX.value = Math.sin(game.player.r*Math.PI/180)
        this.listener.forwardZ.value = -Math.cos(game.player.r*Math.PI/180)
    }

}

sounds = [
    //{id:'elevator', x:-800, y:600, z:0, dist:500, src:'sounds/machine2.mp3', playing:false, loop:true},
    //{id:'ambience', x:-800, y:600, z:0, dist:500, src:'sounds/ambience.mp3', playing:false, loop:true, ambience:true},
]

audio = new Audio()

window.addEventListener("click", (event) => {
    audio.init()
})

events.addEventListener('space', (e) => {
    audio.load('sounds/gun.mp3')
})

events.addEventListener('glass', (e) => {
    let sector = e.detail.sector
    audio.load('sounds/glass-smash.mp3', sector.points[0][0], sector.points[0][1], sector.z0, 2000, false, false)
})

events.addEventListener('player', (e) => {
    audio.setPlayer()
})

events.addEventListener('sound', (e) => {
    let sector = e.detail.sector
    if(sector){
        audio.load(e.detail.sound, sector.points[0][0], sector.points[0][1], sector.z0, 2000, false, false)
    }else{
        audio.load(e.detail.sound)
    }
})

events.addEventListener('start-loop', (e) => {
    let sector = e.detail.sector
    let sound = sounds.find(e=>e.id == sector.id)
    if(sound && !sound.playing){
        audio.addSound(sound)
    }else if(!sound){
        sound = {id:sector.id, x:sector.points[0][0], y:sector.points[0][1], z:sector.z0, dist:4000, src:e.detail.sound, playing:false, loop:true, gain:0.5}
        sounds.push(sound)
        audio.addSound(sound)
    }
})

events.addEventListener('stop-loop', (e) => {
    let sector = e.detail.sector
    let sound = sounds.find(e=>e.id == sector.id)
    if(sound){
        audio.delSound(sound)
    }
})