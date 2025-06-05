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
        x:0, y:0, r:0,
    },
    {
        name:'block',
        points : [
            [-1000, -1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, -1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [1000, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],

            [500, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [550, 900, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [800, 900, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [800, 500, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [200, 500, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [200, 900, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [550, 900, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [500, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],

            [-1000, 1000, 'brick.png', 0, 0, 0, 1, 1, 0, 0]
        ],
        z0 : 0, z1 : 50,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0,
    },
]

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