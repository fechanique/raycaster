v0 = 0.3
vel = v0
waitTime = 500
actionTime = waitTime
upKey = 'arrowup'
downKey = 'arrowdown'
wKey = 'w'
sKey = 's'

const events = new EventTarget()

let angle2 = Math.PI/2
function start(){
    for(var sector of game.level){
        for(let i=0 ; i<sector.points.length ; i++){
            let j = (i+1)%sector.points.length
            angle = Math.atan2(sector.points[j][1]-sector.points[i][1], sector.points[j][0]-sector.points[i][0])
            sector.points[i].push(angle)
            let diff = Math.abs(angle - angle2) % (2 * Math.PI);
            if (diff > Math.PI) diff = 2 * Math.PI - diff;
            let factor = (Math.cos(diff) + 1) / 2; // entre 0 y 1
            sector.points[i].push(factor)
            sector.points[i][3] += (factor-1)*0.5
            sector.points[i][4] += (factor-1)*0.5
            sector.points[i][5] += (factor-1)*0.5
            sector.ceil[1] = 0.2; sector.ceil[2] = 0.2; sector.ceil[3] = 0.2;
            sector.floor[1] = 0.1; sector.floor[2] = 0.1; sector.floor[3] = 0.1;

        }
    }
}

let restoreSector = null
function loop(elapsedTime){
    log = ''
    actionTime += elapsedTime
    delta_v = vel*elapsedTime
    game.player.walk = false


    delta_x1 = 0
    delta_y1 = 0
    delta_x2 = 0
    delta_y2 = 0
    delta_z = 0
    delta_h = 0
    delta_w = 0

    isAction = false
    if(game.keys['shift']){
        vel = v0*2
    }else{
        vel = v0
    }
    if(game.keys[upKey]){
        delta_x1 = delta_v*Math.cos(game.player.r/180*Math.PI)
        delta_y1 = -delta_v*Math.sin(game.player.r/180*Math.PI)
        game.player.walk = true
    }
    if(game.keys[downKey]){
        delta_x1 = -delta_v*Math.cos(game.player.r/180*Math.PI)
        delta_y1 = delta_v*Math.sin(game.player.r/180*Math.PI)
        game.player.walk = true
    }
    if(game.keys['arrowleft']){
        game.player.r += vel/4*elapsedTime
        game.player.r = Math.floor(game.player.r%360)
        game.player.walk = true
    }
    if(game.keys['arrowright']){
        game.player.r -= vel/4*elapsedTime
        game.player.r = Math.ceil(game.player.r%360)
        game.player.walk = true
    }
    if(game.keys['a']){
        delta_x2 = -delta_v*Math.sin(game.player.r/180*Math.PI)
        delta_y2 = -delta_v*Math.cos(game.player.r/180*Math.PI)
        game.player.walk = true
    }
    if(game.keys['d']){
        delta_x2 = delta_v*Math.sin(game.player.r/180*Math.PI)
        delta_y2 = delta_v*Math.cos(game.player.r/180*Math.PI)
        game.player.walk = true
    }
    if(game.keys['q']){
        delta_z = (vel*elapsedTime)
        game.player.flying = true
    }
    if(game.keys['z']){
        delta_z = -(vel*elapsedTime)
        game.player.flying = true
    }
    if(game.keys[wKey]){
        game.player.head += Math.round(vel*elapsedTime)
    }
    if(game.keys[sKey]){
        game.player.head -= Math.round(vel*elapsedTime)
    }
    if(game.keys['r']){
        game.player.head = 0
        game.player.z = game.player.floor
        game.player.flying = false
        game.player.toJump = false
    }
    if(game.keys['x'] && !game.player.toJump){
        game.player.toJump = true
        game.player.jumpTime = 0
        game.player.z0 = game.player.z
        game.player.f = 400
    }
    if(game.keys['c']){
        delta_h -= (vel*2*elapsedTime)
        game.player.couch = true
    }else{
        delta_h += (vel*2*elapsedTime)
        game.player.couch = false
    }
    if(game.keys['e']){
        isAction = true
        if(actionTime > waitTime){
            actionTime = 0
            let lastTouch = game.level.find(e => e.inTouch)
            if(lastTouch) lastTouch.inTouch = false
            let nextTouch = game.level.find(e=>e.inFrontFirst)
            if(nextTouch){
                nextTouch.inTouch = true
                if(typeof window[nextTouch.action] == 'function'){
                    window[nextTouch.action](nextTouch)
                    events.dispatchEvent(new CustomEvent('action', { detail:{sector:nextTouch} } ))
                }
            }
        }
    }
    if(game.keys['+']){
        isAction = true
        if(actionTime > waitTime){
            actionTime = 0
            if(sectorInFront) sectorInFront.z1 += 10
        }
    }
    if(game.keys['-']){
        isAction = true
        if(actionTime > waitTime){
            actionTime = 0
            if(sectorInFront) sectorInFront.z1 -= 10
        }
    }
    if(game.keys[' ']){
        isAction = true
        if(actionTime > waitTime){
            actionTime = 0
            if(game.stats.bullets>0){
                game.stats.bullets--
                game.uiImages[0].despX = 580
                let nextTouch = game.level.find(e=>e.inFrontFirst)
                if(nextTouch){
                    nextTouch.inTouch = true
                    if(typeof window[nextTouch.hit] == 'function'){
                        window[nextTouch.hit](nextTouch)
                        events.dispatchEvent(new CustomEvent('hit', { detail:{sector:nextTouch} } ))
                    }
                }
                events.dispatchEvent(new CustomEvent('space', { }))
            }else{
                events.dispatchEvent(new CustomEvent('sound', { detail:{sound:'sounds/take.mp3' } }))
                game.uiImages[0].despX = 0
                game.uiImages[0].despY = 240
            }
            setTimeout(()=>{
                game.uiImages[0].despX = 0
                game.uiImages[0].despY = 0
            }, 50)
        }
    }

    if(!isAction) actionTime = waitTime
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
        if(game.player.z+game.player.h+game.player.top >= game.player.ceil){
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
        delta_z = vel*elapsedTime
    }

    if(game.player.h+delta_h > game.player.maxH){
        delta_h = 0
        game.player.h = game.player.maxH
    }else if(game.player.h+delta_h < 70){
        delta_h = 0
        game.player.h = 70
    }

    if(game.player.z+delta_z+game.player.h+delta_h+game.player.top >= game.player.ceil){
        console.log('ceil hit')
        if(delta_z > 0) delta_z = 0
        if(delta_h > 0) delta_h = 0
    }
        game.player.z += Math.round(delta_z)
        game.player.h += Math.round(delta_h)
    
    if(game.player.z <= game.player.floor) game.player.z = game.player.floor

    let new_x = (delta_x1) + (delta_x2)
    let new_y = (delta_y1) + (delta_y2)










    game.player.pitch = Math.atan(game.player.head / game.cam.plane_dist)
    let playerDirection = {
        dx: Math.cos(game.player.r*Math.PI/180) * Math.cos(game.player.pitch),
        dy: -Math.sin(game.player.r*Math.PI/180) * Math.cos(game.player.pitch),
        dz: Math.sin(game.player.pitch)
    }
    //log += JSON.stringify(playerDirection)

    let tMin = game.cam.visibility
    let sectorInFrontId = null
    let collisions = []
    for(let sector of game.level){
        if(typeof window[sector.animate] == 'function'){
            window[sector.animate](sector, elapsedTime)
        }
        sector.inSector = pointInSector(game.player.x, game.player.y, sector.points)
        sector.inFloor = false
        let floorIntersect = intersectRayPlane(game.player, playerDirection, sector.z1)
        if(floorIntersect){
            if(pointInSector(floorIntersect.x, floorIntersect.y, sector.points)){
                //log += '<br/>'+sector.id+':'+JSON.stringify(floorIntersect)+'<br/>'
                if(floorIntersect.t < tMin){
                    sectorInFrontId = sector.id
                    sector.sectorInFrontDist = floorIntersect.t
                    tMin = floorIntersect.t
                }
            }
        }
        let ceilIntersect = intersectRayPlane(game.player, playerDirection, sector.z0)
        if(ceilIntersect){
            if(pointInSector(ceilIntersect.x, ceilIntersect.y, sector.points)){
                //log += '<br/>'+sector.id+':'+JSON.stringify(ceilIntersect)+'<br/>'
                if(ceilIntersect.t < tMin){
                    sectorInFrontId = sector.id
                    sector.sectorInFrontDist = ceilIntersect.t
                    tMin = ceilIntersect.t
                }
            }
        }
        for(let i=0 ; i<sector.points.length ; i++){
            let j = (i+1)%sector.points.length
            let wall = [[sector.points[i][0], sector.points[i][1]], [sector.points[j][0], sector.points[j][1]]]
            let wallIntersect = intersectRayWall(game.player, playerDirection, wall, sector.z0, sector.z1);
            //log += '<br/>'+wall+'s:'+sector.id+'p:'+i+':'+JSON.stringify(wallIntersect)+'<br/>'
            if (wallIntersect) {
                //log += '<br/>'+sector.id+':'+JSON.stringify(wallIntersect)+'<br/>'
                if(wallIntersect.t < tMin){
                    sectorInFrontId = sector.id
                    sector.sectorInFrontDist = wallIntersect.t
                    sector.sectorInFrontSegment = i
                    tMin = wallIntersect.t
                }
            }

            let segmentDist = distancePointToSegment(game.player.x+new_x, game.player.y+new_y, sector.points[i][0], sector.points[i][1], sector.points[j][0], sector.points[j][1])
            if(segmentDist.dist <= game.player.rad && isWallInFront(game.player, wall[0], wall[1]) &&(
                game.player.z < sector.z1-game.player.bot && game.player.z+game.player.h+game.player.top > sector.z0)
                )
            {
                let normal = normalSegment(sector.points[i][0], sector.points[i][1], sector.points[j][0], sector.points[j][1])
                collisions.push({'sector':sector.id, point:i, normal, segmentDist: segmentDist})
            }
        }
    }
    lastSectorInFront = game.level.find(e=>e.inFrontFirst)
    if(lastSectorInFront){
        lastSectorInFront.inFrontFirst = false
        //for(let i=0 ; i<lastSectorInFront.points.length ; i++){
        //    lastSectorInFront.points[i][3] = restoreSector.points[i][3]
        //    lastSectorInFront.points[i][4] = restoreSector.points[i][4]
        //    lastSectorInFront.points[i][5] = restoreSector.points[i][5]
        //}
        //lastSectorInFront.ceil[1] = restoreSector.ceil[1] ; lastSectorInFront.ceil[2] = restoreSector.ceil[2] ; lastSectorInFront.ceil[3] = restoreSector.ceil[3]
        //lastSectorInFront.floor[1] = restoreSector.floor[1] ; lastSectorInFront.floor[2] = restoreSector.floor[2] ; lastSectorInFront.floor[3] = restoreSector.floor[3]
    }
    sectorInFront = game.level.find(e=>e.id == sectorInFrontId)
    if(sectorInFront){
        log += 'inFrontFirst: '+sectorInFront.id+' name: '+sectorInFront.name+' dist: '+~~(sectorInFront.sectorInFrontDist)+' side: '+sectorInFront.sectorInFrontSegment + '<br/>'
        sectorInFront.inFrontFirst = true
        //restoreSector = JSON.parse(JSON.stringify(sectorInFront))
        //for(let point of sectorInFront.points){
        //   point[3] = 0.2
        //    point[4] = 0.2
        //    point[5] = -0.2
        //}
        //sectorInFront.ceil[1] += 0.5 ; sectorInFront.ceil[2] -= 0.5 ; sectorInFront.ceil[3] -= 0.5
        //sectorInFront.floor[1] += 0.5 ; sectorInFront.floor[2] -= 0.5 ; sectorInFront.floor[3] -= 0.5
    }

    let sectorFloor = game.level.filter(e=>e.inSector && e.z1 <= game.player.z).sort((a, b) => b.z1 - a.z1) [0]
    if(sectorFloor){
        game.player.floor = sectorFloor.z1
        if(sectorFloor.z1 === game.player.z) sectorFloor.inFloor = true
    }
    game.player.nextFloor = game.level.filter(e=>e.inSector && e.z1 > game.player.z).sort((a, b) => a.z1 - b.z1) [0]?.z1
    game.player.ceil = game.level.filter(e=>e.inSector && e.z0 >= game.player.z+game.player.h).sort((a, b) => a.z0 - b.z0) [0]?.z0
    game.player.falling = game.player.z > game.player.floor
    game.player.toUp = game.player.nextFloor-game.player.z <= game.player.bot


    //COLLISION NORMALS
    let collision = collisions.sort((a, b) => a.segmentDist.dist - b.segmentDist.dist)[0]
    if(collision){
        let sector = game.level[collision.sector]
        if(sector && typeof window[sector.touch] == 'function'){
            window[sector.touch](sector)
            events.dispatchEvent(new CustomEvent('touch', { detail:{sector:sector} } ))
        }
    }

    if(collisions.length > 1 && (!collisions[0].segmentDist.border && !collisions[1].segmentDist.border)
        && (collisions[0].normal[0] != collisions[1].normal[0] || collisions[0].normal[1] != collisions[1].normal[1])
    ){
        //if(collision.segmentDist.proj_y + collision.normal[1]*game.player.rad == game.player.y){
        //    game.player.x = collisions[1].segmentDist.proj_x + collisions[1].normal[0]*game.player.rad
        //}else if(collision.segmentDist.proj_x + collision.normal[0]*game.player.rad == game.player.x){
        //    game.player.y = collisions[1].segmentDist.proj_y + collisions[1].normal[1]*game.player.rad
        //}

        //game.player.x = collisions[1].segmentDist.proj_x + collisions[1].normal[0]*50
        //game.player.y = collisions[1].segmentDist.proj_y + collisions[1].normal[1]*50
    }
    else if(collision){
        //for (let collision of collisions) {
            let tx = -collision.normal[1]
            let ty = collision.normal[0]
            let dot = new_x * tx + new_y * ty
            collision.vect = [tx * dot, ty * dot]

            if(collision.segmentDist.border){
                game.player.x += new_x
                game.player.y += new_y
                // 2. Corrige para mantener la distancia exacta al punto
                let dx = game.player.x - collision.segmentDist.proj_x;
                let dy = game.player.y - collision.segmentDist.proj_y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                let r = 40
                // Proyecta al radio exacto
                game.player.x = (collision.segmentDist.proj_x + dx / dist * r) 
                game.player.y = (collision.segmentDist.proj_y + dy / dist * r) 
            }else{
                game.player.x = (collision.segmentDist.proj_x + collision.normal[0]*game.player.rad)
                game.player.y = (collision.segmentDist.proj_y + collision.normal[1]*game.player.rad)
            }

        //}
        
    }else{
        game.player.x += new_x;
        game.player.y += new_y;
    }
    game.player.x = Math.round(game.player.x)
    game.player.y = Math.round(game.player.y)

    if(game.opt.save) localStorage.setItem("player", JSON.stringify(game.player))
    events.dispatchEvent(new CustomEvent('player', {} ))

    let ran = Math.random()
    if(ran < 0.001){
        if(game.level.filter(e=>e.name=='heart').length < 3) spawnHeart()
        if(game.level.filter(e=>e.name=='bullets').length < 3) spawnBullets()
    }
    

    log += JSON.stringify(game.player)+'<br/>'
    log += 'pNormal: '+JSON.stringify(playerDirection)+'<br/>'
    log += JSON.stringify(game.keys)+'<br/>'
    log += 'collision: '+JSON.stringify(collision)+'<br/>'
    log += 'collisions: '+JSON.stringify(collisions)+'<br/>'

}

