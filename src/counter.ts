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

// Thank you Professor Smith
const SHIELD_CHANGE_EVENT = "ShieldChange";

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget
class Shield extends EventTarget {
  maxCharge: number;
  currCharge: number;
  missingCharge: number;

  constructor(initialCharge: number = 0) {
    super();

    this.maxCharge = 10;
    // Clamp initialCharge to be within [0,maxCharge]
    this.currCharge = Math.min(this.maxCharge, Math.max(0, initialCharge));

    this.missingCharge = 0;
    this.calcMissingCharge();
  }

  Recharge(chargeAmount: number = 1) {
    if (chargeAmount < 1) {
      console.error("chargeAmount cannot be less than 1!");
      return;
    }

    this.currCharge += chargeAmount;
    this.currCharge = Math.min(this.maxCharge, this.currCharge);

    this.calcMissingCharge();

    this.AnnounceValueChange();
  }

  Damage(damageAmount: number = 1) {
    if (damageAmount < 1) {
      console.error("damageAmount cannot be less than 1!");
      return;
    }

    this.currCharge -= damageAmount;
    this.currCharge = Math.max(0, this.currCharge);

    this.calcMissingCharge();

    this.AnnounceValueChange();
  }

  SetCharge(newCharge: number) {
    this.currCharge = Math.min(this.maxCharge, Math.max(0, newCharge));

    this.AnnounceValueChange();
  }

  private calcMissingCharge() {
    this.missingCharge = this.maxCharge - this.currCharge;
  }

  AnnounceValueChange() {
    // https://medium.com/@ahmedbe/understanding-custom-events-in-javascript-243632035467
    this.dispatchEvent(
      new CustomEvent(SHIELD_CHANGE_EVENT, { detail: this.currCharge }),
    );
  }
}

const shield = new Shield();

function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < shield.currCharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.currCharge} / ${shield.maxCharge} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${shield.currCharge} / ${shield.maxCharge}`;
}

function updatePanel() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderPanel();
}

function renderPanel() {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.currCharge} · Missing charge: ${shield.missingCharge}`;
}

const lessButton = document.querySelector<HTMLButtonElement>("#counter-less")!;
lessButton.onclick = () => {
  shield.Damage();
};

const moreButton = document.querySelector<HTMLButtonElement>("#counter-more")!;
moreButton.onclick = () => {
  shield.Recharge();
};

const resetButton = document.querySelector<HTMLButtonElement>(
  "#counter-reset",
)!;
resetButton.onclick = () => {
  shield.SetCharge(0);
};

const panelOpenButton = document.querySelector<HTMLButtonElement>(
  "#counter-open",
)!;
panelOpenButton.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderPanel();

  shield.addEventListener(SHIELD_CHANGE_EVENT, onShieldChanged);

  panelCloseButton.disabled = false;
  panelOpenButton.disabled = true;
};

const panelCloseButton = document.querySelector<HTMLButtonElement>(
  "#counter-close",
)!;
panelCloseButton.onclick = () => {
  if (!panel) return;

  shield.removeEventListener(SHIELD_CHANGE_EVENT, onShieldChanged);

  panel.remove();
  panel = null;

  panelCloseButton.disabled = true;
  panelOpenButton.disabled = false;
};

function onShieldChanged() {
  updatePanel();
}
shield.addEventListener(
  SHIELD_CHANGE_EVENT,
  () => {
    drawMeter();
  },
);

drawMeter();
