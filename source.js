game = {
    opt: { width: 740, height: 380, res:2, logs:false, map:false, save:true },
    map : { width: 640, height: 480, zoom: 0.5 },
    player : { x: 0, y: 0, z: 0, h: 150, r: -45, head:0, falling:false, flying:false, clip:false, maxH:150, crossHair:true, rad:40, top:20, bot:60},
    cam : { fps: 30, fov: 35, plane_dist: 500, num_rays: null, visibility: 10000, globalLight:1, lightDist: 5000 },
    keys : {},
    rays : [],
    level: level,
    images: images,
    uiImages : uiImages,
    stats: {lives:3, bullets:10, kills:0, deaths:0}
}
game.cam.num_rays = game.opt.width/game.opt.res
game.cam.plane_dist = (game.opt.width / 2) / Math.tan((game.cam.fov*2 * Math.PI / 180) / 2)

savedPlayer = JSON.parse(localStorage.getItem("player"))
if(savedPlayer) game.player = savedPlayer
function deletePlayerData(){
    game.opt.save = false
    localStorage.removeItem("player")
}
index = 0
for(let i = -game.cam.fov; i <= game.cam.fov; i=i+((game.cam.fov*2/(game.cam.num_rays)))){
    game.rays.push({
        i: index, deg:+i, coll: [], cos:+Math.cos((i)/180*Math.PI), sin:+Math.sin((i)/180*Math.PI), 
        screenX0: Math.round(index*game.opt.res), screenX1: Math.round(Math.min((index*game.opt.res)+game.opt.res, game.opt.width))
    })
    index++
}

mapCanvas = document.createElement('canvas')
mapCanvas.id = 'map'
if(game.opt.map) document.getElementById('content').appendChild(mapCanvas)
mapCtx = mapCanvas.getContext('2d')
mapCtx.canvas.width = game.map.width
mapCtx.canvas.height = game.map.height
mapCtx.translate((1-game.map.zoom)*mapCanvas.width/2, (1-game.map.zoom)*mapCanvas.height/2)
mapCtx.scale(game.map.zoom, game.map.zoom)

gameCanvas = document.createElement('canvas')
gameCanvas.id = 'gameCanvas'
document.getElementById('content').appendChild(gameCanvas)
gameCtx = gameCanvas.getContext('2d', { alpha: false })
gameCtx.canvas.width = game.opt.width
gameCtx.canvas.height = game.opt.height
gameCtx.imageSmoothingEnabled = false
//gameCanvas.style.background = 'black'
gameCanvas.style.height = window.innerHeight + 'px'
//gameCanvas.style.width = window.innerWidth + 'px'
setMouse()

if(game.opt.logs) document.body.insertAdjacentHTML('beforeend', '<div id="logs"></div>')

imageData = gameCtx.createImageData(game.opt.width, game.opt.height)
const data = new Uint32Array(imageData.data.buffer)

elapsedTime = 0
previousTime = 0
let fpsLastTime = performance.now()
let fpsFrameCount = 0
let fps = 0
function frame(time) {
    fpsFrameCount++;
    const delta = time - fpsLastTime;
    if (delta >= 1000) {
        fps = ~~(fpsFrameCount * 1000 / delta);
        fpsFrameCount = 0;
        fpsLastTime = time;
    }
    
    elapsedTime = (time - previousTime)
    previousTime = time

    loop(elapsedTime)
    if(game.opt.map) drawMap()
    drawGame()
    drawUI()

    gameCtx.putImageData(imageData, 0, 0)

    drawHUD()
    if(game.opt.logs)logs()

    requestAnimationFrame(frame)
}

