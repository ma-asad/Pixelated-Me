// Define Key class to track key press events
class Key {
  constructor() {
    this.pressed = false; // Flag to indicate if the key is currently pressed
    this.down = false; // Flag to indicate if the key was pressed down
  }
}

// Define  Sprite class to represent the game sprite
class Sprite {
  constructor({ position, image, frames = { max: 1 } }) {
    this.position = position; // Position of the sprite
    this.image = image; // Image of the sprite
    this.frames = frames; // Number of frames in the sprite image

    // Set the width and height of the sprite based on the image dimensions
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  // Draw the sprite on the canvas
  draw(c) {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

// Define a Boundary class to represent a game boundary
class Boundary {
  static width = 32; // Width of the boundary
  static height = 32; // Height of the boundary

  constructor({ position, symbol }) {
    this.symbol = symbol;
    this.position = position; // Position of the boundary
    this.width = 32; // Width of the boundary
    this.height = 32; // Height of the boundary
  }

  // Draw the boundary on the canvas
  draw(c) {
    c.fillStyle = "rgba(255, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// Define a Player class that extends the Sprite class
class Player extends Sprite {
  constructor({ position, image, frames }) {
    super({ position, image, frames });
  }
}

// Define the Game class to manage the game logic
class Game {
  constructor(canvas, collisions) {
    this.canvas = canvas;
    this.c = this.canvas.getContext("2d");
    this.paused = false;
    this.collisionsMap = this.createCollisionsMap(collisions); // Map of collision symbols
    this.offset = {
      x: 0,
      y: -820,
    };
    this.boundaries = this.createBoundaries(); // Array of boundary objects
    this.background = this.createBackground(); // Background sprite
    this.player = this.createPlayer(); // Player sprite
    this.keys = {
      w: new Key(),
      a: new Key(),
      s: new Key(),
      d: new Key(),
      space: new Key(),
    };
    this.lastKey = ""; // Last key pressed
    this.movables = [this.background, ...this.boundaries]; // Array of movable objects
    this.boundaryOffset = 1; // Offset for boundary collision detection
    this.timerElement = document.getElementById("game-timer"); // Timer element
    this.time = 0; // Game timer
    this.count = 0; // Count variable
    this.setTimer(); // Set up the game timer
    this.setKeyListeners(); // Set up key event listeners
  }

  // Toggle the game pause state
  togglePause() {
    this.paused = !this.paused;

    if (this.paused) {
      // Clear the interval when the game is paused
      clearInterval(this.timerId);
    } else {
      // Set the interval again when the game is resumed
      this.setTimer();
    }
  }

  // Draw the pause screen
  drawPauseScreen() {
    this.c.fillStyle = "black";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.font = "20px 'Press Start 2P'";
    this.c.fillStyle = "white";
    this.c.textAlign = "center";
    this.c.textBaseline = "middle";
    this.c.fillText(
      "Press spacebar to resume",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  endGame() {
    // Stop the timer
    clearInterval(this.timerId);

    // Calculate time taken
    let timeTaken = this.time;

    // Get the canvas element
    let canvas = document.getElementById("game-canvas");
    // Create a black screen
    let blackScreen = document.createElement("div");
    blackScreen.id = "blackScreen";
    blackScreen.style.position = "absolute";
    blackScreen.style.top = canvas.offsetTop + "px";
    blackScreen.style.left = canvas.offsetLeft + "px";
    blackScreen.style.width = canvas.offsetWidth + "px";
    blackScreen.style.height = canvas.offsetHeight + "px";

    blackScreen.style.backgroundColor = "black";
    blackScreen.style.color = "white";
    blackScreen.style.display = "flex";
    blackScreen.style.justifyContent = "center";
    blackScreen.style.alignItems = "center";
    blackScreen.innerText = `You have escaped the labyrinth!. \n \n Time taken: ${timeTaken} seconds. \n \n CTRL+R to restart.`;

    // Append black screen to body
    document.body.appendChild(blackScreen);

    // Retrieve the current user from session storage
    let currentUser = JSON.parse(sessionStorage.getItem("user"));

    // Update the user's time
    currentUser.timeTaken = this.time;

    // Save the user back to session storage
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update the leaderboard
    updateLeaderboard(currentUser);
  }

  // Create the collisions map from the collisions array
  createCollisionsMap(collisions) {
    const collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 64) {
      collisionsMap.push(collisions.slice(i, 64 + i));
    }
    return collisionsMap;
  }

  // Create the boundaries based on the collisions map
  createBoundaries() {
    const boundaries = [];

    this.collisionsMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol === 3759 || symbol === 3760) {
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width + this.offset.x,
                y: i * Boundary.height + this.offset.y,
              },
              symbol: symbol,
            })
          );
        }
      });
    });
    return boundaries;
  }

  // Create the background sprite
  createBackground() {
    const image = new Image();
    image.src = "../assets/img/map.png";
    return new Sprite({
      position: {
        x: this.offset.x,
        y: this.offset.y,
      },
      image: image,
    });
  }

  // Create the player sprite
  createPlayer() {
    const playerImage = new Image();
    playerImage.src = "../assets/img/sprite/player.png";
    return new Player({
      position: {
        x: 64,
        y: this.background.position.y + 1024,
      },
      image: playerImage,
      frames: {
        max: 4,
      },
    });
  }

  // Set up the game timer
  setTimer() {
    this.timerId = setInterval(() => {
      this.time++;
      this.timerElement.textContent =
        this.time < 10 ? "0" + this.time : this.time;
    }, 1000);
  }

  // Set up key event listeners
  setKeyListeners() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          this.keys.space.pressed = true;
          this.togglePause();
          break;
        case "w":
        case "ArrowUp":
          this.keys.w.pressed = true;
          this.lastKey = "w";
          break;
        case "a":
        case "ArrowLeft":
          this.keys.a.pressed = true;
          this.lastKey = "a";
          break;
        case "s":
        case "ArrowDown":
          this.keys.s.pressed = true;
          this.lastKey = "s";
          break;
        case "d":
        case "ArrowRight":
          this.keys.d.pressed = true;
          this.lastKey = "d";
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case " ":
          this.keys.space.pressed = false;
          break;
        case "w":
        case "ArrowUp":
          this.keys.w.pressed = false;
          break;
        case "a":
        case "ArrowLeft":
          this.keys.a.pressed = false;
          break;
        case "s":
        case "ArrowDown":
          this.keys.s.pressed = false;
          break;
        case "d":
        case "ArrowRight":
          this.keys.d.pressed = false;
          break;
      }
    });
  }

  // Check if two rectangles collide
  boundaryCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.position.x + rectangle1.width - this.boundaryOffset >
        rectangle2.position.x &&
      rectangle1.position.x + this.boundaryOffset <
        rectangle2.position.x + rectangle2.width &&
      rectangle1.position.y + this.boundaryOffset <
        rectangle2.position.y + rectangle2.height &&
      rectangle1.position.y + rectangle1.height - this.boundaryOffset >
        rectangle2.position.y
    );
  }

  // Animation loop
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    if (!this.paused) {
      this.background.draw(this.c);
      this.boundaries.forEach((boundary) => {
        boundary.draw(this.c);
      });
      this.player.draw(this.c);
      let moving = true;
      let isEnd = false;
      // Movement, Map Boundary, and Collision
      if (this.keys.w.pressed && this.lastKey === "w") {
        // Check for collisions first
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.boundaryCollision({
              rectangle1: this.player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y + 1,
                },
                symbol: boundary.symbol,
              },
            })
          ) {
            moving = false;
            if (boundary.symbol === 3760) {
              moving = true;
              break;
            }
          }
        }

        if (moving) {
          if (this.background.position.y < -18) {
            this.movables.forEach((movable) => {
              movable.position.y += 1;
            });
          }

          if (this.background.position.y > -19) {
            this.player.position.y -= 1;
          }
        }
      } else if (this.keys.a.pressed && this.lastKey === "a") {
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.boundaryCollision({
              rectangle1: this.player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x + 1,
                  y: boundary.position.y,
                },
              },
            })
          ) {
            moving = false;
            if (boundary.symbol === 3760) {
              moving = true;
              break;
            }
          }
        }

        if (moving) {
          if (this.background.position.x < 0) {
            this.movables.forEach((movable) => {
              movable.position.x += 1;
            });
          }
        }
      } else if (this.keys.s.pressed && this.lastKey === "s") {
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];
          if (
            this.boundaryCollision({
              rectangle1: this.player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y - 1,
                },
              },
            })
          ) {
            moving = false;
            if (boundary.symbol === 3760) {
              moving = true;
              break;
            }
          }
        }

        if (moving) {
          this.movables.forEach((movable) => {
            movable.position.y -= 1;
          });
        }
      } else if (this.keys.d.pressed && this.lastKey === "d") {
        for (let i = 0; i < this.boundaries.length; i++) {
          const boundary = this.boundaries[i];

          if (
            this.boundaryCollision({
              rectangle1: this.player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x - 1,
                  y: boundary.position.y,
                },
                symbol: boundary.symbol,
              },
            })
          ) {
            moving = false;
            // break;
            if (boundary.symbol === 3760) {
              console.log("collision exit a");
              moving = true;
              isEnd = true;
              break;
            }
          }
        }

        if (moving) {
          if (this.background.position.x > -this.canvas.width) {
            this.movables.forEach((movable) => {
              movable.position.x -= 1;
            });
          }
          if (this.background.position.x < -this.canvas.width + 1) {
            this.player.position.x += 1;
          }
          if (isEnd) {
            this.endGame();
          }
        }
      }
    } else {
      this.drawPauseScreen();
    }
  }
}

class GameLoader {
  constructor(canvasId, buttonId) {
    this.canvas = document.getElementById(canvasId);
    this.c = this.canvas.getContext("2d");
    this.startButton = document.getElementById(buttonId);
    this.canvas.width = 1024;
    this.canvas.height = 300;
  }

  displayText() {
    this.c.fillStyle = "black";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.font = "30px 'Press Start 2P'";
    this.c.fillStyle = "white";
    this.c.textAlign = "center";
    this.c.textBaseline = "middle";
    this.c.fillText(
      "Press Start 2P",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );
  }

  startGame() {
    this.startButton.addEventListener("click", () => {
      // If a game is already running, end it
      if (this.game) {
        this.game.endGame();
      }

      // Start a new game
      this.game = new Game(this.canvas, collisions);
      this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.game.animate();
      this.startButton.style.display = "none";
    });
  }
}

// Usage
const gameLoader = new GameLoader("game-canvas", "startButton");
gameLoader.displayText();
gameLoader.startGame();
