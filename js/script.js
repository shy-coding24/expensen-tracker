const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");
let total = 0;
let transactions = [];
let chart;

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = nameInput.value;
  const amount = amountInput.value;
  const category = categoryInput.value;

  addTransaction(name, amount, category);

  form.reset();
});

function addTransaction(name, amount, category) {
  const transaction = { name, amount, category };
  transactions.push(transaction);

  saveToLocalStorage();
  renderList();
}

function renderList() {
  list.innerHTML = "";
  total = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${t.name} - Rp ${t.amount} (${t.category})
      <button onclick="deleteTransaction(${index})">X</button>
    `;

    list.appendChild(li);

    total += parseInt(t.amount);
  });

  totalDisplay.textContent = total;

  renderChart();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);

  saveToLocalStorage();
  renderList();
}

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("transactions");

  if (data) {
    transactions = JSON.parse(data);
    renderList();
  }
}

loadFromLocalStorage();

function getCategoryData() {
  let food = 0;
  let transport = 0;
  let fun = 0;

  transactions.forEach(t => {
    if (t.category === "Food") {
      food += parseInt(t.amount);
    } else if (t.category === "Transport") {
      transport += parseInt(t.amount);
    } else if (t.category === "Fun") {
      fun += parseInt(t.amount);
    }
  });

  return [food, transport, fun];
}
let chart;

function renderChart() {
  const data = getCategoryData();

  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Food", "Transport", "Fun"],
      datasets: [{
        data: data
      }]
    }
  });
}
