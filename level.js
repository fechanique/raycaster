level = [
    {
        name:'terain',
        points : [
            [-2000, -2000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [2000, -2000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [2000, 2000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [-2000, 2000, 'brick.png', 0, 0, 0, 1, 1, 0, 0]
        ],
        z0 : -20, z1 : 0,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['grass.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:370,
    },
    {
        name:'fachada1',
        points : [
            [0, 0, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 0, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [980, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [980, 20, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [20, 20, 'brick.png', 1, 1, 1, 1, 1, 0, 0],
            [20, 980, 'brick.png', 1, 1, 1, 1, 1, 0, 0],
            [500, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [500, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [0, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 700,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        name:'fachada2',
        points : [
            [980, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [600, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [600, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [980, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 700,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //PORCHE
    {
        points : [
            [300, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [800, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [800, 1300, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [300, 1300, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 20,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [300, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [800, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [800, 1200, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [300, 1200, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 280, z1 : 300,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //COLUMNAS PORCHE
    {
        points : [
            [400, 1100, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [425, 1100, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [450, 1125, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [450, 1150, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [425, 1175, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [400, 1175, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [375, 1150, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [375, 1125, 'brick.png', 0, 0, 0, 1, 1, 0, 0]
        ],
        z0 : 20, z1 : 280,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [675, 1100, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [700, 1100, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [725, 1125, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [725, 1150, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [700, 1175, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [675, 1175, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [650, 1150, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [650, 1125, 'brick.png', 0, 0, 0, 1, 1, 0, 0]
        ],
        z0 : 20, z1 : 280,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //SUELOS
    {
        points : [
            [0, 0, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 0, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [0, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 20,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [-10, 200, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [1010, 200, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [1010, 1010, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [-1, 1010, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 300, z1 : 320,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [-10, -10, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [1010, -10, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [1010, 1010, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [-10, 1010, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 600, z1 : 620,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //WINDOW
    {
        points : [
            [980, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1020, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1020, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [980, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 100,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [980, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1020, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1020, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [980, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 250, z1 : 400,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [980, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1020, 400, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1020, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [980, 600, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 550, z1 : 700,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //GLASS
    {
        points : [
            [990, 400, 'glass.jpg', 0, 0, 0, 1, 1, 0, 0],
            [990, 600, 'glass.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 100, z1 : 250,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0,
        alpha:true, alphaValue:100,
        hit:'glassHit'
    },
    {
        points : [
            [990, 400, 'glass.jpg', 0, 0, 0, 1, 1, 0, 0],
            [990, 600, 'glass.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 400, z1 : 550,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0,
        alpha:true, alphaValue:100,
        hit:'glassHit'
    },
    //DOOR
    {
        name:'door',
        points : [
            [500, 1000, 'door.jpg', 0, 0, 0, 2.9, 3.4, 0, 0],
            [600, 1000, 'door.jpg', 0, 0, 0, 1, 1, 0, 0],
            [600, 1005, 'door.jpg', 0, 0, 0, 2.9, 3.4, 0, 0],
            [500, 1005, 'door.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 20, z1 : 250,
        ceil: ['door.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['door.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:600, y:1000, r:0,
        action:'door', isOpen:false
    },
    {
        points : [
            [500, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [600, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [600, 1000, 'brick.png', 0, 0, 0, 1, 1, 135, -57],
            [500, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 250, z1 : 300,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [500, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [600, 980, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [600, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [500, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 550, z1 : 700,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //STAIRS
    {
        points : [
            [540, 20, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [980, 20, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [980, 200, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [540, 200, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 300, z1 : 320,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    //TABLE
    {
        name:'table',
        points : [
            [100, 700, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, 700, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, 900, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [100, 900, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 110, z1 : 120,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:150, y:150, r:0
    },
    {
        name:'table-leg',
        points : [
            [100, 700, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [105, 700, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [105, 705, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [100, 705, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 20, z1 : 120,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:150, y:150, r:0
    },
    {
        name:'table-leg',
        points : [
            [195, 700, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, 700, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, 705, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [195, 705, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 20, z1 : 120,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:150, y:150, r:0
    },
    {
        name:'table-leg',
        points : [
            [195, 895, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, 895, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, 900, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [195, 900, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 20, z1 : 120,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:150, y:150, r:0
    },
    {
        name:'table-leg',
        points : [
            [100, 895, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [105, 895, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [105, 900, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [100, 900, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 20, z1 : 120,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:150, y:150, r:0
    },
    //CANDLE
    {
        name:'candle',
        points : [
            [134, 850, 'candle.png', 1, 1, 1, 1, 1, 0, 0],
            [166, 850, 'candle.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 120, z1 : 152,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        animate: 'animate',
        action: 'candle', candle:true,
        x:150, y:850, r:0
    },
    //ELEVATOR
    {
        name:'elevatorRail',
        points : [
            [180, -220, 'elevatorRail.png', 0, 0, 0, 1, 1, 0, 0],
            [200, -220, 'elevatorRail.png', 0, 0, 0, 1, 1, 0, 0],
            [200, -20, 'elevatorRail.png', 0, 0, 0, 1, 1, 0, 0],
            [180, -20, 'elevatorRail.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 900,
        ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        action: 'activateElevator',
        x:0, y:0, z:0, r:0
    },
    {
        name:'elevator',
        points : [
            [200, -220, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [400, -220, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [400, -20, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            [200, -20, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 0, z1 : 20,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0],
        animate: null, state:2,
        //action: 'activateElevator',
        x:0, y:0, z:0, r:0
    },
]

for(let i=0;i<14;i++){
    level.push(
        {
            points : [
                [200+i*20, 20, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
                [300+i*20, 20, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
                [300+i*20, 200, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
                [200+i*20, 200, 'wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            ],
            z0 : 20+i*20, z1 : 40+i*20,
            ceil: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0], 
            floor: ['wood.jpg', 0, 0, 0, 1, 1, 0, 0],
            x:0, y:0, r:0
        }
    )
}

uiImages = [
    {
        src:'gun.png',
        originX: 0.55, originY: 1,
        factorX:0.5, factorY:0.5,
        toX:180, toY:-180,
        despX:0, despY:0,
    },
]

objHeart = {
    name:'heart',
    points : [
        [1500, 1600, 'heart.png', 0, 0, 0, 5, 5, 0, 0],
        [1550, 1600, 'heart.png', 0, 0, 0, 1, 1, 0, 0],
    ],
    z0 : 20, z1 : 70,
    ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
    floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
    animate: 'animate',
    touch: 'heart',
    x:1525, y:1600, z:0, r:0
}

objBullets = {
    name:'bullets',
    points : [
        [1500, 1500, 'bullets.png', 0, 0, 0, 4, 4, 20, 0],
        [1550, 1500, 'bullets.png', 0, 0, 0, 1, 1, 0, 0],
    ],
    z0 : 0, z1 : 70,
    ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
    floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
    animate: 'animate',
    touch: 'bullets',
    x:1525, y:1500, z:0, r:0
}