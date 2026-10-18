export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

interface roverCommand {
  dir: string;
  move: number[];
}

// This is what you wanted, right?
const commands: Record<number, roverCommand> = {
  0: { dir: "North", move: [0, -1] },
  1: { dir: "East", move: [1, 0] },
  2: { dir: "South", move: [0, 1] },
  3: { dir: "West", move: [-1, 0] },
};

function moveRover(dir: number[]) {
  x += dir[0];
  // Limit x to 0 <= x <= 4
  x = Math.max(0, x);
  x = Math.min(4, x);

  y += dir[1];
  // Same with y
  y = Math.max(0, y);
  y = Math.min(4, y);
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    commands[direction].dir
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  const movement = commands[direction].move;
  moveRover(movement);
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  direction = (direction + 1) % 4;
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
