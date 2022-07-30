// no heart change
function noHeartChange() {
    if (form.noHeart.checked) {
        heartView.classList.add("d-none");
        heartView.classList.remove("d-flex");
        heartInput.classList.add("d-none");
        valChange();
    } else {
        heartView.classList.add("d-flex");
        heartView.classList.remove("d-none");
        heartInput.classList.remove("d-none");
        valChange();
    }
}

function changeDisplay(elt, val, diff) {
    elt.querySelectorAll("h6")[0].innerText = val + " g";
    const diffVal = elt.querySelectorAll("small")[0];
    diffVal.innerText = diff + " g";
    if (diff < 0) {
        diffVal.classList.add("text-danger");
        diffVal.classList.remove("text-success");
    } else {
        diffVal.classList.add("text-success");
        diffVal.classList.remove("text-danger");
    }
}

function findBestMedian(values) {
    values.sort((a, b) => {
        return a - b;
    });
    
    while(values[0] == 0) {
        values.shift(0);
    }
    var half = Math.floor(values.length / 2);
      
    if (values.length % 2) {
        return values[half];
    }
      
    return (values[half - 1] + values[half]) / 2;
}

function valChange(){
    var current = [form.legVal.value, form.heartVal.value, form.eggVal.value, form.chickenLiverVal.value, form.leanVal.value, form.beefLiverVal.value, form.beefVal.value, form.fishVal.value, form.musselVal.value];
    var need = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var diff = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var proportion = [0.22, 0.15, 0.09, 0.043, 0.156, 0.04, 0.16, 0.108, 0.036];

    var total = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    if (form.noHeart.checked) {
        proportion[6] += proportion[1];
        current[1] = 0;
    }

    for (var i = 0; i < 9; i++) {
        total[i] = Math.floor(current[i]/proportion[i]);
    }

    const median = findBestMedian(total);

    for (var i = 0; i < 9; i++) {
        need[i] = Math.floor(median * proportion[i]);
    }

    for (var i = 0; i < 9; i++) {
        diff[i] = current[i] - need[i];
    }

    if (form.noHeart.checked) {
        need[1] = 0;
        diff[1] = 0;
    }

    changeDisplay(legDisplay, need[0], diff[0]);
    changeDisplay(heartDisplay, need[1], diff[1]);
    changeDisplay(eggDisplay, need[2], diff[2]);
    changeDisplay(chickenLiverDisplay, need[3], diff[3]);
    changeDisplay(leanDisplay, need[4], diff[4]);
    changeDisplay(beefLiverDisplay, need[5], diff[5]);
    changeDisplay(beefDisplay, need[6], diff[6]);
    changeDisplay(fishDisplay, need[7], diff[7]);
    changeDisplay(musselDisplay, need[8], diff[7]);

    const bestVal = need.reduce((pv, cv) => {
        return cv + pv;
    }, 0)
    totalDisplay.innerText = bestVal + " g";
    totalNumDisplay.innerText = diff.reduce((pv, cv) => {
        if (cv > 0) {
            return pv;
        }
        return cv + pv;
    }, bestVal) + " g";
}

const form = document.getElementById("form");
const heartView = document.getElementById("heartView");
const heartInput = document.getElementById("heartInput");
form.noHeart.addEventListener('change', noHeartChange);

const legDisplay = document.getElementById("legDisplay");
const heartDisplay = document.getElementById("heartDisplay");
const eggDisplay = document.getElementById("eggDisplay");
const chickenLiverDisplay = document.getElementById("chickenLiverDisplay");
const leanDisplay = document.getElementById("leanDisplay");
const beefLiverDisplay = document.getElementById("beefLiverDisplay");
const beefDisplay = document.getElementById("beefDisplay");
const fishDisplay = document.getElementById("fishDisplay");
const musselDisplay = document.getElementById("musselDisplay");
const totalDisplay = document.getElementById("totalDisplay");
const totalNumDisplay = document.getElementById("totalNumDisplay");

form.legVal.addEventListener('change', valChange);
form.heartVal.addEventListener('change', valChange);
form.eggVal.addEventListener('change', valChange);
form.chickenLiverVal.addEventListener('change', valChange);
form.leanVal.addEventListener('change', valChange);
form.beefLiverVal.addEventListener('change', valChange);
form.beefVal.addEventListener('change', valChange);
form.fishVal.addEventListener('change', valChange);
form.musselVal.addEventListener('change', valChange);
