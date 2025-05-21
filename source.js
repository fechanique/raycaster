game = { width: 640, height: 480, res:2 }
map = { width: 640, height: 480, zoom: 0.5 }
player = { x: 0, y: 0, z: 0, h: 170, r: -45, head: 0 }
keys = {}
cam = { fps: 30, fov: 31, plane_dist: 500, num_rays: game.width/game.res, visibility: 2000 }
rays = []
index = 0
for(let i = -cam.fov; i <= cam.fov; i=i+((cam.fov*2/(cam.num_rays)))){
    rays.push({i: index++, deg:+i.toFixed(2), coll: [], cos:+Math.cos((i)/180*Math.PI).toFixed(4), sin:+Math.sin((i)/180*Math.PI).toFixed(4)})
}

mapCanvas = document.createElement('canvas')
mapCanvas.id = 'map'
document.getElementById('content').appendChild(mapCanvas)
mapCtx = mapCanvas.getContext('2d')
mapCtx.canvas.width = map.width
mapCtx.canvas.height = map.height
mapCtx.translate((1-map.zoom)*mapCanvas.width/2, (1-map.zoom)*mapCanvas.height/2)
mapCtx.scale(map.zoom, map.zoom)

gameCanvas = document.createElement('canvas')
gameCanvas.id = 'game'
document.getElementById('content').appendChild(gameCanvas)
gameCtx = gameCanvas.getContext('2d')
gameCtx.canvas.width = map.width
gameCtx.canvas.height = map.height

imageData = gameCtx.createImageData(game.width, game.height)
const buf = new ArrayBuffer(imageData.data.length)
const buf8 = new Uint8ClampedArray(buf) // For setting imageData.data
const data = new Uint32Array(buf)       // For 32-bit pixel manipulation (RGBA)

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

    if(keys['shift']){
        vel = v0*2
    }else{
        vel = v0
    }
    if(keys['arrowup']){
        delta_x1 = delta_v*Math.cos(player.r/180*Math.PI)
        delta_y1 = -delta_v*Math.sin(player.r/180*Math.PI)
    }
    if(keys['arrowdown']){
        delta_x1 = -delta_v*Math.cos(player.r/180*Math.PI)
        delta_y1 = delta_v*Math.sin(player.r/180*Math.PI)
    }
    if(keys['arrowleft']){
        player.r += vel/2*elapsedTime
        player.r = Math.round(player.r%360)
    }
    if(keys['arrowright']){
        player.r -= vel/2*elapsedTime
        player.r = Math.round(player.r%360)
    }
    if(keys['a']){
        delta_x2 = -delta_v*Math.sin(player.r/180*Math.PI)
        delta_y2 = -delta_v*Math.cos(player.r/180*Math.PI)
    }
    if(keys['d']){
        delta_x2 = delta_v*Math.sin(player.r/180*Math.PI)
        delta_y2 = delta_v*Math.cos(player.r/180*Math.PI)
    }
    if(keys['w']){
        player.z += Math.round(vel*elapsedTime)
    }
    if(keys['s']){
        player.z -= Math.round(vel*elapsedTime)
    }
    if(keys['q']){
        player.head += Math.round(vel*elapsedTime)
    }
    if(keys['z']){
        player.head -= Math.round(vel*elapsedTime)
    }
    if(keys['r']){
        player.head = 0
        player.z = 0
    }
    player.x += Math.round(delta_x1) + Math.round(delta_x2)
    player.y += Math.round(delta_y1) + Math.round(delta_y2)
    
    drawMap()

    drawGame()

    imageData.data.set(buf8)
    gameCtx.putImageData(imageData, 0, 0)

    logs()
    requestAnimationFrame(frame)
}

