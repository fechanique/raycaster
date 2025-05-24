let images = {
    'brick.png':{width:0, height:0, data:[]},
    'ceiling.png':{width:0, height:0, data:[]},
    'transparent.png':{width:0, height:0, data:[]},
    'wood.jpg':{width:0, height:0, data:[]},
    'skybox.jpg':{width:0, height:0, data:[]}
}
let patterns = {}

for (let key in images) {
    loadImage(key)
}

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
        images[src] = { width: img.width, height: img.height, data: imageData}

        let pattern = imageCtx.createPattern(img, 'repeat')
        patterns[src] = pattern
    }
}

//Probar a pintar todas las textutas sobre un mismo canvas