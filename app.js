"use strcit";

// Constant
const GATE = {
  AND: [
    [1, 1, 1],
    [-1, 1, 0],
    [-1, 0, 1],
    [-1, 0, 0],
  ],
  OR: [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [-1, 0, 0],
  ],
  NAND: [
    [-1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 0],
  ],
  NOR: [
    [1, 1, 1],
    [-1, 1, 0],
    [-1, 0, 1],
    [1, 0, 0],
  ],
  XOR: [
    [-1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [-1, 0, 0],
  ],
};

// DOM Element
const formEl = document.querySelector(".form");
const weight1El = document.getElementById("weight-1");
const weight2El = document.getElementById("weight-2");
const biosEl = document.getElementById("bios");
const learningRateEl = document.getElementById("learning-rate");
const counterEl = document.getElementById("counter");

let LEARNING_RATE;
let COUNTER_LIMIT;
let currentBios;
let currentWeights;
const STORED_DATA_DEFAULT = {
  xIns: [],
  nets: [],
  outs: [],
  targets: [],
  weights: [],
  bioses: [],
};
// Event listeners
formEl.addEventListener("submit", e => {
  e.preventDefault();
  LEARNING_RATE = +learningRateEl.value;
  COUNTER_LIMIT = +counterEl.value;
  currentBios = +biosEl.value;
  currentWeights = [+weight1El.value, +weight2El.value];
  const cardContainer = document.querySelector(".card__container");
  cardContainer.innerHTML = "";
  const gateEl = document.querySelector(".radio-button input:checked");

  startProcess(gateEl.value);

  resetInputs(weight1El, weight2El, biosEl, learningRateEl, counterEl);
});

// **Tools**
const resetInputs = (...elements) => {
  //   elements.forEach(el => (el.value = ""));
  elements[0].focus();
};

// Funtionarlity
const changeWeight = (weight, x, target) => {
  return weight + LEARNING_RATE * x * target;
};

const changeBios = (bios, target) => {
  return bios + LEARNING_RATE * target;
};

const calcNet = (xIn, weights, bios) => {
  const result = xIn.reduce((acc, currentX, i) => {
    return acc + currentX * weights[i];
  }, 0);
  return bios + result;
};
const calcOut = net => {
  // pelekani
  if (net > 0) return 1;
  return -1;
};

const calcOneRound = (bios, target, xValue, weights) => {
  let changedWeight = [];
  let changedBios;

  const net = calcNet(xValue, weights, bios);
  const out = calcOut(net);
  if (target == out) {
    // printOneRound(xValue, LEARNING_RATE, net, out, weights, bios);
    // Not touching to weights and bios
    return {
      changedWeight: weights,
      changedBios: bios,
      out,
      net,
    };
  } else {
    // Update weights
    xValue.forEach((currentX, i) => {
      changedWeight.push(changeWeight(weights[i], currentX, target));
    });
    // Update bios
    changedBios = changeBios(bios, target);

    // printOneRound(xValue, LEARNING_RATE, net, out, changedWeight, changedBios);

    // Touch and change weights and bios
    return {
      changedWeight,
      changedBios,
      out,
      net,
    };
  }
};

// Render card to HTML
const renderCard = (data, number) => {
  console.log(data);
  const cardContainer = document.querySelector(".card__container");
  const cardTemplate = document.getElementById("card-template");
  const cardClone = cardTemplate.content.cloneNode(true);
  const card = cardClone.querySelector(".card");

  const cardRowTemplate = card.querySelector("#card__row-template");
  for (let i = 0; i < 4; i++) {
    const cardRowClone = cardRowTemplate.content.cloneNode(true);
    const divs = cardRowClone.querySelectorAll(".card__row div");
    divs[0].textContent = `[${data.xIns[i].join(",")}]`;
    divs[1].textContent = data.nets[i];
    divs[2].textContent = data.outs[i];
    divs[3].textContent = data.targets[i];
    divs[4].textContent = `[${data.weights[i].join(",")},${data.bioses[i]}]`;

    card.appendChild(cardRowClone);
  }
  const cardNumber = card.querySelector(".card__number");
  cardNumber.textContent = number;
  cardContainer.appendChild(card);
};

// Check is weights equal to first one?
const isEqualArrays = (firstWeight, currentWeight) => {
  const result = firstWeight.every((_, i) => {
    return firstWeight[i] === currentWeight[i];
  });
  //   console.log(result);
  //   console.log(firstWeight, currentWeight);
  return result;
};

const startProcess = gate => {
  let counter = 1;
  let storedData = { ...STORED_DATA_DEFAULT };
  while (counter !== COUNTER_LIMIT + 1) {
    const firstWeightsBios = [...currentWeights, currentBios];
    let isFinish = true;
    for (let [target, ...xIn] of GATE[gate]) {
      const { changedWeight, changedBios, out, net } = calcOneRound(
        currentBios,
        target,
        xIn,
        currentWeights
      );
      // Stroe data in array, after finish complete round render card with data.
      storedData.xIns.push(xIn);
      storedData.nets.push(net);
      storedData.outs.push(out);
      storedData.targets.push(target);
      storedData.weights.push(changedWeight);
      storedData.bioses.push(changedBios);

      // Update weight and bios
      currentWeights = changedWeight;
      currentBios = changedBios;

      // Check finish condition
      if (isEqualArrays(firstWeightsBios, [...currentWeights, currentBios]))
        continue;
      isFinish = false;
    }
    // Render card
    renderCard(storedData, counter);

    // Reset store data
    storedData = {
      xIns: [],
      nets: [],
      outs: [],
      targets: [],
      weights: [],
      bioses: [],
    };

    // Finish condition
    if (isFinish) break;
    counter++;
  }
};
