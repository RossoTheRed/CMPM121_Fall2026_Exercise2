export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

class shieldClass {
  maxCharge: number;
  currentCharge: number;
  missingCharge: number;

  constructor(initialCharge: number = 0) {
    this.maxCharge = 10;
    // Clamp initialCharge to be within [0,maxCharge]
    this.currentCharge = Math.min(this.maxCharge, Math.max(0, initialCharge));

    this.missingCharge = 0;
    this.calcMissingCharge();
  }

  Recharge(chargeAmount: number = 1) {
    if (chargeAmount < 1) {
      console.error("chargeAmount cannot be less than 1!");
      return;
    }

    console.log(`Recharging shield by ${chargeAmount}`);
    this.currentCharge += chargeAmount;
    this.currentCharge = Math.min(this.maxCharge, this.currentCharge);

    this.calcMissingCharge();
  }

  Damage(damageAmount: number = 1) {
    if (damageAmount < 1) {
      console.error("damageAmount cannot be less than 1!");
      return;
    }

    console.log(`Damaging shield by ${damageAmount}`);

    this.currentCharge -= damageAmount;
    this.currentCharge = Math.max(0, this.currentCharge);

    this.calcMissingCharge();
  }

  SetCharge(newCharge: number) {
    this.currentCharge = Math.min(this.maxCharge, Math.max(0, newCharge));
  }

  private calcMissingCharge() {
    this.missingCharge = this.maxCharge - this.currentCharge;
  }
}

const shield = new shieldClass();

function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < shield.currentCharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.currentCharge} / ${shield.maxCharge} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${shield.currentCharge} / ${shield.maxCharge}`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats();
}

function renderStats() {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.currentCharge} · Missing charge: ${shield.missingCharge}`;
}
/**
 * @deprecated Use new ShieldClass and its methods instead
 */
function _setCount(_next: number) {
  console.error(
    "this function has been deprecated. Please use the new ShieldClass and its methods instead.",
  );
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  shield.Damage();
  drawMeter();
  if (panel) updateStats();
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  shield.Recharge();
  drawMeter();
  if (panel) updateStats();
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  shield.SetCharge(0);
  drawMeter();
  if (panel) updateStats();
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats();
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter();
