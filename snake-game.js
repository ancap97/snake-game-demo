const config = {
  type: Phaser.AUTO,
  width: 600, // Increased width
  height: 600, // Increased height
  backgroundColor: '#000000',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let snake = [];
let food;
let cursors;
let direction = 'RIGHT';
let lastMoveTime = 0;
const moveInterval = 150; // Snake speed
const gridSize = 20;
let score = 0;

function preload() {
  // Load food asset
  this.load.image('food', 'https://cdn-icons-png.flaticon.com/512/3523/3523063.png'); // Replace with your own image URL
}

function create() {
  // Add the initial snake body parts
  for (let i = 0; i < 3; i++) {
    snake.push(this.add.rectangle(200 - i * gridSize, 200, gridSize, gridSize, 0x00ff00));
  }

  // Add food
  food = this.add.rectangle(getRandomPosition(), getRandomPosition(), gridSize, gridSize, 0xff0000);

  // Draw border
  const borderColor = 0xffffff; // White border color
  this.add.rectangle(config.width / 2, 0, config.width, gridSize, borderColor).setOrigin(0.5, 0); // Top border
  this.add.rectangle(config.width / 2, config.height, config.width, gridSize, borderColor).setOrigin(0.5, 1); // Bottom border
  this.add.rectangle(0, config.height / 2, gridSize, config.height, borderColor).setOrigin(0, 0.5); // Left border
  this.add.rectangle(config.width, config.height / 2, gridSize, config.height, borderColor).setOrigin(1, 0.5); // Right border

  // Initialize cursors for keyboard input
  cursors = this.input.keyboard.createCursorKeys();

  // Display score
  this.scoreText = this.add.text(10, 10, `Score: ${score}`, { fontSize: '16px', color: '#fff' });
}

function update(time) {
  // Move the snake only after the interval
  if (time > lastMoveTime + moveInterval) {
    lastMoveTime = time;

    // Update direction based on user input
    if (cursors.left.isDown && direction !== 'RIGHT') direction = 'LEFT';
    else if (cursors.right.isDown && direction !== 'LEFT') direction = 'RIGHT';
    else if (cursors.up.isDown && direction !== 'DOWN') direction = 'UP';
    else if (cursors.down.isDown && direction !== 'UP') direction = 'DOWN';

    moveSnake();
  }
}

function moveSnake() {
  // Get current head position
  const head = snake[0];
  let newHeadX = head.x;
  let newHeadY = head.y;

  // Update position based on direction
  if (direction === 'RIGHT') newHeadX += gridSize;
  else if (direction === 'LEFT') newHeadX -= gridSize;
  else if (direction === 'UP') newHeadY -= gridSize;
  else if (direction === 'DOWN') newHeadY += gridSize;

  // Add new head to the snake
  const newHead = game.scene.scenes[0].add.rectangle(newHeadX, newHeadY, gridSize, gridSize, 0x00ff00);
  snake.unshift(newHead);

  // Check for collision with food
  if (newHeadX === food.x && newHeadY === food.y) {
    score++;
    game.scene.scenes[0].scoreText.setText(`Score: ${score}`);
    repositionFood();
  } else {
    // Remove the tail if no food eaten
    const tail = snake.pop();
    tail.destroy();
  }

  // Check for collisions with walls or itself
  if (
    newHeadX < gridSize || // Left border
    newHeadY < gridSize || // Top border
    newHeadX >= config.width - gridSize || // Right border
    newHeadY >= config.height - gridSize || // Bottom border
    checkSelfCollision(newHeadX, newHeadY)
  ) {
    resetGame();
  }
}

function checkSelfCollision(x, y) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }
  return false;
}

function getRandomPosition() {
  // Generate a random position that aligns with the grid and is within the border
  return Math.floor(Math.random() * ((config.width - gridSize) / gridSize)) * gridSize + gridSize;
}

function repositionFood() {
  food.x = getRandomPosition();
  food.y = getRandomPosition();
}

function resetGame() {
  alert(`Game Over! Your score: ${score}`);
  game.scene.scenes[0].scene.restart();
  snake = [];
  score = 0;
  direction = 'RIGHT';
}
