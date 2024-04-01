const budget = [];

const form = document.querySelector('#form');
const type = document.querySelector('#type');
const title = document.querySelector('#title');
const value = document.querySelector('#value');

const incomsList = document.querySelector('#incomes-list');
const expensesList = document.querySelector('#expenses-list');

const budgetEl = document.querySelector('#budget');
const incomeEl = document.querySelector('#total-income');
const expenceEl = document.querySelector('#total-expense');
const percentsEl = document.querySelector('#expense-percents-wrapper');

const monthEl = document.querySelector('#month');
const yearEl = document.querySelector('#year');

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD', 
    maximumFractionDigits: 0,
});

function insertTestData() {
    testData = [
        {type: 'inc', title: 'Фриланс', value: 1500},
        {type: 'inc', title: 'Зарплата', value: 2000},
        {type: 'inc', title: 'Бизнес', value: 2000},
        {type: 'inc', title: 'Рента', value: 1000},
        {type: 'exp', title: 'Продукты', value: 300},
        {type: 'exp', title: 'Кафе', value: 200},
        {type: 'exp', title: 'Транспорт', value: 200},
        {type: 'exp', title: 'Квартира', value: 500},
    ];
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    const randomIndex = getRandomInt(testData.length);
    const randomData = testData[randomIndex];
    type.value = randomData.type;
    title.value = randomData.title;
    value.value = randomData.value;
}

function clearForm() {
    form.reset();
}

function calcBudget() {
    const totalIncome = budget.reduce(function(total, element) {
        if (element.type === 'inc') {
            return total + element.value;
        } else { 
            return total;
        }
    }, 0)
    const totalExpence = budget.reduce(function(total, element) {
        if (element.type === 'exp') {
            return total + element.value;
        } else { 
            return total;
        }
    }, 0)

    const totalBudget = totalIncome - totalExpence;
    let expencePercents = 0;
    if (totalIncome) {
        expencePercents = Math.round((totalExpence * 100) / totalIncome);
    }

    budgetEl.innerHTML = priceFormatter.format(totalBudget);
    incomeEl.innerHTML = '+ ' + priceFormatter.format(totalIncome);
    expenceEl.innerHTML = '- ' + priceFormatter.format(totalExpence);
    if (expencePercents) {
        const html = `<div class="badge">{${expencePercents}%}</div>`;
        percentsEl.innerHTML = html;
    }   else {
        percentsEl.innerHTML = '';
    }
}

function displayMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const timeFormatter = new Intl.DateTimeFormat('ru-Ru', {
        month: 'long'
    })
    const month = timeFormatter.format(now)
    monthEl.innerHTML = month;
    yearEl.innerHTML = year;
}

displayMonth()
insertTestData();
calcBudget();

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (title.value.trim() === '') {
        title.classList.add('form__input--error');
        return;
    } else {
        title.classList.remove('form__input--error');
    }

    if (value.value === '' || +value.value <= 0) {
        value.classList.add('form__input--error');
        return;
    } else {
        value.classList.remove('form__input--error');
    }

    let id = 1;
    if (budget.length) {
        const lastElement = budget[budget.length - 1];
        const lastElId = lastElement.id;
        id = lastElId + 1;
    }
    const record = {
        id: id,
        type: type.value,
        title: title.value.trim(),
        value: +value.value,
    };
    budget.push(record);

    if (record.type === 'inc') {
        const html = `  <li data-id="${record.id}" class="budget-list__item item item--income">
                            <div class="item__title">${record.title}</div>
                            <div class="item__right">
                                <div class="item__amount">+ ${priceFormatter.format(record.value)}</div>
                                <button class="item__remove">
                                    <img
                                        src="./img/circle-green.svg"
                                        alt="delete"
                                    />
                                </button>
                            </div>
                        </li>`;
        incomsList.insertAdjacentHTML('afterbegin', html);
    }

    if (record.type === 'exp') {
        const html = `  <li data-id="${record.id}" class="budget-list__item item item--expense">
                            <div class="item__title">${record.title}</div>
                            <div class="item__right">
                                <div class="item__amount">
                                    - ${priceFormatter.format(record.value)}
                                </div>
                                <button class="item__remove">
                                    <img src="./img/circle-red.svg" alt="delete" />
                                </button>
                            </div>
                        </li>`;
        expensesList.insertAdjacentHTML('afterbegin', html);
    }
    clearForm();
    insertTestData();
    calcBudget();
})

document.body.addEventListener('click', function(e) {
    if (e.target.closest('button.item__remove')) {
        const recordElement = e.target.closest('li.budget-list__item');
        const id = +recordElement.dataset.id;
        const index = budget.findIndex(function(element){
            if (id === element.id) {
                return true
            }
        })
        budget.splice(index, 1);
        recordElement.remove();
        calcBudget();
    }
})