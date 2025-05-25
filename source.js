game = {
    opt: { width: 640, height: 480, res:2, logs:true, map:true },
    map : { width: 640, height: 480, zoom: 0.2 },
    player : { x: 0, y: 0, z: 0, h: 150, r: -45, head:0, falling:false, flying:false, clip:true, maxH:150},
    cam : { fps: 30, fov: 30, plane_dist: 450, num_rays: 320, visibility: 10000 },
    keys : {},
    rays : [],
    level: level,
    images: images
}

savedPlayer = JSON.parse(localStorage.getItem("player"))
if(savedPlayer) game.player = savedPlayer

index = 0
for(let i = -game.cam.fov; i <= game.cam.fov; i=i+((game.cam.fov*2/(game.cam.num_rays)))){
    game.rays.push({i: index++, deg:+i.toFixed(2), coll: [], cos:+Math.cos((i)/180*Math.PI).toFixed(4), sin:+Math.sin((i)/180*Math.PI).toFixed(4)})
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
gameCanvas.id = 'game.opt'
document.getElementById('content').appendChild(gameCanvas)
gameCtx = gameCanvas.getContext('2d', { alpha: false })
gameCtx.canvas.width = game.opt.width
gameCtx.canvas.height = game.opt.height
gameCtx.imageSmoothingEnabled = false
//gameCanvas.style.background = 'black'
//gameCanvas.style.height = window.innerHeight + 'px'
//gameCanvas.style.width = window.innerWidth + 'px'

if(game.opt.logs) document.body.insertAdjacentHTML('beforeend', '<div id="logs"></div>')

imageData = gameCtx.createImageData(game.opt.width, game.opt.height)
const data = new Uint32Array(imageData.data.buffer)

elapsedTime = 0
previousTime = 0
v0 = 0.3
vel = v0
function frame(time) {
    elapsedTime = (time - previousTime)
    previousTime = time
    delta_v = vel*elapsedTime
    delta_x1 = 0
    delta_y1 = 0
    delta_x2 = 0
    delta_y2 = 0
    delta_z = 0
    delta_h = 0

    if(game.keys['shift']){
        vel = v0*2
    }else{
        vel = v0
    }
    if(game.keys['arrowup']){
        delta_x1 = delta_v*Math.cos(game.player.r/180*Math.PI)
        delta_y1 = -delta_v*Math.sin(game.player.r/180*Math.PI)
    }
    if(game.keys['arrowdown']){
        delta_x1 = -delta_v*Math.cos(game.player.r/180*Math.PI)
        delta_y1 = delta_v*Math.sin(game.player.r/180*Math.PI)
    }
    if(game.keys['arrowleft']){
        game.player.r += vel/2*elapsedTime
        game.player.r = ~~(game.player.r%360)
    }
    if(game.keys['arrowright']){
        game.player.r -= vel/2*elapsedTime
        game.player.r = ~~(game.player.r%360)
    }
    if(game.keys['a']){
        delta_x2 = -delta_v*Math.sin(game.player.r/180*Math.PI)
        delta_y2 = -delta_v*Math.cos(game.player.r/180*Math.PI)
    }
    if(game.keys['d']){
        delta_x2 = delta_v*Math.sin(game.player.r/180*Math.PI)
        delta_y2 = delta_v*Math.cos(game.player.r/180*Math.PI)
    }
    if(game.keys['w']){
        delta_z = (vel*elapsedTime)
        game.player.flying = true
    }
    if(game.keys['s']){
        delta_z = -(vel*elapsedTime)
        game.player.flying = true
    }
    if(game.keys['q']){
        game.player.head += Math.round(vel*elapsedTime)
    }
    if(game.keys['z']){
        game.player.head -= Math.round(vel*elapsedTime)
    }
    if(game.keys['r']){
        game.player.head = 0
        game.player.z = 0
        game.player.flying = false
    }
    if(game.keys['x'] && !game.player.toJump){
        game.player.toJump = true
        game.player.jumpTime = 0
        game.player.z0 = game.player.z
        game.player.f = 400
    }
    if(game.keys['c']){
        delta_h = -(vel*2*elapsedTime)
    }else{
        delta_h += (vel*2*elapsedTime)
    }
    if(game.player.toJump){
        game.player.jumpTime += elapsedTime/1000
        game.player.z = ~~(game.player.z0 + game.player.f*(game.player.jumpTime) - (0.5 * 980 * game.player.jumpTime * game.player.jumpTime))
        if(game.player.z < game.player.floor){
            game.player.toJump = false
            game.player.flying = false
            game.player.toUp = false
            game.player.f = 0
            game.player.z = game.player.floor
        }
        if(game.player.z+game.player.h+10 >= game.player.ceil){
            game.player.z0 = game.player.z
            game.player.f = 0
        }
    }
    if(game.player.falling & !game.player.toJump && !game.player.toUp && !game.player.flying){
        game.player.toJump = true
        game.player.jumpTime = 0
        game.player.z0 = game.player.z
        game.player.f = 0
    }
    if(game.player.toUp){
        game.player.toJump = false
        console.log('toUp', game.player.nextFloor)
        game.player.z += Math.round(vel*elapsedTime)
    }

    if(game.player.h+delta_h > game.player.maxH) delta_h = 0
    if(game.player.h+delta_h < 70) delta_h = 0

    if(game.player.z+delta_z+game.player.h+delta_h+10 >= game.player.ceil){
        delta_z = 0
        delta_h = 0
    }else{
        game.player.z += Math.round(delta_z)
        game.player.h += Math.round(delta_h)
    }
    if(game.player.z <= game.player.floor) game.player.z = game.player.floor

    let new_x = Math.round(delta_x1) + Math.round(delta_x2)
    let new_y = Math.round(delta_y1) + Math.round(delta_y2)

    // Movimiento propuesto (por teclado, física, etc)
    let [nx, ny] = moveWithSliding(game.player.x, game.player.y, new_x, new_y, game.level);

    if(game.player.clip){
        game.player.x += ~~new_x;
        game.player.y += ~~new_y;
    }else{
        game.player.x = ~~nx;
        game.player.y = ~~ny;
    }

    localStorage.setItem("player", JSON.stringify(game.player))
    
    if(game.opt.map) drawMap()

    drawGame()

    gameCtx.putImageData(imageData, 0, 0)

    if(game.opt.logs)logs()
    requestAnimationFrame(frame)
}

pixel = [0,0,0,0]
z_buffer = new Array(game.opt.height)
MATH_PI_180 = Math.PI/180
function drawGame(){

    for(let sector of game.level){
        sector.inSector = pointInSector(game.player.x, game.player.y, sector.points)
    }
    game.player.floor = game.level.filter(e=>e.inSector && e.z1 <= game.player.z).sort((a, b) => b.z1 - a.z1) [0]?.z1
    game.player.nextFloor = game.level.filter(e=>e.inSector && e.z1 > game.player.z).sort((a, b) => a.z1 - b.z1) [0]?.z1
    game.player.ceil = game.level.filter(e=>e.inSector && e.z0 >= game.player.z+game.player.h).sort((a, b) => a.z0 - b.z0) [0]?.z0
    game.player.falling = game.player.z > game.player.floor
    game.player.toUp = game.player.nextFloor-game.player.z <= 40

    for(let ray of game.rays){
        z_buffer = new Array(game.opt.height)
        ray_cos = ray.cos
        ray_sin = ray.sin
        ray_rot_cos = Math.cos((ray.deg-game.player.r)*MATH_PI_180)
        ray_rot_sin = Math.sin((ray.deg-game.player.r)*MATH_PI_180)
        x0 = Math.round(ray.i*game.opt.res)
        x1 = Math.round(Math.min(x0+game.opt.res, game.opt.width))

        rot_ray_cos = Math.cos((game.player.r-ray.deg)*MATH_PI_180)
        rot_ray_sin = Math.sin((game.player.r-ray.deg)*MATH_PI_180)

        ray.x0 = game.player.x
        ray.y0 = game.player.y
        ray.x1 = Math.round(game.player.x+game.cam.visibility*rot_ray_cos)
        ray.y1 = Math.round(game.player.y-game.cam.visibility*rot_ray_sin)

        //CALCULATE COLLISIONS
        ray.coll = []
        for(let sectorIndex=0; sectorIndex<game.level.length ; sectorIndex++){
            let sector = game.level[sectorIndex]
            sector.id = sectorIndex
            if(sector.inSector) ray.coll.push({id:-1, dist: 0, sector: sector, face:0})
            if(pointInSector(ray.x1, ray.y1, sector.points)) ray.coll.push({id:-2, dist: game.cam.visibility, sector: sector, face:0})
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
                        ray.coll.push({id:sectorIndex+':'+i, dist: temp_dist, sector: sector, face:face_dist})
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
                ray.planes.push({p0:coll.dist, p1:nextColl.dist, z:coll.sector.z1, isOver:coll.sector.z1 > game.player.z+game.player.h, sector:coll.sector, isFloor:true})
                ray.planes.push({p0:coll.dist, p1:nextColl.dist, z:coll.sector.z0, isOver:coll.sector.z0 > game.player.z+game.player.h, sector:coll.sector,isFloor:false})
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
                if(nextColl.dist > coll.dist) ray.walls.push({z0:nextColl.sector.z0, z1:nextColl.sector.z1, dist:nextColl.dist, face:nextColl.face, sector:nextColl.sector, isFront:false})
            }
            if(coll.dist>0) ray.walls.push({z0:coll.sector.z0, z1:coll.sector.z1, dist:coll.dist, face:coll.face, sector:coll.sector, isFront:true})
        }

        //DRAW WALLS
        ray.walls.sort((a, b) => a.dist - b.dist)
        for(let wall of ray.walls){
            if(wall.isFront && !wall.sector.alpha) drawWall(wall, ray, false)
        }

        //DRAW CEILS
        ray.planes.sort((a, b) => a.z - b.z)
        for(let plane of ray.planes){
            if(plane.isFloor == false && plane.isOver && !plane.sector.alpha) drawPlane(plane, false)
        }

        //DRAW FLOORS
        ray.planes.sort((a, b) => b.z - a.z)
        for(let plane of ray.planes){
            if(plane.isFloor == true && !plane.isOver && !plane.sector.alpha) drawPlane(plane, false)
        }

        drawSky()

        //DRAW ALPHA CEILS
        ray.planes.sort((a, b) => b.z - a.z)
        for(let plane of ray.planes){
            if(plane.isFloor == false && !plane.isOver && plane.sector.alpha) drawPlane(plane, true)
        }
        //DRAW FLOORS
        ray.planes.sort((a, b) => b.z - a.z)
        for(let plane of ray.planes){
            if(plane.isFloor == true && plane.isOver && plane.sector.alpha) drawPlane(plane, true)
        }
        //DRAW ALPHA WALLS
        ray.walls.sort((a, b) => b.dist - a.dist)
        for(let wall of ray.walls){
            if(wall.sector.alpha) drawWall(wall, ray, true)
        }
        //DRAW ALPHA FLOORS
        ray.planes.sort((a, b) => b.z - a.z)
        for(let plane of ray.planes){
            if(plane.isFloor == true && !plane.isOver && plane.sector.alpha) drawPlane(plane, true)
        }
        //DRAW CEILS
        ray.planes.sort((a, b) => b.z - a.z)
        for(let plane of ray.planes){
            if(plane.isFloor == false && plane.z >= game.player.z+game.player.h && plane.sector.alpha) drawPlane(plane, true)
        }
        
    }
}

