function door(sector){
    if(!sector.isOpen){
        events.dispatchEvent(new CustomEvent('sound', { detail:{sound:'sounds/unlock.mp3', sector:sector} }))
    }
    sector.isOpen = !sector.isOpen
    sector.animate = 'animateDoor'
}

function animateDoor(sector, elapsedTime){
    if(sector.isOpen && sector.r > -100){
        rotateSector(sector, -0.5*elapsedTime)
    }else if(!sector.isOpen && sector.r < 0){
        rotateSector(sector, +0.5*elapsedTime)
    }

    if(sector.isOpen && sector.r < -100){
        rotateSectorToAngle(sector, -100)
        sector.animate = null
    }else if(!sector.isOpen && sector.r > 0){
        rotateSectorToAngle(sector, 0)
        sector.animate = null
        events.dispatchEvent(new CustomEvent('sound', { detail:{sound:'sounds/door-close.mp3', sector:sector} }))
    }
}

maxElevation = 700
minElevation = 0
function activateElevator(sector){
    sector = game.level.find(e=>e.name=='elevator')
    if(sector.state==2){
        sector.state = 1
    }else if(sector.state==1){
        sector.state = 2
    }
    sector.animate = 'animateElevator'
    events.dispatchEvent(new CustomEvent('start-loop', { detail:{sound:'sounds/machine2.mp3', sector:sector} }))
}

function animateElevator(sector, elapsedTime){
    let factor = 0.5*elapsedTime
    if(sector.state == 1 && sector.z < maxElevation){
        traslateSector(sector, sector.x, sector.y, factor)
        if(sector.inSector && game.player.z < sector.z1  && game.player.z > sector.z0) game.player.z = sector.z1
    }else if(sector.state == 2 && sector.z > minElevation){
        traslateSector(sector, sector.x, sector.y, -factor)
        if(sector.inFloor && !game.player.toJump) game.player.z = sector.z1
    }

    if(sector.state == 1 && sector.z >= maxElevation){
        traslateSectorToCoords(sector, sector.x, sector.y, maxElevation)
        if(sector.inFloor && !game.player.toJump) game.player.z = sector.z1
        events.dispatchEvent(new CustomEvent('stop-loop', { detail:{sector:sector} }))
        sector.animate = null
    }else if(sector.state == 2 && sector.z <= minElevation){
        traslateSectorToCoords(sector, sector.x, sector.y, minElevation)
        if(sector.inFloor && !game.player.toJump) game.player.z = sector.z1
        events.dispatchEvent(new CustomEvent('stop-loop', { detail:{sector:sector} }))
        sector.animate = null
    }

}

function glassHit(sector){
    sector.z1 = sector.z0
    events.dispatchEvent(new CustomEvent('glass', { detail:{sector} }))
}

let animation_time = 0
function animate(sector, elapsedTime){
    animation_time += elapsedTime
    if(animation_time > 80){
        if(sector.candle) sector.points[0][8] += 32
        animation_time = 0
    }
    rotateSectorToAngle(sector, -game.player.r+90)
}

function sprite(sector, elapsedTime){
    rotateSectorToAngle(sector, -game.player.r+90)
}

function rotateCube(sector, elapsedTime){
    rotateSector(sector, 0.1*elapsedTime)
}

function candle(sector){
    if(sector.candle)sector.candle = false
    else sector.candle = true
}

function water(sector, elapsedTime){
    sector.floor[6] += 0.01*elapsedTime
    sector.floor[7] += 0.001*elapsedTime
    sector.r -= 0.001*elapsedTime
}

function light(sector){
    if(sector.light){
        sector.light = false
        sector.points[0][3] = -0.5
        sector.points[0][4] = -0.5
        sector.points[0][5] = -0.5
    }else{
        sector.light = true
        sector.points[0][3] = 1
        sector.points[0][4] = 1
        sector.points[0][5] = 1
    }
}

function heart(sector){
    game.stats.lives +=1
    events.dispatchEvent(new CustomEvent('sound', { detail:{sound:'sounds/use.mp3', sector:sector} }))
    //delete sector from game.level
    let index = game.level.indexOf(sector)
    game.level.splice(index, 1)
}
function spawnHeart(){
    spawnObj(objHeart)
}

function bullets(sector){
    game.stats.bullets +=10
    events.dispatchEvent(new CustomEvent('sound', { detail:{sound:'sounds/use.mp3', sector:sector} }))
    //delete sector from game.level
    let index = game.level.indexOf(sector)
    game.level.splice(index, 1)
}
function spawnBullets(){
    spawnObj(objBullets)
}

const leveLength = 11
function getSpawnCoords(){
    let randomSector = game.level[Math.floor(Math.random()*leveLength)]
    console.log(randomSector.id)
    let x = Math.floor(Math.random() * (2000 - (-2000) + 1)) + (-2000);
    let y = Math.floor(Math.random() * (2000 - (-2000) + 1)) + (-2000);
    let insector = pointInSector(x, y, randomSector.points)
    while(!insector){
        x = Math.floor(Math.random() * (2000 - (-2000) + 1)) + (-2000);
        y =Math.floor(Math.random() * (2000 - (-2000) + 1)) + (-2000);
        insector = pointInSector(x, y, randomSector.points)
    }

    return [x, y, randomSector.z1]
}

function spawnObj(obj){
    let newObj = JSON.parse(JSON.stringify(obj))
    let coords = getSpawnCoords()
    
    traslateSectorToCoords(newObj, coords[0], coords[1], coords[2])

    level.push(newObj)
}

function enemyHit(sector){
    events.dispatchEvent(new CustomEvent('playerHit', { detail:{id:game.player.id, enemyId:sector.playerId} }))
}

function playerHit(enemyId){
    game.stats.lives -=1
    if(game.stats.lives <= 0){
        game.stats.deaths +=1
        game.stats.lives = 3
        let coords = getSpawnCoords()
        game.player.x = coords[0]
        game.player.y = coords[1]
        game.player.z = coords[2]+50
        game.player.r = Math.floor(Math.random() * 360);
        events.dispatchEvent(new CustomEvent('playerDeath', { detail:{id:game.player.id, enemyId:enemyId} }))
    }
    game.cam.globalLight = [1, 0.5, 0.5]
    setTimeout(() => {
        game.cam.globalLight = [1, 1, 1]
    }, 100);
}

////

function rotateSectorToAngle(sector, angle){
    rotateSector(sector, angle-sector.r)
}

function rotateSector(sector, angle){
    let originX = sector.x 
    let originY = sector.y
    angle = ~~angle
    for(var point of sector.points){
        let px = point[0]
        let py = point[1]
        point[0] = ((px - originX)*Math.cos(angle*Math.PI/180) - (py - originY)*Math.sin(angle*Math.PI/180) + originX)
        point[1] = ((px - originX)*Math.sin(angle*Math.PI/180) + (py - originY)*Math.cos(angle*Math.PI/180) + originY)
    }
    sector.r += angle
    sector.r %= 360
}

function traslateSectorToCoords(sector, x, y, z){
    traslateSector(sector, x-sector.x, y-sector.y, z-sector.z)
}

function traslateSector(sector, x, y, z){
    for(var point of sector.points){
        point[0] += Math.round(x)
        point[1] += Math.round(y)
    }
    sector.z0 += Math.round(z)
    sector.z1 += Math.round(z)
    sector.x += Math.round(x)
    sector.y += Math.round(y)
    sector.z += Math.round(z)
}