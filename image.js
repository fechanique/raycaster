let images = {
    'brick.png':{width:0, height:0, data:[], loaded:false},
    'ceiling.png':{width:0, height:0, data:[], loaded:false},
    'floor.jpg':{width:0, height:0, data:[], loaded:false},
    'transparent.png':{width:0, height:0, data:[], loaded:false},
    'wood.jpg':{width:0, height:0, data:[], loaded:false},
    'tree.png':{width:0, height:0, data:[], loaded:false},
    'skybox.jpg':{width:0, height:0, data:[], loaded:false},
    'glass.jpg':{width:0, height:0, data:[], loaded:false},
    'redGlass.jpg':{width:0, height:0, data:[], loaded:false},
    'yellowGlass.jpg':{width:0, height:0, data:[], loaded:false},
    'blueGlass.jpg':{width:0, height:0, data:[], loaded:false},
    'greenGlass.jpg':{width:0, height:0, data:[], loaded:false},
    'fence.png':{width:0, height:0, data:[], loaded:false},
    'door.jpg':{width:0, height:0, data:[], loaded:false},
    'candle.png':{width:0, height:0, data:[], loaded:false},
    'grass.jpg':{width:0, height:0, data:[], loaded:false},
    'elevatorRail.png':{width:0, height:0, data:[], loaded:false},
    'gun.png':{width:0, height:0, data:[], loaded:false},
    'duke.png':{width:0, height:0, data:[], loaded:false},
    'heart.png':{width:0, height:0, data:[], loaded:false},
    'bullets.png':{width:0, height:0, data:[], loaded:false},
}
let patterns = {}

function loadImage(src, isSkybox = false) {
    const img = new Image();
    img.src = 'images/' + src;
    img.onload = function() {
        let canvas = new OffscreenCanvas(1, 1)
        let imageCtx = canvas.getContext('2d')
        canvas.width = img.width;
        canvas.height = img.height;
        imageCtx.drawImage(img, 0, 0);
        let imageData = imageCtx.getImageData(0, 0, img.width, img.height).data;
        images[src] = { width: img.width, height: img.height, data: imageData, loaded: true }

        let pattern = imageCtx.createPattern(img, 'repeat')
        patterns[src] = pattern
        //all images loaded
        let allLoaded = Object.values(images).every(image => image.loaded)
        if (allLoaded) {
            console.log('All images loaded');
            loadSkyBox()
            events.dispatchEvent(new CustomEvent('loaded-images', { }))
        }
    }
}

function loadImages(){
    for (let key in images) {
        loadImage(key)
    }
}

function loadSkyBox(){
    skybox = game.images['skybox.jpg']
    skybox.texture_h = 3
    skybox.const1 = (skybox.height / game.opt.height) / skybox.texture_h
    skybox.const2 = ((game.opt.height/2)*(skybox.texture_h-1))
    skybox.w = (game.opt.width*(360/(game.cam.fov))/skybox.width)
}

//Probar a pintar todas las textutas sobre un mismo canvas