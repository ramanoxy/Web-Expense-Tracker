const form = document.getElementById('transactionForm');
const list = document.getElementById('transactionList');


const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function saveTransactions(data) {
    localStorage.setItem('transactions', JSON.stringify(data));
}

function renderTransactions() {
    const transactions = getTransactions();
    list.innerHTML = '';

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(trx => {
        if (trx.type === 'income') totalIncome += trx.amount;
        if (trx.type === 'expense') totalExpense += trx.amount;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${trx.date}</td>
            <td>${trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</td>
            <td>${trx.title}</td>
            <td>Rp ${trx.amount.toLocaleString()}</td>
            <td>
            <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${trx.id})">Hapus</button>
            </td>
        `;

        list.appendChild(tr);
    });

    totalIncomeEl.textContent = `Rp ${totalIncome.toLocaleString()}`;
    totalExpenseEl.textContent = `Rp ${totalExpense.toLocaleString()}`;
    balanceEl.textContent = `Rp ${(totalIncome - totalExpense).toLocaleString()}`;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value;
    const amount = Number(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    const newTransaction = {
        id: Date.now(),
        type,
        title,
        amount,
        date
};

    const transactions = getTransactions();
    transactions.push(newTransaction);
    saveTransactions(transactions);


    form.reset();
    renderTransactions();
    renderChart();
});

function deleteTransaction(id) {
    let transactions = getTransactions();
    transactions = transactions.filter(trx => trx.id !== id);
    saveTransactions(transactions);
    renderTransactions();
    renderChart();
}

let chartInstance = null

function renderChart() {
    const transactions = getTransactions();

    let income = 0;
    let expense = 0;

    transactions.forEach(trx => {
        if (trx.type === 'income') income += trx.amount;
        if (trx.type === 'expense') expense += trx.amount;
    });

    const ctx = document.getElementById('expenseChart');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{
                data: [income, expense]
            }]
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderTransactions();
    renderChart();
});