function drawGame(){

    const skyColor = (255 << 24) | (135 << 16) | (206 << 8) | 235; // LightSkyBlue (ARGB: FF87CEEB -> RGBA in memory: EB, CE, 87, FF)
    const floorColor = (255 << 24) | (110 << 16) | (110 << 8) | 110; // Gray (ARGB: FF6E6E6E -> RGBA in memory: 6E, 6E, 6E, FF)
    const horizon = Math.round(game.height / 2 + player.head);

    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            const idx = y * game.width + x;
            data[idx] = (y < horizon) ? skyColor : floorColor;
        }
    }

    for(let sector of level){
        sector.inSector = pointInSector(player.x, player.y, sector)
    }

    for(let ray of rays){
        z_buffer = new Array(game.height).fill(cam.visibility+10)
        ray_cos = ray.cos
        ray_sin = ray.sin
        ray_rot_cos = Math.cos((ray.deg-player.r)*Math.PI/180)
        ray_rot_sin = Math.sin((ray.deg-player.r)*Math.PI/180)
        x0 = Math.round(ray.i*game.res)
        x1 = Math.round(Math.min(x0+game.res, game.width))

        rot_ray_cos = Math.cos((player.r-ray.deg)*Math.PI/180)
        rot_ray_sin = Math.sin((player.r-ray.deg)*Math.PI/180)
        ray.x0 = player.x
        ray.y0 = player.y
        ray.x1 = Math.round(player.x+cam.visibility*rot_ray_cos)
        ray.y1 = Math.round(player.y-cam.visibility*rot_ray_sin)

        let pixel = (255 << 24) | (255 << 16) | (0 << 8) | 255

        //CALCULATE COLLISIONS
        ray.coll = []
        for(let sectorIndex=0; sectorIndex<level.length ; sectorIndex++){
            let sector = level[sectorIndex]
            sector.id = sectorIndex
            for(let i=0 ; i<sector.points.length ; i++){
                let j = (i+1)%sector.points.length
                let sx1 = sector.points[i][0]
                let sy1 = sector.points[i][1]
                let sx2 = sector.points[j][0]
                let sy2 = sector.points[j][1]
                let temp_int = findIntersection(ray.x0, ray.y0, ray.x1, ray.y1, sx1, sy1, sx2, sy2)
                //Revisar que las esquinas a vecen devuelven 2 colisiones en el mismo punto
                if(temp_int){
                    let temp_dist = calcDistance(player.x, player.y, temp_int.intersectX, temp_int.intersectY)
                    let face_dist = calcDistance(sector.points[i][0], sector.points[i][1], temp_int.intersectX, temp_int.intersectY)
                    //real_dist = Math.sqrt(temp_dist**2 + (player.jump-sector.z0)**2)
                    ray.coll.push({id:i, dist: temp_dist, int: temp_int, texture: sector.points[i][2], point:sector.points[i], sector: sector, face:face_dist})
                }
            }
        }

        ray.coll.sort((a, b) => a.dist - b.dist)

        //CALCULATE FLOORS
        ray.planes = []
        for(let coll of ray.coll){
            if(coll.isNextColl) continue
            if(coll.sector.inSector && coll.dist>0){
                coll.isNextColl = true
                ray.planes.push({p0:0, p1:coll.dist, coll:coll})
            }else{
                let nextColl = ray.coll.find((e) => e.sector.id == coll.sector.id && e.id != coll.id && e.dist > coll.dist)
                if(nextColl){
                    nextColl.isNextColl = true
                    coll.nextColl = nextColl
                    ray.planes.push({p0:coll.dist, p1:nextColl.dist, coll:coll})
                }else if(pointInSector(ray.x1, ray.y1, coll.sector)){
                    ray.planes.push({p0:coll.dist, p1:cam.visibility, coll:coll})
                }
            }
        }

        //DRAW WALLS
        ray.coll.sort((a, b) => a.dist - b.dist)
        for(let coll of ray.coll.filter(e => !e.sector.alpha)){
            drawWall(coll, ray)
        }

        //DRAW FLOORS
        ray.planes.sort((a, b) => a.coll.sector.z1 - b.coll.sector.z1)
        plane_y = {}
        for(let plane of ray.planes){
            //if(player.z+player.h > plane.coll.sector.z1) 
            drawPlane(plane, plane.coll.sector.z1, ray.i, plane.coll.sector.alpha)
        }

        //DRAW CEILS
        ray.planes.sort((a, b) => b.coll.sector.z0 - a.coll.sector.z0)
        plane_y = {}
        for(let plane of ray.planes){
            //if(player.z+player.h < plane.coll.sector.z0) 
            drawPlane(plane, plane.coll.sector.z0, ray.i, plane.coll.sector.alpha)
        }

        //DRAW WALLS ALPHA
        ray.coll.sort((a, b) => b.dist - a.dist)
        for(let coll of ray.coll.filter(e => e.sector.alpha)){
            drawWall(coll, ray, true)
        }

        
    }
}

