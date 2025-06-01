multiplayer = true

function connect(){
    id = Math.random().toString(16).substr(2, 8)
    game.player.id = id
    pref = 'tracer/'+id
    client = mqtt.connect('wss://mqtt.nodenvy.com', {will: {topic: pref+'/sync', payload: JSON.stringify({action:'disconnect'})}})
    client.on('connect', function(){
        console.log('-- mqtt connected --')
        client.subscribe('tracer/#')
    })
    client.on("message", function(topic, data){
        onMQTT(topic, data)
    })
    sendMQTT({action:'connect', data:{id:id, stats:game.stats}})
}

if(multiplayer) connect()

function onMQTT(topic, data){
    msg_id = topic.split('/')[1]
    let jsonData = JSON.parse(data)
    if(msg_id != id){
        if(jsonData.action == 'connect'){
            let sector = game.level.find(e=>e.playerId == jsonData.data.id)
            if(!sector){
                game.level.push({
                    name:'player',
                    playerId: jsonData.data.id,
                    stats: jsonData.data.stats,
                    points : [
                        [0, -50, 'duke.png', 0, 0, 0, 2.7, 1.9, 0, 0],
                        [60, -50, 'duke.png', 0, 0, 0, 1, 1, 0, 0],
                    ],
                    z0 : 0, z1 : 170,
                    ceil: ['door.jpg', 0, 0, 0, 1, 1, 0, 0], 
                    floor: ['door.jpg', 0, 0, 0, 1, 1, 0, 0],
                    x:25, y:-50, z:0, r:0,
                    animate:'sprite',
                    hit:'enemyHit'
                },)
                sendMQTT({action:'connect', data:{id:id}})
            }
        }else if(jsonData.action == 'player'){
            let sector = game.level.find(e=>e.playerId == jsonData.data.id)
            sector.player = jsonData.data.player
            if(sector){
                traslateSectorToCoords(sector, jsonData.data.player.x, jsonData.data.player.y, jsonData.data.player.z)
                sector.z1 = jsonData.data.player.z+jsonData.data.player.h+jsonData.data.player.top
            }
        }else if(jsonData.action == 'stats'){
            let sector = game.level.find(e=>e.playerId == jsonData.data.id)
            sector.stats = jsonData.data.stats
        }else if(jsonData.action == 'action'){
            let sector = game.level.find(e=>e.id == jsonData.data.id)
            if(sector){
                window[sector.action](sector)
            }
        }else if(jsonData.action == 'hit'){
            let sector = game.level.find(e=>e.id == jsonData.data.id)
            if(sector && !sector.player){
                window[sector.hit](sector)
            }
        }
        else if(jsonData.action == 'log'){
            console.log(jsonData.data)
        }else if(jsonData.action == 'playerHit'){
            console.log(game.player.id , jsonData.data)
            if(game.player.id == jsonData.data.enemyId){
                playerHit(jsonData.data.id)
            }
        }else if(jsonData.action == 'playerDeath'){
            console.log(game.player.id , jsonData.data)
            if(game.player.id == jsonData.data.enemyId){
                game.stats.kills +=1
            }
        }
    }
}

let player_cache = ''
function sendMQTT(data){
    let json_data = JSON.stringify(data)
    if(multiplayer){
        if(data.action == 'player'){
            if(player_cache != json_data){
                //console.log('sent', sent++)
                client.publish(pref+'/sync', json_data)
                //console.log('player', player_cache, json_data)
                player_cache = json_data
            }
        }else{
            client.publish(pref+'/sync', json_data)
        }
    }
}

events.addEventListener('player', (e) => {
    sendMQTT({action:'player', data:{id:id, player:game.player}})
})

events.addEventListener('action', (e) => {
    sendMQTT({action:'action', data:{id:e.detail.sector.id}})
})

events.addEventListener('hit', (e) => {
    sendMQTT({action:'hit', data:{id:e.detail.sector.id}})
})

events.addEventListener('playerHit', (e) => {
    sendMQTT({action:'playerHit', data:{id:e.detail.id, enemyId:e.detail.enemyId}})
})
events.addEventListener('playerDeath', (e) => {
    sendMQTT({action:'playerDeath', data:{enemyId:e.detail.enemyId}})
})