// Get the canvas element
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Set the canvas size to 16:9 aspect ratio
canvas.width = 1024;
canvas.height = 300;
canvas.style.margin = "0rem 1rem 0rem";

// Add collisions to the map
const collisionsMap = [];

for (let i = 0; i < collisions.length; i += 64) {
  collisionsMap.push(collisions.slice(i, 64 + i));
}

class Boundary {
  static width = 32;
  static height = 32;
  constructor({ position }) {
    this.position = position;
    this.width = 32;
    this.height = 32;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 1)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
let offset = {
  x: 0,
  y: -820,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 3759)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image();
image.src = "../assets/img/tilesets/img/map.png";

const playerImage = new Image();
playerImage.src = "../assets/img/sprite/player.png";

class Sprite {
  constructor({ position, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
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

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const player = new Sprite({
  position: {
    x: 64,
    y: background.position.y + 1024,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

let keys = {
  w: {
    pressed: false,
    down: false,
  },
  a: {
    pressed: false,
    down: false,
  },
  s: {
    pressed: false,
    down: false,
  },
  d: {
    pressed: false,
    down: false,
  },
};

// Select the elements
let timerElement = document.getElementById("game-timer");

// Initialize variables
let time = 0;
let count = 0;
// Increment time every second
setInterval(() => {
  time++;
  timerElement.textContent = time < 10 ? "0" + time : time;
}, 1000);

const movables = [background, ...boundaries];
const boundaryOffset = 1;
function boundaryCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width - boundaryOffset >
      rectangle2.position.x &&
    rectangle1.position.x + boundaryOffset <
      rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + boundaryOffset <
      rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height - boundaryOffset >
      rectangle2.position.y
  );
}

// Animate the Game
function animate() {
  window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();
  let moving = true;

  // Movement, Map Boundary, and Collision
  if (keys.w.pressed && lastKey === "w") {
    // Check for collisions first
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boundaryCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 1,
            },
          },
        })
      ) {
        console.log("collision w");

        moving = false;
        break;
      }
    }

    if (moving) {
      if (background.position.y < -18) {
        movables.forEach((movable) => {
          movable.position.y += 1;
        });
      }

      if (moving && background.position.y > -19) {
        player.position.y -= 1;
      }
      console.log(
        "player position y",
        player.position.y,
        background.position.y
      );
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boundaryCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 1,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("collision a");

        moving = false;
        break;
      }
    }

    if (moving) {
      if (background.position.x < 0) {
        movables.forEach((movable) => {
          movable.position.x += 1;
        });
      }
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boundaryCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 1,
            },
          },
        })
      ) {
        console.log("collision s");

        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 1;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boundaryCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 1,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("collision");

        moving = false;
        break;
      }
    }

    if (moving) {
      if (background.position.x > -canvas.width) {
        movables.forEach((movable) => {
          movable.position.x -= 1;
        });
      }
      if (background.position.x < -canvas.width + 1) {
        player.position.x += 1;
      }
    }
  }
}
animate();

// Check the last keyboard key pressed
let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
    case "ArrowDown":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
    case "ArrowRight":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      keys.w.pressed = false;
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "s":
    case "ArrowDown":
      keys.s.pressed = false;
      break;
    case "d":
    case "ArrowRight":
      keys.d.pressed = false;
      break;
  }
});