function drawWall(coll, ray, alpha){
    let top_px = ((coll.sector.z1-player.h-player.z)/(coll.dist*ray.cos))*cam.plane_dist
    let bot_px = ((coll.sector.z0-player.h-player.z)/((coll.dist)*ray.cos))*cam.plane_dist
    let y0 = Math.round(Math.max(((game.height/2)-(top_px)+player.head), 0))
    let y1 = Math.round(Math.min(((game.height/2)-(bot_px)+player.head), game.height))

    let image_y0 = ((game.height/2)-(top_px)+player.head+0)
    let image_x = Math.round(coll.face*1+0)
    let b = ((coll.sector.z0-coll.sector.z1)/(top_px-bot_px))*1

    for(let y=y0; y<y1; y++){
        if((y-y0)%game.res==0){
            imagePixel = getPixel(image_x, Math.round(((y-image_y0)*b)), images[coll.sector.texture])
            if(alpha){
                let pixel = data[y*game.width+x0]
                imagePixel[3] = 100
                imagePixel = mixRgbAlpha(imagePixel, [pixel & 0xFF, pixel >> 8 & 0xFF, pixel >> 16 & 0xFF, pixel >> 24 & 0xFF])
            }
            shadedPixel = getShadedPixel(imagePixel, coll.dist, alpha)
        }
        if(coll.dist < z_buffer[y] && imagePixel[3]!=0){
            for(let x=x0; x<x1; x++){
                data[y*game.width+x] = shadedPixel
                z_buffer[y] = coll.dist
            }
        }
    }
}

function generatePlaneY(coll, isTop, z){
    plane_y[coll.sector.id] = []
    let y0 = 0
    let y1 = game.height
    if(isTop) y0 = game.height/2+player.head
    else y1 = game.height/2+player.head
    //if(!printed && isTop) console.log( coll.sector.name , y0, y1 )
    for(y=y0; y<y1; y++){
        let plane_height = z-player.h
        let cons_1 = ((plane_height-player.z)*cam.plane_dist)
        let d = Math.abs(cons_1/(y-game.height/2-player.head))
        plane_y[coll.sector.id][y] = (d)
    }
}

function drawPlane(plane, plane_z, alpha){
    let isTop = true
    let shadedPixel = null
    let top_px = ((plane_z-player.h-player.z)/(plane.p1*ray_cos))*cam.plane_dist
    let bot_px = ((plane_z-player.h-player.z)/(plane.p0*ray_cos))*cam.plane_dist

    if(top_px<bot_px){
        [top_px, bot_px] = [bot_px, top_px]
        isTop = false
    }

    let y0 = Math.round(Math.max(((game.height/2)-(top_px)+player.head), 0))
    let y1 = Math.round(Math.min(((game.height/2)-(bot_px)+player.head), game.height))

    if(!plane_y[plane.coll.sector.id]) generatePlaneY(plane.coll, isTop, plane_z)
    
    for(let y=y0; y<y1; y++){
        if((y)%game.res==0 || !shadedPixel){
            d = plane_y[plane.coll.sector.id][y]/ray_cos
            let image_x = (player.x + ray_rot_cos*d)
            let image_y = (player.y + ray_rot_sin*d)
            let texture_x = Math.round((image_x - plane.coll.sector.points[0][0])*1)
            let texture_y = Math.round((image_y - plane.coll.sector.points[0][1])*1)

            imagePixel = getPixel(texture_x, texture_y, images[plane.coll.sector.ceil])
            if(alpha){
                let pixel = data[y*game.width+x0]
                imagePixel = mixRgbAlpha(imagePixel, [pixel & 0xFF, pixel >> 8 & 0xFF, pixel >> 16 & 0xFF, pixel >> 24 & 0xFF])
            }
            shadedPixel = getShadedPixel(imagePixel, plane.coll.dist, alpha)
        }
        if(d < z_buffer[y] && imagePixel[3]!=0){
            for(let x=x0; x<x1; x++){
                data[y*game.width+x] = shadedPixel
                z_buffer[y] = d
            }
        }
    }
}