function drawWall(wall, ray, isAlpha){
    let top_px = ((wall.sector.z1-game.player.h-game.player.z)/(wall.dist*ray.cos))*game.cam.plane_dist
    let bot_px = ((wall.sector.z0-game.player.h-game.player.z)/((wall.dist)*ray.cos))*game.cam.plane_dist
    let y0 = ~~(Math.max(((game.opt.height/2)-(top_px)+game.player.head), 0))
    let y1 = ~~(Math.min(((game.opt.height/2)-(bot_px)+game.player.head), game.opt.height))

    let image_y0 = ((game.opt.height/2)-(top_px)+game.player.head+0)
    let image_x = ~~(wall.face*3+40)
    let b = ((wall.z1-wall.sector.z0)/(top_px-bot_px))*3

    for(let y=y0; y<y1; y++){
        if(wall.dist > z_buffer[y]) continue
        if((y-y0)%game.opt.res==0){
            getPixel(image_x, ~~(((y-image_y0)*b)), game.images[wall.sector.texture], pixel)
            if(wall.sector.alphaValue) pixel[3] = wall.sector.alphaValue
            if(pixel[3] == 0) continue
            if(isAlpha && pixel[3] < 255){
                let prevPixel = data[y*game.opt.width+x0]
                mixRgbAlpha(pixel, [prevPixel & 0xFF, prevPixel >> 8 & 0xFF, prevPixel >> 16 & 0xFF, prevPixel >> 24 & 0xFF], pixel)
            }
            shadedPixel = getShadedPixel(pixel, wall.dist, false)
        }
        if(pixel[3] == 0) continue
        else if(!isAlpha || pixel[3] == 255) z_buffer[y] = wall.dist
        let k = y*game.opt.width
        for(let x=x0; x<x1; x++){
            data[k+x] = shadedPixel
        }
    }
}