pixel = [0,0,0,0]
z_buffer = new Array(game.opt.height)
MATH_PI_180 = Math.PI/180
function drawGame(){

    for(let ray of game.rays){
        z_buffer = new Array(game.opt.height)
        ray_cos = ray.cos
        ray_sin = ray.sin

        ray_deg = ray.deg
        rot_ray_cos = Math.cos((game.player.r-ray.deg)*MATH_PI_180)
        rot_ray_sin = Math.sin((game.player.r-ray.deg)*MATH_PI_180)

        x0 = ray.screenX0
        x1 = ray.screenX1
        ray.x0 = game.player.x
        ray.y0 = game.player.y
        ray.x1 = Math.round(game.player.x+game.cam.visibility*rot_ray_cos)
        ray.y1 = Math.round(game.player.y-game.cam.visibility*rot_ray_sin)

        //CALCULATE COLLISIONS
        ray.coll = []
        for(let sectorIndex=0; sectorIndex<game.level.length ; sectorIndex++){
            let sector = game.level[sectorIndex]
            sector.id = sectorIndex
            if(pointInSector(ray.x0, ray.y0, sector.points)) ray.coll.push({id:-1, dist: 0, sector: sector, face:0, points:sector.points[0]})
            if(pointInSector(ray.x1, ray.y1, sector.points)) ray.coll.push({id:-2, dist: game.cam.visibility, sector: sector, face:0, points:sector.points[0]})
            for(let i=0 ; i<sector.points.length ; i++){
                let j = (i+1)%sector.points.length
                let sx1 = sector.points[i][0]
                let sy1 = sector.points[i][1]
                let sx2 = sector.points[j][0]
                let sy2 = sector.points[j][1]
                let temp_int = findIntersection(ray.x0, ray.y0, ray.x1, ray.y1, sx1, sy1, sx2, sy2)
                //Revisar que las esquinas a vecen devuelven 2 colisiones en el mismo punto
                if(temp_int){
                    let temp_dist = (calcDistance(game.player.x, game.player.y, temp_int.intersectX, temp_int.intersectY))
                    let face_dist = calcDistance(sector.points[i][0], sector.points[i][1], temp_int.intersectX, temp_int.intersectY)
                    //real_dist = Math.sqrt(temp_dist**2 + (game.player.jump-sector.z0)**2)
                    //if(ray.coll.filter(e=>e.dist == temp_dist && e.sector.id == sectorIndex).length == 0){ //evitar caras juntas y esquinas. Esto es eficiente?
                        ray.coll.push({id:sectorIndex+':'+i, dist: temp_dist, sector: sector, face:face_dist, points:sector.points[i], pos:temp_int})
                    //}

                }
            }
        }
        ray.coll.sort((a, b) => a.dist - b.dist)

        //CALCULATE FLOORS
        ray.planes = []
        for(let coll of ray.coll){
            if(coll.isNextColl) continue
            let nextColl = ray.coll.find((e) => e.dist > coll.dist && coll.sector.id == e.sector.id)
            if(nextColl){
                nextColl.isNextColl = true
                ray.planes.push({p0:coll.dist, p1:nextColl.dist, z:coll.sector.z1, isOver:coll.sector.z1 > game.player.z+game.player.h, coll:coll, nextColl:nextColl, isFloor:true})
                ray.planes.push({p0:coll.dist, p1:nextColl.dist, z:coll.sector.z0, isOver:coll.sector.z0 > game.player.z+game.player.h, coll:coll, nextColl:nextColl, isFloor:false})
            }
        }

        //CALCULATE WALLS
        ray.walls = []
        for(let coll of ray.coll){
            if(coll.isBack) continue
            let nextColl = ray.coll.find((e) => e.dist >= coll.dist && coll.sector.id == e.sector.id && coll.id != e.id)
            if(nextColl){
                coll.nextWall = nextColl.id
                nextColl.isBack = true
                if(nextColl.dist > coll.dist) ray.walls.push({z0:nextColl.sector.z0, z1:nextColl.sector.z1, dist:nextColl.dist, face:nextColl.face, coll:nextColl, isFront:false})
            }
            if(coll.dist>0) ray.walls.push({z0:coll.sector.z0, z1:coll.sector.z1, dist:coll.dist, face:coll.face, coll:coll, isFront:true})
        }

        //DRAW WALLS
        ray.walls.sort((a, b) => a.dist - b.dist)
        for(let wall of ray.walls){
            if(wall.isFront && !wall.coll.sector.alpha) drawWall(wall, false)
        }

        //DRAW CEILS
        ray.planes.sort((a, b) => a.z - b.z)
        for(let plane of ray.planes){
            if(plane.isFloor == false && plane.isOver && !plane.coll.sector.alpha) drawPlane(plane, false)
        }

        //DRAW FLOORS
        ray.planes.sort((a, b) => b.z - a.z)
        for(let plane of ray.planes){
            if(plane.isFloor == true && !plane.isOver && !plane.coll.sector.alpha) drawPlane(plane, false)
        }

        drawSky()

        //DRAW ALPHA CEILS
        for(let plane of ray.planes){
            if(plane.isFloor == false && !plane.isOver && plane.coll.sector.alpha) drawPlane(plane, true)
        }
        //DRAW FLOORS
        for(let plane of ray.planes){
            if(plane.isFloor == true && plane.isOver && plane.coll.sector.alpha) drawPlane(plane, true)
        }
        //DRAW ALPHA WALLS
        ray.walls.sort((a, b) => b.dist - a.dist)
        for(let wall of ray.walls){
            if(wall.coll.sector.alpha) drawWall(wall, true)
        }
        //DRAW ALPHA FLOORS
        for(let plane of ray.planes){
            if(plane.isFloor == true && !plane.isOver && plane.coll.sector.alpha) drawPlane(plane, true)
        }
        //DRAW CEILS
        for(let plane of ray.planes){
            if(plane.isFloor == false && plane.isOver && plane.coll.sector.alpha) drawPlane(plane, true)
        }
        
    }
}

