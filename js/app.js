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
    this.unitPrice = unitPrice;
    this.currentValue = initValue;
  }

  calResult(expectedTotalValue) {
    this.optimalValue = Math.floor(expectedTotalValue * this.proportion);
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

  get price() {
    return this.optimalValue * unitPrice;
  }

  get standardValue() {
    return this.currentValue;
  }

  get metricValue() {
    return this.currentValue;
  }

}

const catFood = {
  title: "猫食有鸡心",
  ingredients: [
    { name: "鸡腿", proportion: 0.22, unitPrice: 0, initValue: 1947 },
    { name: "鸡心", proportion: 0.15, unitPrice: 0, initValue: 1328 },
    { name: "鸡蛋", proportion: 0.09, unitPrice: 0, initValue: 797 },
    { name: "鸡肝", proportion: 0.043, unitPrice: 0, initValue: 381 },
    { name: "猪瘦肉", proportion: 0.156, unitPrice: 0, initValue: 1381 },
    { name: "牛肝", proportion: 0.04, unitPrice: 0, initValue: 354 },
    { name: "牛肉", proportion: 0.16, unitPrice: 0, initValue: 2743 },
    { name: "三文鱼", proportion: 0.108, unitPrice: 0, initValue: 956 },
    { name: "青口", proportion: 0.036, unitPrice: 0, initValue: 319 },
  ],
};

var ingredients = [];

function updateRecipeDisplay() {
  const ingredientsBlock = document.getElementById("ingredients");
  ingredientsBlock.innerHTML = "";
  ingredients.forEach((i, idx) => {
    ingredientsBlock.innerHTML += `
    <div class="col-12 ingredient">
      <h3 class="input-label">${i.name}</h3>
      <div class="input-group">
          <span>重量</span>
          <input type="number" placeholder="g" value="${i.currentValue}" name="${idx}-weight">
          <span>价格</span>
          <input type="number" placeholder="per pound" value="${i.unitPrice}" name="${idx}-price"}>
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
        <td>${i.optimalValue} g</td>
        <td>${i.actualValue} g</td>
        <td class="${i.status}__color">${i.note} ${i.diffValue} g</td>
      </tr>
    `;
  });
  optimaListBlock.innerHTML += `
    <tr>
      <td rowspan="2" colspan="2">总计</td>
      <td>重量</td>
      <td>20 g</td>
    </tr>
    <tr>
      <td>价格</td>
      <td>200 刀</td>
    </tr>
  `;
}

function findBestMedian() {
  var values = [];
  ingredients.forEach((i) => {
    expectedTotalValue = Math.floor(i.currentValue / i.proportion);
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

updateRecipe(catFood);

document.getElementById('calBtn').addEventListener('click', calculate);