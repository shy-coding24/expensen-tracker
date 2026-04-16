const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");

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
    <button onclick="deleteTransaction(this)">X</button>
  `;

  list.appendChild(li);
}

function deleteTransaction(button) {
  button.parentElement.remove();
}