document.addEventListener('keydown', (event)=>{
    game.keys[event.key.toLowerCase()] = true
})
document.addEventListener('keyup', (event)=>{
    delete game.keys[event.key.toLowerCase()]
})

function setMouse(){
    wKey = 'arrowup'
    sKey = 'arrowdown'
    upKey = 'w'
    downKey = 's'
    document.getElementById('gameCanvas').addEventListener('click', function() {
        document.getElementById('gameCanvas').requestPointerLock();
    });
    document.addEventListener('mousemove', function(e) {
        // e.movementX y e.movementY son los desplazamientos desde el último evento
        game.player.r -= e.movementX * 0.2;   // Gira izquierda/derecha (yaw)
        game.player.head -= e.movementY; // Sube/baja la cabeza (pitch)
    });
}

function drawHUD(){
    if(game.player.crossHair){
        let dist = game.cam.visibility
        let sectorInFrontFirst = game.level.find(e=>e.inFrontFirst)
        if(sectorInFrontFirst) dist = sectorInFrontFirst.sectorInFrontDist
        gameCtx.strokeStyle = "white"
        gameCtx.lineWidth = 1
        gameCtx.beginPath()
        gameCtx.moveTo(game.opt.width/2-10, game.opt.height/2)
        gameCtx.lineTo(game.opt.width/2+10, game.opt.height/2)
        gameCtx.moveTo(game.opt.width/2, game.opt.height/2-10)
        gameCtx.lineTo(game.opt.width/2, game.opt.height/2+10)
        gameCtx.stroke()

    }

    gameCtx.font = '24px Arial';         // Tamaño y fuente
    gameCtx.fillStyle = 'white';        // Color del texto
    gameCtx.textAlign = 'left';        // Alineación horizontal ('left', 'right', 'center')
    gameCtx.textBaseline = 'middle';     // Alineación vertical ('top', 'middle', 'bottom', etc.)

    // Dibuja el texto en (x, y)
    gameCtx.fillText('fps: '+fps, 10, 24);
    let index = 0
    for(var stat in game.stats){
        gameCtx.fillText(stat+': '+game.stats[stat], 10, 48+(index++*24))
    }
}

