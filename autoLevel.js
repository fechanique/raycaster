const generatedLevel = [];
const gridSizeX = 10; // Número de cubos en la dirección X
const gridSizeY = 10; // Número de cubos en la dirección Y
const cubeSide = 200; // Tamaño del lado de cada cubo
const spacing = 250; // Espacio entre los centros de los cubos
const startX = 0; // Coordenada X inicial para el primer cubo (para dejar espacio al jugador)
const startY = 0; // Coordenada Y inicial para el primer cubo
const baseZ0 = 0;    // Altura base del suelo de los cubos
const cubeHeight = 100; // Altura de los cubos

for (let i = 0; i < gridSizeX; i++) {
    for (let j = 0; j < gridSizeY; j++) {
        const centerX = startX + i * spacing;
        const centerY = startY + j * spacing;

        const halfSide = cubeSide / 2;

        const cubePoints = [
            [centerX - halfSide, centerY - halfSide], // Top-left
            [centerX + halfSide, centerY - halfSide], // Top-right
            [centerX + halfSide, centerY + halfSide], // Bottom-right
            [centerX - halfSide, centerY + halfSide]  // Bottom-left
        ];

        generatedLevel.push({
            points: cubePoints,
            z0: baseZ0,
            z1: baseZ0 + cubeHeight*(j+1),
            texture: 'brick.png', ceil: 'wood.jpg',
        });
    }
}

// Puedes añadir un suelo grande si quieres

generatedLevel.push({
    points: [[-1000, -1000], [3000, -1000], [3000, 3000], [-1000, 3000]],
    z0: -10, z1: 0,
    texture: 'brick.png', ceil: 'wood.jpg',
});


level = generatedLevel;