function drawMap(){
    mapCtx.fillStyle = "lightgrey"
    mapCtx.fillRect((mapCanvas.width/2)-(mapCanvas.width/2)/map.zoom, (mapCanvas.height/2)-(mapCanvas.height/2)/map.zoom, mapCanvas.width/map.zoom, mapCanvas.height/map.zoom)
    mapCtx.restore()
    mapCtx.save()
    mapCtx.translate(-player.x+mapCanvas.width/2, -player.y+mapCanvas.height/2)

    for(let elem of level){
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
    mapCtx.rotate(-player.r/180*Math.PI)
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
    keys[event.key.toLowerCase()] = true
    //console.log('pressed:', event.key.toLowerCase())
})
document.addEventListener('keyup', (event)=>{
    delete keys[event.key.toLowerCase()]
    //console.log('released:', event.key.toLowerCase())
})

function findIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    // Asegurarse de que las líneas no son paralelas
    if (denominator == 0) return null

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

    // Si t y u están entre 0 y 1, las líneas se intersectan en este segmento
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const intersectX = Math.round((x1 + t * (x2 - x1))*100)/100
        const intersectY = Math.round((y1 + t * (y2 - y1))*100)/100
        return { intersectX, intersectY }
    }

    // Si t o u no están en el rango de 0 a 1, entonces no hay una intersección en los segmentos de línea dados
    return null
}

function calcDistance(x1, y1, x2, y2){
    let x = (x2-x1)
    let y = (y2-y1)
    return Math.round(Math.sqrt(x**2+y**2)*100)/100
}

function pointInSector(posx, posy, sector) {
    let inside = false;
    let vertices = sector.points
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        let [xi, yi] = vertices[i]
        let [xj, yj] = vertices[j]

        let inters = ((yi > posy) != (yj > posy)) && (posx < (xj - xi) * (posy - yi) / (yj - yi) + xi)
        
        if (inters) inside = !inside
    }

    return inside
}

function getPixel(x, y, texture) {
    //return [255, 255, 255, 255]
    if(!isFinite(x) || !isFinite(y) || typeof texture == 'undefined') return [255, 0, 0, 0]
    let x_mod = ((x % texture.width) + texture.width) % texture.width;
    let y_mod = ((y % texture.height) + texture.height) % texture.height;
    // Calcula el índice del píxel en el array de datos
    let index = y_mod * texture.width + x_mod;
    
    return texture.data[index] //r//g//b//a
}

function mixRgbAlpha(rgba1, rgba2){
    let a1 = rgba1[3]/255
    let a2 = rgba2[3]/255

    let a = a1+a2*(1-a1)
    let r = Math.round((rgba1[0]*a1+rgba2[0]*a2*(1-a1))/a)
    let g = Math.round((rgba1[1]*a1+rgba2[1]*a2*(1-a1))/a)
    let b = Math.round((rgba1[2]*a1+rgba2[2]*a2*(1-a1))/a)

    return [r, g, b, a*255]
}

function getShadedPixel(rgba, dist, alpha){
    let shade_factor = Math.max(0, Math.min(1, 1 - dist / cam.visibility))
    if(alpha) shade_factor = 1
    let r_shaded = (rgba[0] * shade_factor)
    let g_shaded = (rgba[1] * shade_factor)
    let b_shaded = (rgba[2] * shade_factor)

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
            fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) )
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
        + '<br/>' + JSON.stringify(player) 
        + '<br/>' + JSON.stringify(keys) 
        + '<br/>' + JSON.stringify(rays[cam.num_rays/2])
}