function intersectRayPlane(rayOrigin, rayDir, zPlane) {
    let x = rayOrigin.x, y = rayOrigin.y, z = rayOrigin.z+rayOrigin.h;
    let {dx, dy, dz} = rayDir;

    if (Math.abs(dz) < 1e-8) return null; // paralelo

    let t = (zPlane - z) / dz;
    if (t < 0) return null;

    return {
        t: t,
        x: x + t * dx,
        y: y + t * dy
    };
}

function intersectRayWall(rayOrigin, rayDir, wall, z0, z1) {
    let x = rayOrigin.x, y = rayOrigin.y, z = rayOrigin.z + (rayOrigin.h || 0);
    let {dx, dy, dz} = rayDir;
    let [x1, y1] = wall[0];
    let [x2, y2] = wall[1];

    // Segmento de la pared
    let sx = x2 - x1;
    let sy = y2 - y1;

    // Ecuaciones paramétricas
    // Ray: (x, y) + t * (dx, dy)
    // Segment: (x1, y1) + u * (sx, sy)
    let denom = dx * sy - dy * sx;
    if (Math.abs(denom) < 1e-8) return null; // paralelo

    let t = ((x1 - x) * sy - (y1 - y) * sx) / denom;
    let u = ((x1 - x) * dy - (y1 - y) * dx) / denom;
    if (t < 0 || u < 0 || u > 1) return null;

    let z_inter = z + t * dz;
    if (z_inter < z0 || z_inter > z1) return null;

    return { t, u, z: z_inter };
}