function drawPlane(plane, isAlpha){
    let top_px = ((plane.z-game.player.h-game.player.z)/(plane.p1*ray_cos))*game.cam.plane_dist
    let bot_px = ((plane.z-game.player.h-game.player.z)/(plane.p0*ray_cos))*game.cam.plane_dist

    let plane_height = plane.z-game.player.h
    let cons_1 = ((plane_height-game.player.z)*game.cam.plane_dist)/ray_cos

    if(plane.isOver) [top_px, bot_px] = [bot_px, top_px]

    let y0 = ~~(Math.max(((game.opt.height/2)-(top_px)+game.player.head), 0))
    let y1 = ~~(Math.min(((game.opt.height/2)-(bot_px)+game.player.head), game.opt.height))
    
    let planeDist = null
    for(let y=y0; y<y1; y++){
        if((y)%game.opt.res==0 || !planeDist){
            start = false
            planeDist = Math.abs(cons_1/(y-game.opt.height/2-game.player.head))
            if(planeDist > z_buffer[y]){
                planeDist = null
                continue
            }
            let image_x = (game.player.x + ray_rot_cos*planeDist)
            let image_y = (game.player.y + ray_rot_sin*planeDist)
            let texture_x = ~~((image_x - plane.sector.points[0][0])*1)
            let texture_y = ~~((image_y - plane.sector.points[0][1])*1)

            getPixel(texture_x, texture_y, game.images[plane.sector.ceil], pixel)
            if(plane.sector.alphaValue) pixel[3] = plane.sector.alphaValue
            if(pixel[3] == 0) continue
            if(isAlpha && pixel[3] < 255){
                let prevPixel = data[y*game.opt.width+x0]
                mixRgbAlpha(pixel, [prevPixel & 0xFF, prevPixel >> 8 & 0xFF, prevPixel >> 16 & 0xFF, prevPixel >> 24 & 0xFF], pixel)
            }
            shadedPixel = getShadedPixel(pixel, planeDist, false)
        }
        if(pixel[3] == 0) continue
        else if(pixel[3] == 255) z_buffer[y] = planeDist
        let k = y*game.opt.width
        for(let x=x0; x<x1; x++){
            data[k+x] = shadedPixel
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
            data[k+x] = (255 << 24) | (pixel[2] << 16) | (pixel[1] << 8) | pixel[0]
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

    mapCtx.restore()
    mapCtx.save()

    mapCtx.translate(mapCanvas.width/2, mapCanvas.height/2)
    mapCtx.rotate(-game.player.r/180*Math.PI)
    mapCtx.lineWidth = 3
    mapCtx.beginPath()
    mapCtx.moveTo(0, -10)
    mapCtx.lineTo(0, 10)
    mapCtx.stroke()
    mapCtx.beginPath()
    mapCtx.moveTo(0, 0)
    mapCtx.lineTo(10, 0)
    mapCtx.stroke()

    mapCtx.restore()
    mapCtx.save()
}

requestAnimationFrame(frame)

document.addEventListener('keydown', (event)=>{
    game.keys[event.key.toLowerCase()] = true
})
document.addEventListener('keyup', (event)=>{
    delete game.keys[event.key.toLowerCase()]
})

function getPixel(x, y, texture, out) {
    if(!out) out = [0, 0, 0, 0];
    if(!isFinite(x) || !isFinite(y) || !texture.data || texture.data.length == 0) {
        out[0]=255; out[1]=0; out[2]=255; out[3]=0;
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
    if(!out) out = [255, 0, 0, 255]
    let a1 = rgba1[3]/255
    let a2 = rgba2[3]/255

    let a = a1+a2*(1-a1)
    out[0] = ~~((rgba1[0]*a1+rgba2[0]*a2*(1-a1))/a)
    out[1] = ~~((rgba1[1]*a1+rgba2[1]*a2*(1-a1))/a)
    out[2] = ~~((rgba1[2]*a1+rgba2[2]*a2*(1-a1))/a)
    out[3] = ~~(a*255)

    return out
}

function getShadedPixel(rgba, dist, light){
    let shade_factor = Math.max(0, Math.min(1, 1 - dist / 5000))
    if(light) shade_factor = 1
    let r_shaded = (rgba[0] * shade_factor) | 0
    let g_shaded = (rgba[1] * shade_factor) | 0
    let b_shaded = (rgba[2] * shade_factor) | 0

    return (rgba[3] << 24) | (b_shaded << 16) | (g_shaded << 8) | r_shaded
}

let fps = 0
function fpsMeter() {
    let prevTime = Date.now()
    let frames = 0
    requestAnimationFrame(function loop() {
        const time = Date.now()
        frames++
        if (time > prevTime + 1000) {
            fps = ~~( ( frames * 1000 ) / ( time - prevTime ) )
            prevTime = time
            frames = 0
        }
        requestAnimationFrame(loop)
    })
}
fpsMeter()

function logs(){
    document.getElementById('logs').innerHTML = 
        fps
        + '<br/>' + JSON.stringify(game.player) 
        //+ '<br/>' + JSON.stringify(game.keys) 
        //+ '<br/>' + JSON.stringify(game.rays[game.cam.num_rays/2])
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

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    // Proyecta el punto sobre el segmento y mide la distancia
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (dx === 0 && dy === 0) {
        // El segmento es un punto
        dx = px - x1;
        dy = py - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    // t = proyección del punto sobre la línea en [0,1]
    let t = ((px - x1) * dx + (py - y1) * dy) / (dx*dx + dy*dy);
    t = Math.max(0, Math.min(1, t));
    let closestX = x1 + t * dx;
    let closestY = y1 + t * dy;
    dx = px - closestX;
    dy = py - closestY;
    return Math.sqrt(dx * dx + dy * dy);
}


function segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Determina si el segmento (x1,y1)-(x2,y2) cruza (x3,y3)-(x4,y4)
    function ccw(a, b, c) {
        return (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);
    }
    return (ccw([x1,y1], [x3,y3], [x4,y4]) !== ccw([x2,y2], [x3,y3], [x4,y4])) &&
           (ccw([x1,y1], [x2,y2], [x3,y3]) !== ccw([x1,y1], [x2,y2], [x4,y4]));
}


function slideAgainstWall(dx, dy, wallX1, wallY1, wallX2, wallY2) {
    // Calcula el vector paralelo a la pared
    let wx = wallX2 - wallX1;
    let wy = wallY2 - wallY1;
    let wallLen = Math.sqrt(wx*wx + wy*wy);
    wx /= wallLen; wy /= wallLen; // Vector unitario pared

    // Proyecta (dx,dy) sobre la pared (producto escalar)
    let dot = dx*wx + dy*wy;
    return { dx: dot*wx, dy: dot*wy };
}

function moveWithSliding(px, py, dx, dy, sectors, radius = 10) {
    let newX = px + dx;
    let newY = py + dy;

    for (let sector of sectors) {
        let points = sector.points;
        for (let i = 0, j = points.length-1; i < points.length; j=i++) {
            let [x1, y1] = points[j];
            let [x2, y2] = points[i];

            // Checa si hay colisión o cruce con el segmento
            if (((sector.z0 < game.player.z+game.player.h && sector.z1 > game.player.z+40) ) &&
                pointToSegmentDistance(newX, newY, x1, y1, x2, y2) < radius) {
                // Calcula vector deslizado
                let slide = slideAgainstWall(dx, dy, x1, y1, x2, y2);
                // Vuelve a intentar movimiento solo paralelo a la pared
                newX = px + slide.dx;
                newY = py + slide.dy;
                // Puedes repetir el proceso si quieres permitir rebotes o más de un deslizamiento
            }
        }
    }
    return [newX, newY];
}