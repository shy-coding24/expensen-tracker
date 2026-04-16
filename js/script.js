const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");
const totalDisplay = document.getElementById("total");
let total = 0;

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = nameInput.value;
  const amount = amountInput.value;
  const category = categoryInput.value;

  addTransaction(name, amount, category);

  form.reset();
});

function addTransaction(name, amount, category) {
  const li = document.createElement("li");

  li.innerHTML = `
    ${name} - Rp ${amount} (${category})
    <button onclick="deleteTransaction(this, ${amount})">X</button>
  `;

  list.appendChild(li);

  total += parseInt(amount);
  totalDisplay.textContent = total;
}

function deleteTransaction(button, amount) {
  button.parentElement.remove();

  total -= parseInt(amount);
  totalDisplay.textContent = total;
}
