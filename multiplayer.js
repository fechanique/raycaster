multiplayer = true

function connect(){
    id = Math.random().toString(16).substr(2, 8)
    pref = 'tracer/'+id
    client = mqtt.connect('ws://mqtt.nodenvy.com', {will: {topic: pref+'/sync', payload: JSON.stringify({action:'disconnect'})}})
    client.on('connect', function(){
        console.log('-- mqtt connected --')
        client.subscribe('tracer/#')
    })
    client.on("message", function(topic, data){
        onMQTT(topic, data)
    })
    sendMQTT({action:'connect', data:{id:id}})
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
                    points : [
                        [0, -50, 'duke.png', 0, 0, 0, 2.7, 1.9, 0, 0],
                        [60, -50, 'duke.png', 0, 0, 0, 1, 1, 0, 0],
                    ],
                    z0 : 0, z1 : 170,
                    ceil: ['door.jpg', 0, 0, 0, 1, 1, 0, 0], 
                    floor: ['door.jpg', 0, 0, 0, 1, 1, 0, 0],
                    x:25, y:-50, z:0, r:0,
                    animate:'sprite'
                },)
                sendMQTT({action:'connect', data:{id:id}})
            }
        }else if(jsonData.action == 'player'){
            let sector = game.level.find(e=>e.playerId == jsonData.data.id)
            if(sector){
                traslateSectorToCoords(sector, jsonData.data.player.x, jsonData.data.player.y, jsonData.data.player.z)
            }
        }else if(jsonData.action == 'action'){
            let sector = game.level.find(e=>e.id == jsonData.data.id)
            if(sector){
                window[sector.action](sector)
            }
        }
        else if(jsonData.action == 'log'){
            console.log(jsonData.data)
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