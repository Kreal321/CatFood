/**
 *
 * name, proportion, unitPrice, currentValue, optimalValue
 */
class Ingredient {
  constructor(name, proportion, unitPrice, initValue) {
    this.name = name;
    this.proportion = proportion;
    this.unitPrice = unitPrice;
    this.currentValue = initValue;
    this.optimalValue = initValue;
    this.diffValue = 0;
    this.actualValue = 0;
    this.note = "";
    this.status = "success";
  }

  updateData(unitPrice, initValue) {
    this.unitPrice = parseFloat(unitPrice);
    this.currentValue = parseFloat(initValue);
  }

  calResult(expectedTotalValue) {
    this.optimalValue = expectedTotalValue * this.proportion;
    this.diffValue = this.currentValue - this.optimalValue;
    if (this.diffValue < 0) {
      this.diffValue = -this.diffValue;
      if (this.diffValue > 200) {
        this.status = "danger";
        this.note = "需要采购";
      } else {
        this.status = "warning";
        this.note = "缺少";
      }
      this.actualValue = this.currentValue;
    } else {
      this.status = "success";
      this.note = "富余";
      this.actualValue = this.optimalValue;
    }
    
  }

  changeUnitTo (u) {
    if (u == METRIC) {
      this.currentValue = this.currentValue / 453.6;
      this.unitPrice = this.unitPrice * 453.6;
    } else if (u == STANDARD) {
      this.currentValue = this.currentValue * 453.6;
      this.unitPrice = this.unitPrice / 453.6;
    }
  }

  get price() {
    return this.actualValue * this.unitPrice;
  }

  get standardValue() {
    return this.currentValue;
  }

  get metricValue() {
    return this.currentValue;
  }

}

var ingredients = [];
const METRIC = 0, STANDARD = 1;
const unitSign = {
  0: "g",
  1: "lb",
};
var unit = recipes.unit;

const standardUnitBtn = document.getElementById('StandardUnitBtn');
const metricUnitBtn = document.getElementById('MetricUnitBtn');

function updateRecipeDisplay() {
  const ingredientsBlock = document.getElementById("ingredients");
  ingredientsBlock.innerHTML = "";
  ingredients.forEach((i, idx) => {
    ingredientsBlock.innerHTML += `
    <div class="col-12 ingredient">
      <h3 class="input-label">${i.name}</h3>
      <div class="input-group">
          <span>重量</span>
          <input type="number" placeholder="${unitSign[unit]}" value="${i.currentValue.toFixed(2)}" name="${idx}-weight">
          <span>价格</span>
          <input type="number" placeholder="per ${unitSign[unit]}" value="${i.unitPrice.toFixed(2)}" name="${idx}-price"}>
      </div>
    </div>
    `;
  });
  const optimaListBlock = document.getElementById("optimalList");
  optimaListBlock.innerHTML = "";
  ingredients.forEach((i) => {
    optimaListBlock.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>${i.optimalValue.toFixed(2)} ${unitSign[unit]}</td>
        <td>${i.actualValue.toFixed(2)} ${unitSign[unit]}</td>
        <td class="${i.status}__color">${i.note} ${i.diffValue.toFixed(2)} ${unitSign[unit]}</td>
      </tr>
    `;
  });

  const weight = ingredients.reduce((pv, cv)=>{
    return pv + cv.currentValue;
  }, 0);

  const cost = ingredients.reduce((pv, cv)=>{
    return pv + cv.price;
  }, 0);

  optimaListBlock.innerHTML += `
    <tr>
      <td rowspan="2" colspan="2">总计</td>
      <td>重量</td>
      <td>${weight.toFixed(2)} ${unitSign[unit]}</td>
    </tr>
    <tr>
      <td>价格</td>
      <td>${cost.toFixed(2)} 刀</td>
    </tr>
  `;

  if (unit == METRIC) {
    standardUnitBtn.classList.remove('active');
    metricUnitBtn.classList.add('active');
  } else {
    standardUnitBtn.classList.add('active');
    metricUnitBtn.classList.remove('active');
  }

}

function findBestMedian() {
  var values = [];
  ingredients.forEach((i) => {
    expectedTotalValue = i.currentValue / i.proportion;
    if (expectedTotalValue != 0) {
      values.push(expectedTotalValue);
    }
  })

  values.sort((a, b) => {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2;
}

function calOptimalResult() {
  const expectedTotalValue = findBestMedian();
  for (var i = 0; i < ingredients.length; i++) {
    ingredients[i].calResult(expectedTotalValue);
  }
}


function updateIngredientsData() {
  const form = document.getElementById('form');
  for (var i = 0; i < ingredients.length; i++) {
    ingredients[i].updateData(form[i+'-price'].value, form[i+'-weight'].value);
  }
}

function calculate() {
  updateIngredientsData();
  calOptimalResult();
  updateRecipeDisplay();
}


function updateRecipe(recipe) {
  ingredients = [];

  recipe.ingredients.forEach((i) => {
    ingredients.push(
      new Ingredient(i.name, i.proportion, i.unitPrice, i.initValue)
    );
  });

  calOptimalResult();
  updateRecipeDisplay();
}

updateRecipe(recipes.recipes[1]);

document.getElementById('calBtn').addEventListener('click', calculate);


function unitChange() {
  if (this.id == "StandardUnitBtn" && unit == METRIC) {
    for(var i = 0; i < ingredients.length; i++) {
      ingredients[i].changeUnitTo(METRIC);
    }
    unit = STANDARD;
    calOptimalResult();
    updateRecipeDisplay();
  } else if (this.id == "MetricUnitBtn" && unit == STANDARD) {
    for(var i = 0; i < ingredients.length; i++) {
      ingredients[i].changeUnitTo(STANDARD);
    }
    unit = METRIC;
    calOptimalResult();
    updateRecipeDisplay();
  } 
}



standardUnitBtn.addEventListener('click', unitChange);
metricUnitBtn.addEventListener('click', unitChange);