level = [
    {
        points : [
            [-10000, -10000],
            [10000, -10000],
            [10000, 10000],
            [-10000, 10000]
        ],
        z0 : -20, z1 : 0,
        texture: 'brick.png',
        ceil: 'ceiling.png',
    },
    {
        points : [
            [100, 100],
            [1000, 100],
            [1000, 1000],
            [100, 1000]
        ],
        z0 : 200, z1 : 220,
        texture: 'brick.png',
        ceil: 'ceiling.png',
    },

    {
        points : [
            [400, 400],
            [500, 400],
            [500, 500],
            [400, 500]
        ],
        z0 : -2000, z1 : 2400,
        texture: 'brick.png',
        ceil: 'ceiling.png',
    },
    {
        points : [
            [300, 450],
            [600, 400],
            [600, 500],
            [300, 450]
        ],
        z0 : 100, z1 : 120,
        texture: 'wood.jpg',
        ceil: 'ceiling.png',
    },

    {
        points : [
            [200, 200],
            [300, 200],
            [300, 300],
            [200, 300]
        ],
        z0 : 40, z1 : 60,
        texture: 'brick.png',
        ceil: 'ceiling.png',
    },
    {
        points : [
            [200, 200],
            [300, 200],
            [300, 300],
            [200, 300]
        ],
        z0 : 60, z1 : 180,
        texture: 'fence.png',
        ceil: 'ceiling.png',
        alpha: false,
    },

    {
        name : 'glassCube1',
        points : [
            [-200, 400],
            [-100, 400],
            [-100, 500],
            [-200, 500]
        ],
        z0 : 100, z1 : 200,
        texture: 'glass.jpg',
        ceil: 'glass.jpg',
        alpha: true,
        alphaValue: 50
    },

    {
        name : 'glassCube2',
        points : [
            [-400, 400],
            [-300, 400],
            [-300, 500],
            [-400, 500]
        ],
        z0 : 150, z1 : 250,
        texture: 'redGlass.jpg',
        ceil: 'redGlass.jpg',
        alpha: true,
        alphaValue: 50
    },

    {
        name : 'glassCube3',
        points : [
            [-600, 400],
            [-500, 400],
            [-500, 500],
            [-600, 500]
        ],
        z0 : 300, z1 : 400,
        texture: 'yellowGlass.jpg',
        ceil: 'yellowGlass.jpg',
        alpha: true,
        alphaValue: 50
    },

    {
        name : 'glassCube4',
        points : [
            [-600, 600],
            [-500, 600],
            [-500, 700],
            [-600, 700]
        ],
        z0 : 100, z1 : 200,
        texture: 'greenGlass.jpg',
        ceil: 'greenGlass.jpg',
        alpha: true,
        alphaValue: 50
    },

    {
        name : 'glassCube5',
        points : [
            [-400, 600],
            [-300, 600],
            [-300, 700],
            [-400, 700]
        ],
        z0 : 100, z1 : 200,
        texture: 'blueGlass.jpg',
        ceil: 'blueGlass.jpg',
        alpha: true,
        alphaValue: 50
    },

    {
        name : 'grid',
        points : [
            [-200, 600],
            [-100, 600],
            [-100, 700],
            [-200, 700]
        ],
        z0 : 100, z1 : 200,
        texture: 'transparent.png',
        ceil: 'transparent.png',
        alpha: true    },

    {
        points : [
            [700, 700],
            [800, 700],
            [800, 800],
            [700, 800]
        ],
        z0 : 40, z1 : 60,
        texture: 'brick.png',
        ceil: 'ceiling.png',
    },
    {
        points : [
            [700, 700],
            [800, 700],
            [800, 800],
            [700, 800]
        ],
        z0 : 60, z1 : 180,
        texture: 'transparent.png',
        ceil: 'ceiling.png',
        alpha: true,
    },

    {
        name: 'light',
        points : [
            [300, 700],
            [500, 700],
            [500, 750],
            [300, 750]
        ],
        z0 : 190, z1 : 200,
        texture: 'brick.png',
        ceil: 'ceiling.png',
    },

    {
        points : [
            [400, 200],
            [500, 200]
        ],
        z0 : 40, z1 : 140,
        texture: 'tree.png',
        ceil: 'ceiling.png',
        alpha: true,
    },

    {
        points : [ [600, -200], [700, -200], [700, 300], [600, 300] ],
        z0 : 0, z1 : 40,
        texture: 'brick.png', ceil: 'wood.jpg',
    },
    {
        points : [ [700, -200], [800, -200], [800, 300], [700, 300] ],
        z0 : 0, z1 : 60,
        texture: 'brick.png', ceil: 'wood.jpg',
    },
    {
        points : [ [800, -300], [900, -300], [900, 300], [800, 300] ],
        z0 : 0, z1 : 100,
        texture: 'brick.png', ceil: 'wood.jpg',
    },
    {
        points : [ [900, -400], [1100, -400], [1100, 300], [900, 300] ],
        z0 : 0, z1 : 140,
        texture: 'brick.png', ceil: 'wood.jpg',
    },
    {
        points : [ [900, 0], [1100, 0], [1100, 300], [900, 300] ],
        z0 : 0, z1 : 180,
        texture: 'brick.png', ceil: 'wood.jpg',
    },

    {
        points : [ [-200, -200], [0, -200], [0, -100], [-100, -100], [-100, 100], [-200, 100] ],
        z0 : 0, z1 : 230,
        texture: 'brick.png', ceil: 'wood.jpg'
    },
    {
        points : [ [-150, -205], [-70, -205], [-70, -200], [-150, -200]],
        z0 : 0, z1 : 200,
        texture: 'candle.png', ceil: 'door.jpg',
        action: 'door',
        animate: 'animate'
    },
]