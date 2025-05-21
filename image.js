let canvas = new OffscreenCanvas(1, 1)
let ctx = canvas.getContext('2d', { willReadFrequently: true })

let images = {}
let patterns = {}

loadImage('brick.png')
loadImage('ceiling.png')
loadImage('transparent.png')
loadImage('wood.jpg')

function loadImage(src, isSkybox = false) {
    const img = new Image();
    img.src = 'images/' + src;
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const textureData = []
        let imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        for (let j = 0; j < imageData.length; j += 4) {
            alpha = imageData[j + 3]
            //if(alpha > 0) alpha = 255
            textureData.push([imageData[j], imageData[j + 1], imageData[j + 2], alpha]);
        }
        images[src] = { width: img.width, height: img.height, data: textureData }

        let pattern = ctx.createPattern(img, 'repeat')
        patterns[src] = pattern
        if(isSkybox){
            skybox.texture_height = img.height
            skybox.texture_width = img.width
        }
    }
}

//Probar a pintar todas las textutas sobre un mismo canvas