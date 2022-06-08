"use strcit";

let currentBios = 0;
const learningCurve = 1;

const changeWeight = (w, x, t) => {
  //   console.log(`w: ${w}, x: ${x}, t: ${t}`);
  //   console.log(w + learningCurve * x * t);
  return w + learningCurve * x * t;
};

const changeBios = (b, t) => {
  return b + learningCurve * t;
};

const calcNet = (xIn, wIn, b) => {
  const result = xIn.reduce((acc, currentX, i) => {
    return acc + currentX * wIn[i];
  }, 0);
  //   console.log(result);
  return b + result;
};
const calcOut = net => {
  //   if (net > 0.2) return 1;
  //   if (net < -0.2) return -1;
  //   return 0;
  if (net > 0) return 1;
  return -1;
};

const printOneRound = (xIn, alpha, net, out, weightChanged, biosChanged) => {
  console.log(net);
  console.log(
    `[${xIn.join(",")},${alpha}] | ${net} | ${out} | [${weightChanged.join(
      ","
    )} ,${biosChanged}]`
  );
};

const isEqualArrays = (main, lastWeight) => {
  const result = main.every((_, i) => {
    return main[i] === lastWeight[i];
  });
  return result;
};

const andQuest = [
  [1, 1, 1],
  [-1, 1, 0],
  [-1, 0, 1],
  [-1, 0, 0],
];
const orQuest = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [-1, 0, 0],
];
const xOrQuest = [
  [-1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [-1, 0, 0],
];
let currentWIn = [0, 0];
const calcOneRound = (b, [xAnswer, ...xValue], wIn) => {
  let changedWeight = [];
  let changedBios;
  //   console.log(wIn);
  const net = calcNet(xValue, wIn, b);
  const out = calcOut(net);
  //   console.log("wIn:" + wIn);
  //   console.log("net:" + net);
  if (xAnswer == out) {
    printOneRound(xValue, learningCurve, net, out, wIn, b);
    return {
      changedWeight: wIn,
      changedBios: b,
    };
  } else {
    console.log("have to change weight and bios");
    xValue.forEach((x, i) => {
      changedWeight.push(changeWeight(wIn[i], x, xAnswer));
    });
    changedBios = changeBios(b, xAnswer);

    printOneRound(xValue, learningCurve, net, out, changedWeight, changedBios);

    return {
      changedWeight,
      changedBios,
    };
  }
};

let current = 0;
while (current !== 1000) {
  console.log("salam");
  const mainWeightsBios = [currentWIn, currentBios];
  let flag = true;
  for (let xInAnswerQuest of xOrQuest) {
    const { changedWeight, changedBios } = calcOneRound(
      currentBios,
      xInAnswerQuest,
      currentWIn
    );

    console.log("--------------------------");
    currentWIn = changedWeight;
    currentBios = changedBios;

    if (isEqualArrays(mainWeightsBios, [currentWIn, currentBios])) continue;
    flag = false;
  }
  if (flag) break;
  current++;
}
console.log(current);
