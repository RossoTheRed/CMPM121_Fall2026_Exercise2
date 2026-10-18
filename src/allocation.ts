export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

interface crewData {
  supplyCount: number;
  crewCount: number;
  supplyBalance: number;
}

function updateData(): crewData {
  const supplies = producers * 3;
  const crew = 6;
  const supplyBalance = supplies - crew;

  return {
    supplyCount: supplies,
    crewCount: crew,
    supplyBalance: supplyBalance,
  };
}

interface barData {
  value: number;
  color: string;
}

function updateText(data: crewData) {
  const supplies: number = data.supplyCount;
  const crew: number = data.crewCount;
  const supplyBalance: number = data.supplyBalance;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);

  const barInfo: Record<string, barData> = {
    "Production": { value: supplies, color: "#27766b" },
    "Consumption": { value: crew, color: "#a44d23" },
  };

  let barHeight = 110; // Magic number, sorry. Idk how to fix this
  for (const key in barInfo) {
    const val = barInfo[key];

    ctx.fillStyle = "#233e43"; // Text fill color
    ctx.fillText(`${key}: ${val.value}`, 18, barHeight - 8);
    ctx.fillStyle = val.color; // Box fill color
    ctx.fillRect(18, barHeight, val.value * 14, 20);
    barHeight += 52;
  }

  readout.textContent =
    `Assigned: ${producers}/6 · Production: ${supplies} · Consumption: ${crew} · Balance: ${
      supplyBalance > 0 ? "+" : ""
    }${supplyBalance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateText(updateData());
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  updateText(updateData());
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateText(updateData());
  };
updateText(updateData());
