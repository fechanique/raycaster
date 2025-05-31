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
    }else if(sector.isOpen){
        rotateSectorToAngle(sector, -100)
        sector.animate = null
    }else if(!sector.isOpen && sector.r < 0){
        rotateSector(sector, +0.5*elapsedTime)
    }else if(!sector.isOpen){
        rotateSectorToAngle(sector, 0)
        sector.animate = null
        events.dispatchEvent(new CustomEvent('sound', { detail:{sound:'sounds/door-close.mp3', sector:sector} }))
    }
}

maxElevation = 600
minElevation = 0
function activateElevator(sector){
    sector = game.level.find(e=>e.name=='elevator')
    if(sector.state==2){
        sector.state = 1
    }else if(sector.state==1){
        sector.state = 2
    }
    events.dispatchEvent(new CustomEvent('start-loop', { detail:{sound:'sounds/machine2.mp3', sector:sector} }))
}

function animateElevator(sector, elapsedTime){
    let factor = 0.5*elapsedTime
    if(sector.state == 1 && sector.z < maxElevation){
        traslateSector(sector, sector.x, sector.y, factor)
        if(sector.inSector && game.player.z < sector.z1  && game.player.z > sector.z0) game.player.z = sector.z1
    }else if(sector.state == 1){
        traslateSectorToCoords(sector, sector.x, sector.y, maxElevation)
        events.dispatchEvent(new CustomEvent('stop-loop', { detail:{sector:sector} }))
    }else if(sector.state == 2 && sector.z > minElevation){
        traslateSector(sector, sector.x, sector.y, -factor)
        if(sector.inFloor && !game.player.toJump) game.player.z = sector.z1
    }else if(sector.state == 2){
        traslateSectorToCoords(sector, sector.x, sector.y, minElevation)
        events.dispatchEvent(new CustomEvent('stop-loop', { detail:{sector:sector} }))
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