function distancePointToSegment(px, py, x1, y1, x2, y2) {
    // Vector del segmento
    let vx = x2 - x1;
    let vy = y2 - y1;
    // Vector desde x1,y1 al punto
    let wx = px - x1;
    let wy = py - y1;

    // Proyección escalar del punto sobre el segmento
    let c1 = vx*wx + vy*wy;
    let c2 = vx*vx + vy*vy;
    let t = 0;
    if (c2 > 0) t = c1 / c2;

    // Recortar t para que esté entre 0 y 1 (dentro del segmento)
    t = Math.max(0, Math.min(1, t));

    // Coordenadas del punto proyectado sobre el segmento
    let proj_x = (x1 + t * vx);
    let proj_y = (y1 + t * vy);

    // Distancia desde el punto al segmento
    let dist = Math.hypot(px - proj_x, py - proj_y)

    // También puedes retornar la proyección si la necesitas
    let border = (proj_x === x1 && proj_y === y1) || (proj_x === x2 && proj_y === y2);
    return { dist, proj_x, proj_y, t, border };
}
function normalSegment(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    // Normal "a la derecha" del segmento (sentido horario)
    let nx = dy;
    let ny = -dx;
    let len = Math.hypot(nx, ny);
    if (len === 0) return [0, 0]; // Segmento nulo
    return [nx / len, ny / len];
}
function isWallInFront(player, wallA, wallB) {
    let dx = wallB[0] - wallA[0];
    let dy = wallB[1] - wallA[1];
    // Normal hacia fuera (horario, Y abajo)
    let nx = dy;
    let ny = -dx;
    let len = Math.hypot(nx, ny);
    nx /= len;
    ny /= len;
    // Vector del muro al jugador
    let vx = player.x - wallA[0];
    let vy = player.y - wallA[1];
    // Producto escalar
    let dot = vx*nx + vy*ny;
    return dot > 0; // true = el jugador está delante del muro (lado de la normal)
}