function drawWall(wall, isAlpha){
    let top_px = ((wall.z1-game.player.h-game.player.z)/(wall.dist*ray_cos))*game.cam.plane_dist
    let bot_px = ((wall.z0-game.player.h-game.player.z)/((wall.dist)*ray_cos))*game.cam.plane_dist
    let y0 = Math.ceil(Math.max(((game.opt.height/2)-(top_px)+game.player.head), 0))
    let y1 = Math.ceil(Math.min(((game.opt.height/2)-(bot_px)+game.player.head), game.opt.height))

    let image_y0 = ((game.opt.height/2)-(top_px)+game.player.head)
    let image_x = ~~(wall.face*wall.coll.points[6]+wall.coll.points[8])
    let b = ((wall.z1-wall.coll.sector.z0)/(top_px-bot_px))*wall.coll.points[7]

    let start = true
    for(let y=y0; y<y1; y++){
        if(wall.dist > z_buffer[y]){
            start = true
            continue
        }
        if((y)%game.opt.res==0 || start){
            start = false
            getPixel(image_x, ~~(((y-image_y0)*b)+wall.coll.points[9]), game.images[wall.coll.points[2]], pixel)
            if(wall.coll.sector.alphaValue) pixel[3] = wall.coll.sector.alphaValue
            if(pixel[3] == 0) continue
            getShadedPixel(pixel, wall.dist, [wall.coll.points[3], wall.coll.points[4], wall.coll.points[5]], pixel)
            if(isAlpha && pixel[3] < 255){
                let prevPixel = data[y*game.opt.width+x0]
                mixRgbAlpha(pixel, [prevPixel & 0xFF, prevPixel >> 8 & 0xFF, prevPixel >> 16 & 0xFF, prevPixel >> 24 & 0xFF], pixel)
            }
        }
        if(pixel[3] == 0) continue
        if(!isAlpha) z_buffer[y] = wall.dist
        let k = y*game.opt.width
        for(let x=x0; x<x1; x++){
            data[k+x] = rgbaToPixel(pixel)
        }
    }
}

function drawPlane(plane, isAlpha){
    let top_px = ((plane.z-game.player.h-game.player.z)/(plane.p1*ray_cos))*game.cam.plane_dist
    let bot_px = ((plane.z-game.player.h-game.player.z)/(plane.p0*ray_cos))*game.cam.plane_dist

    let plane_height = plane.z-game.player.h
    let cons_1 = ((plane_height-game.player.z)*game.cam.plane_dist)/ray_cos

    if(plane.isOver) [top_px, bot_px] = [bot_px, top_px]

    let y0 = Math.ceil(Math.max(((game.opt.height/2)-(top_px)+game.player.head), 0))
    let y1 = Math.ceil(Math.min(((game.opt.height/2)-(bot_px)+game.player.head), game.opt.height))
    
    // Ángulo de rotación del plano (en radianes)
    let rot = -plane.coll.sector.r * MATH_PI_180;

    let planeDist = null
    let planeImage = plane.isFloor?plane.coll.sector.floor:plane.coll.sector.ceil
    for(let y=y0; y<y1; y++){
        if((y)%game.opt.res==0 || !planeDist){ //revisar lo de y-y0 porque genera artefactos
            planeDist = Math.abs(cons_1/(y-game.opt.height/2-game.player.head))
            if(planeDist > z_buffer[y]){
                planeDist = null
                continue
            }
            let image_x = (game.player.x + rot_ray_cos*planeDist)
            let image_y = (game.player.y - rot_ray_sin*planeDist)

            // Coordenadas en el mundo del punto a proyectar
            let rel_x = image_x - plane.coll.sector.points[0][0];
            let rel_y = image_y - plane.coll.sector.points[0][1];
            // Rotar el punto según el ángulo del sector
            let rot_rel_x = rel_x * Math.cos(rot) - rel_y * Math.sin(rot);
            let rot_rel_y = rel_x * Math.sin(rot) + rel_y * Math.cos(rot);
            // Cálculo de textura
            let texture_x = ~~((rot_rel_x + planeImage[6]) * planeImage[4]);
            let texture_y = ~~((rot_rel_y + planeImage[7]) * planeImage[5]);

            getPixel(texture_x, texture_y, game.images[planeImage[0]], pixel)
            if(plane.coll.sector.alphaValue) pixel[3] = plane.coll.sector.alphaValue
            if(pixel[3] == 0) continue
            getShadedPixel(pixel, planeDist, [planeImage[1], planeImage[2], planeImage[3]], pixel)
            if(isAlpha && pixel[3] < 255){
                let prevPixel = data[y*game.opt.width+x0]
                mixRgbAlpha(pixel, [prevPixel & 0xFF, prevPixel >> 8 & 0xFF, prevPixel >> 16 & 0xFF, prevPixel >> 24 & 0xFF], pixel)
            }
        }
        if(pixel[3] == 0) continue
        if(!isAlpha) z_buffer[y] = planeDist
        let k = y*game.opt.width
        for(let x=x0; x<x1; x++){
            data[k+x] = rgbaToPixel(pixel)
        }
    }
}

