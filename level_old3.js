level = [
    {
        points : [
            [-10000, -10000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [10000, -10000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [10000, 10000, 'brick.png', 0, 0, 0, 1, 1, 0, 0],
            [-10000, 10000, 'brick.png', 0, 0, 0, 1, 1, 0, 0]
        ],
        z0 : -20, z1 : 0,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        x:0, y:0, r:0
    },
    {
        points : [
            [100, 100, 'wood.jpg', 0, -1, -1, 1, 1, 0, 0],
            [270, 100, 'brick.png', -1, 0, -1, 1, 1, 0, 0],
            [270, 270, 'brick.png', -1, -1, 0, 1, 1, 0, 0],
            [100, 270, 'brick.png', 1, 0, -1, 1, 1, 0, 0]
        ],
        z0 : 0, z1 : 170,
        ceil: ['ceiling.png', -1, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, -1, 0, 1, 1, 0, 0],
        action: 'light',
        //animate: 'rotateCube',
        x:150, y:150, r:0,
        alpha:true,
        alphaValue:125,
    },
    {
        points : [
            [134, 150, 'candle.png', 2, 2, 2, 1, 1, 0, 0],
            [166, 150, 'candle.png', 0, 0, 0, 1, 1, 0, 0],
        ],
        z0 : 100, z1 : 132,
        ceil: ['ceiling.png', 0, 0, 0, 1, 1, 0, 0], 
        floor: ['floor.jpg', 0, 0, 0, 1, 1, 0, 0],
        animate: 'animate',
        action: 'candle',
        x:150, y:150, r:0
    }
]