/*=============================
      GLOBAL VARIABLES
=============================*/
let donors = JSON.parse(localStorage.getItem("donors")) || [];
let donations = JSON.parse(localStorage.getItem("donations")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let adminPassword = localStorage.getItem("adminPass") || "1111";

/*=============================
      PAGE SHOW/HIDE SYSTEM
=============================*/
function openSection(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function goHome() {
    openSection("dashboardPage");
}

/*=============================
        LOGIN SYSTEM
=============================*/
function loginAdmin() {
    let u = document.getElementById("loginUser").value;
    let p = document.getElementById("loginPass").value;

    if (u === "aaaa" && p === adminPassword) {
        localStorage.setItem("admin", "true");
        openSection("dashboardPage");
        loadDonorDropdown();
        loadDonorTable();
        loadDonationTable();
        loadExpenseTable();
    } else {
        alert("गलत यूज़रनेम या पासवर्ड!");
    }
}

function logout() {
    localStorage.removeItem("admin");
    openSection("loginPage");
}

/*=============================
        DONOR MANAGEMENT
=============================*/
function addDonor() {
    let name = document.getElementById("donorName").value.trim();
    if (name === "") return alert("नाम खाली नहीं हो सकता!");

    donors.push(name);
    localStorage.setItem("donors", JSON.stringify(donors));

    document.getElementById("donorName").value = "";
    loadDonorTable();
    loadDonorDropdown();
}

function deleteDonor(index) {
    if (!confirm("हटाना चाहते हैं?")) return;

    donors.splice(index, 1);
    localStorage.setItem("donors", JSON.stringify(donors));

    loadDonorTable();
    loadDonorDropdown();
}

function loadDonorTable() {
    let table = document.getElementById("donorTable");
    table.innerHTML = "<tr><th>नाम</th><th>Action</th></tr>";

    donors.forEach((d, i) => {
        table.innerHTML += `
            <tr>
                <td>${d}</td>
                <td><button onclick="deleteDonor(${i})">Delete</button></td>
            </tr>`;
    });
}

function searchDonorList() {
    let value = document.getElementById("searchDonor").value.toLowerCase();
    let rows = document.querySelectorAll("#donorTable tr");

    rows.forEach((row, index) => {
        if (index === 0) return;
        let name = row.children[0].innerText.toLowerCase();
        row.style.display = name.includes(value) ? "" : "none";
    });
}

function loadDonorDropdown() {
    let select = document.getElementById("donorSelect");
    select.innerHTML = "";

    donors.forEach(d => {
        select.innerHTML += `<option>${d}</option>`;
    });
}

/*=============================
        DONATION MANAGEMENT
=============================*/
function addDonation() {
    let donor = donorSelect.value;
    let month = donationMonth.value;
    let amount = donationAmount.value;

    if (amount === "" || amount <= 0) return alert("राशि सही डालें!");

    donations.push({ donor, month, amount: Number(amount) });
    localStorage.setItem("donations", JSON.stringify(donations));

    donationAmount.value = "";
    loadDonationTable();
}

function deleteDonation(i) {
    donations.splice(i, 1);
    localStorage.setItem("donations", JSON.stringify(donations));
    loadDonationTable();
}

function loadDonationTable() {
    let table = document.getElementById("donationTable");
    table.innerHTML = "<tr><th>नाम</th><th>महीना</th><th>राशि</th><th>Action</th></tr>";

    donations.forEach((d, i) => {
        table.innerHTML += `
        <tr>
            <td>${d.donor}</td>
            <td>${d.month}</td>
            <td>${d.amount} ₹</td>
            <td><button onclick="deleteDonation(${i})">Delete</button></td>
        </tr>`;
    });
}

/*=============================
        EXPENSE MANAGEMENT
=============================*/
function addExpense() {
    let detail = expDetail.value;
    let amount = expAmount.value;
    let month = expMonth.value;

    if (amount === "" || amount <= 0) return alert("राशि सही डालें!");

    expenses.push({ detail, amount: Number(amount), month });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    expDetail.value = "";
    expAmount.value = "";

    loadExpenseTable();
}

function deleteExpense(i) {
    expenses.splice(i, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenseTable();
}

function loadExpenseTable() {
    let table = document.getElementById("expenseTable");
    table.innerHTML = "<tr><th>विवरण</th><th>महीना</th><th>राशि</th><th>Action</th></tr>";

    expenses.forEach((e, i) => {
        table.innerHTML += `
        <tr>
            <td>${e.detail}</td>
            <td>${e.month}</td>
            <td>${e.amount} ₹</td>
            <td><button onclick='deleteExpense(${i})'>Delete</button></td>
        </tr>`;
    });
}

/*=============================
        REPORT CALCULATION
=============================*/
function calculateReport() {
    let totalDonation = donations.reduce((a, b) => a + b.amount, 0);
    let totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
    let balance = totalDonation - totalExpense;

    document.getElementById("totalDonation").innerText = totalDonation;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("finalBalance").innerText = balance;
}

/*=============================
      CHANGE PASSWORD
=============================*/
function changePassword() {
    let oldP = oldPass.value;
    let newP = newPass.value;

    if (oldP !== adminPassword) return alert("पुराना पासवर्ड गलत है!");

    adminPassword = newP;
    localStorage.setItem("adminPass", newP);

    alert("पासवर्ड बदल दिया गया!");
    oldPass.value = "";
    newPass.value = "";
}
function monthlyReport() {
    let month = document.getElementById("reportMonth").value;

    if (!month) {
        alert("पहले महीना चुनें!");
        return;
    }

    // उस महीने का कुल दान
    let monthDonations = donations.filter(d => d.month === month);
    let totalMonthDonation = monthDonations.reduce((a, b) => a + b.amount, 0);

    // उस महीने का कुल खर्च
    let monthExpenses = expenses.filter(e => e.month === month);
    let totalMonthExpense = monthExpenses.reduce((a, b) => a + b.amount, 0);

    // बैलेंस
    let balance = totalMonthDonation - totalMonthExpense;

    let html = `
        <h3>📅 ${month} का हिसाब</h3>
        <p><b>कुल दान:</b> ${totalMonthDonation} ₹</p>
        <p><b>कुल खर्च:</b> ${totalMonthExpense} ₹</p>
        <p><b>शेष राशि:</b> ${balance} ₹</p>

        <h4>💰 दान सूची</h4>
    `;

    monthDonations.forEach(d => {
        html += `<p>🧍 ${d.donor} → ${d.amount} ₹</p>`;
    });

    html += `<h4>📦 खर्च सूची</h4>`;

    monthExpenses.forEach(e => {
        html += `<p>📌 ${e.detail} → ${e.amount} ₹</p>`;
    });

    document.getElementById("monthResult").innerHTML = html;
}