function drawSky(){
    let skybox = game.images['skybox.jpg']
    skybox.texture_h = 3
    let skybox_height = (skybox.height / game.opt.height) / skybox.texture_h
    let skybox_height2 = ((game.opt.height/2)*(skybox.texture_h-1))
    let w = (game.opt.width*(360/(game.cam.fov*2))/skybox.width)
    let image_x = ((x0/w) - skybox.width*game.player.r/360)

    let start = true
    for (let y = 0; y < game.opt.height; y++) {
        if(z_buffer[y] < game.cam.visibility){
            start = true
            continue
        }
        if((y)%game.opt.res==0 || start){
            start = false
            let image_y = ((y + skybox_height2 - game.player.head/1.5)*skybox_height)
            getPixel(~~image_x, ~~image_y, skybox, pixel)
        }
        let k = y*game.opt.width
        for (let x = x0; x < x1; x++) {
            data[k+x] = (255 << 24) | (pixel[2]*game.cam.globalLight << 16) | (pixel[1]*game.cam.globalLight << 8) | pixel[0]*game.cam.globalLight
        }
    }
}

function drawUI(){
    for(let image of game.uiImages){
        let imageData = game.images[image.src]
        let initX = image.toX>0? game.opt.width*image.originX : (game.opt.width*image.originX)+image.toX
        let initY = image.toY>0? game.opt.height*image.originY : (game.opt.height*image.originY)+image.toY
        
        for (let x0 = 0; x0 < Math.abs(image.toX); x0+=game.opt.res) {
            for (let y = 0; y < Math.abs(image.toY); y++) {
                let k = (y+initY)*game.opt.width
                let image_x = (x0+image.despX)*image.factorX
                let image_y = (y+image.despY)*image.factorY
                if(y%game.opt.res==0) getPixel(~~image_x, ~~image_y, imageData, pixel)
                for(x=0; x<game.opt.res; x++ ){
                    if(pixel[3] != 0)
                    data[k+x0+x+initX] = (255 << 24) | (pixel[2]*game.cam.globalLight << 16) | (pixel[1]*game.cam.globalLight << 8) | pixel[0]*game.cam.globalLight
                }
            }
        }
    }
}

function drawMap(){
    mapCtx.fillStyle = "whitesmoke"
    mapCtx.fillRect((mapCanvas.width/2)-(mapCanvas.width/2)/game.map.zoom, (mapCanvas.height/2)-(mapCanvas.height/2)/game.map.zoom, mapCanvas.width/game.map.zoom, mapCanvas.height/game.map.zoom)
    mapCtx.restore()
    mapCtx.save()
    mapCtx.translate(-game.player.x+mapCanvas.width/2, -game.player.y+mapCanvas.height/2)

    for(let elem of game.level){
        mapCtx.beginPath()
        for(let path of elem.points){
            mapCtx.lineTo(path[0], path[1])
            mapCtx.fillRect(path[0]-2, path[1]-2, 4, 4)
        }
        mapCtx.closePath()
        mapCtx.stroke()
    }

    mapCtx.beginPath();
    mapCtx.arc(game.player.x, game.player.y, game.player.rad, 0, 2 * Math.PI);
    mapCtx.stroke();

    mapCtx.restore()
    mapCtx.save()

    mapCtx.translate(mapCanvas.width/2, mapCanvas.height/2)
    mapCtx.rotate(-game.player.r/180*Math.PI)
    mapCtx.lineWidth = 3
    mapCtx.beginPath()
    mapCtx.moveTo(-5, -10)
    mapCtx.lineTo(-5, 10)
    mapCtx.stroke()
    mapCtx.beginPath()
    mapCtx.moveTo(-5, 10)
    mapCtx.lineTo(5, 0)
    mapCtx.stroke()
    mapCtx.moveTo(-5, -10)
    mapCtx.lineTo(5, 0)
    mapCtx.stroke()

    mapCtx.restore()
    mapCtx.save()
}

