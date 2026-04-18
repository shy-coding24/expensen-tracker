const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");

let transactions = [];
let total = 0;
let chart = null; 
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// render list + total
function renderList() {
  list.innerHTML = "";
  total = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="expense-info">
        <div class="expense-name">${escapeHtml(t.name)}</div>
        <div class="expense-meta">
          <span><i class="fas fa-folder-open"></i> ${escapeHtml(t.category)}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="expense-amount">Rp ${Number(t.amount).toLocaleString('id-ID')}</div>
        <button class="delete-btn" onclick="deleteTransaction(${index})"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    list.appendChild(li);

    total += parseInt(t.amount);
  });

  if (transactions.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-message";
    emptyLi.style.justifyContent = "center";
    emptyLi.innerHTML = `<i class="fas fa-receipt"></i> No expenses yet · add your first transaction ✨`;
    emptyLi.style.pointerEvents = "none";
    list.appendChild(emptyLi);
  }

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
    if (t.category === "Food") food += parseInt(t.amount);
    else if (t.category === "Transport") transport += parseInt(t.amount);
    else if (t.category === "Fun") fun += parseInt(t.amount);
  });

  return [food, transport, fun];
}

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
        data: data,
        backgroundColor: ['#3b8ea5', '#5f9c7b', '#e6b17e'],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 11, family: "'Inter', system-ui" },
            boxWidth: 10,
            padding: 12,
            color: '#2c4b5e'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              let value = context.raw;
              let totalAmount = data.reduce((a,b) => a+b, 0);
              let percentage = totalAmount > 0 ? ((value / totalAmount)*100).toFixed(1) : 0;
              return `${label}: Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
            }
          }
        }
      },
      layout: {
        padding: 10
      }
    }
  });
}
window.deleteTransaction = deleteTransaction;