requestAnimationFrame(frame)

function getPixel(x, y, texture, out) {
    //out[0]=255; out[1]=255; out[2]=255; out[3]=255;
    //return out
    //if(!out) out = [0, 0, 0, 0];
    if(!isFinite(x) || !isFinite(y) || !texture.data || texture.data.length == 0) {
        out[0]=255; out[1]=0; out[2]=255; out[3]=255;
        return out;
    }
    let w = texture.width, h = texture.height;
    let x_mod = ((x % w) + w) % w;
    let y_mod = ((y % h) + h) % h;
    let index = (y_mod * w + x_mod) * 4;
    out[0] = texture.data[index];
    out[1] = texture.data[index+1];
    out[2] = texture.data[index+2];
    out[3] = texture.data[index+3];
    return out;
}

function mixRgbAlpha(rgba1, rgba2, out){
    //if(!out) out = [255, 0, 0, 255]
    let a1 = rgba1[3]/255
    let a2 = rgba2[3]/255

    let a = a1+a2*(1-a1)
    out[0] = ~~((rgba1[0]*a1+rgba2[0]*a2*(1-a1))/a)
    out[1] = ~~((rgba1[1]*a1+rgba2[1]*a2*(1-a1))/a)
    out[2] = ~~((rgba1[2]*a1+rgba2[2]*a2*(1-a1))/a)
    out[3] = ~~(a*255)

    return out
}

function getShadedPixel(rgba, dist, light, out){
    //if(!out) out = [0, 255, 0, 255]
    out[0] = (rgba[0] * Math.max(0, Math.min(1, light[0] + game.cam.globalLight - dist / game.cam.lightDist))) | 0
    out[1] = (rgba[1] * Math.max(0, Math.min(1, light[1] + game.cam.globalLight - dist / game.cam.lightDist))) | 0
    out[2] = (rgba[2] * Math.max(0, Math.min(1, light[2] + game.cam.globalLight - dist / game.cam.lightDist))) | 0
    /*if(rgba[3] < 255){
        r_shaded = (rgba[0] * 0) | 0
        g_shaded = (rgba[1] * 0) | 0
        b_shaded = (rgba[2] * 0) | 0
    }*/
    return out
}

function rgbaToPixel(rgba){
    return (rgba[3] << 24) | (rgba[2] << 16) | (rgba[1] << 8) | rgba[0]
}

let log = ''
function logs(){
    document.getElementById('logs').innerHTML = log
}

  ///////////////////
 // AUX FUNCTIONS //
///////////////////
function findIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    // Asegurarse de que las líneas no son paralelas
    if (denominator == 0) return null

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

    // Si t y u están entre 0 y 1, las líneas se intersectan en este segmento
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const intersectX = ~~((x1 + t * (x2 - x1))*100)/100
        const intersectY = ~~((y1 + t * (y2 - y1))*100)/100
        return { intersectX, intersectY }
    }

    // Si t o u no están en el rango de 0 a 1, entonces no hay una intersección en los segmentos de línea dados
    return null
}

function calcDistance(x1, y1, x2, y2){
    let x = (x2-x1)
    let y = (y2-y1)
    return ~~(Math.sqrt(x**2+y**2)*100)/100
}

function pointInSector(posx, posy, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        let [xi, yi] = points[i]
        let [xj, yj] = points[j]

        let onEdge = ( 
            ( (posy - yi) * (xj - xi) === (posx - xi) * (yj - yi) ) &&
            (posx >= Math.min(xi, xj) && posx <= Math.max(xi, xj)) &&
            (posy >= Math.min(yi, yj) && posy <= Math.max(yi, yj))
        );
        if (onEdge) return true;

        let inters = ((yi > posy) != (yj > posy)) && (posx < (xj - xi) * (posy - yi) / (yj - yi) + xi)
        
        if (inters) inside = !inside
    }

    return inside
}

start()