const transactionsUl = document.querySelector('#transactions')
//console.log(transactionsUl) //metodo que verifica se a ul esta passando de forma correta

const incomeDisplay = document.querySelector('#money-plus') // id que mostra o total de receitas
const expenseDisplay = document.querySelector('#money-minus') // id que mostra o total de despesas
const balanceDisplay = document.querySelector('#balance') // id do h1 q mostra o saldo atual

const form = document.querySelector('#form')

//inputs que são usados para inserir informações na tela
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))

let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    //console.log(transactions) //verificando se esta removendo
    updateLocalStorage()
    init()
}

const addTransactionIntoDom = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CssClass = transaction.amount < 0 ? 'minus' : 'plus' // se o valor armazenado for menor que zero sera armazenado em minus, se for positivo em plus
    const amountWhithoutOperator = Math.abs(transaction.amount) //tranformando qqr valor negativo em positivo
    const li = document.createElement('li')

    //console.log(operator) //método para saber quais sinais estão passando pela função
    //console.log(li) // saber se a classe esta sendo colocada corretaente dentro da li

    li.classList.add(CssClass)
    li.innerHTML= `
    ${transaction.name} 
    <span>${operator} R$ ${amountWhithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
    </button>
    `

    transactionsUl.append(li)
}

const updateBalanceValues = () => {
    const transactionAmounts = transactions
    .map(transaction => transaction.amount) //gerando um novo array com todos os valores
    //console.log(transactionAmounts) // verificando se o array esta ok

    const total = transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)
    //console.log(total) // vendo se a const total esta funcionando corretamente

    const income = transactionAmounts //calculo do valor total das receitas
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)
    //console.log(income) // verificando se a soma das despesas esta funcionando

    const expense = Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)
    //console.log(expense) // verificando se a soma das despesas estao ok

    // inserindo os valores que devem ser mostrados no DOM
    //retornando saldo total
    balanceDisplay.textContent = `R$ ${total}`

    //retornando total de receitas
    incomeDisplay.textContent = `R$ ${income}`

    //retornando total despesas
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => { // funcao que ao iniciar adiciona as transações ao html
    transactionsUl.innerHTML =''
    transactions.forEach(addTransactionIntoDom)
    updateBalanceValues();
}
init();

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions)) //faz a mudança para astring antes de ser atribuida ao local storage
}

//inserção de gerador de id aleatorio
const generateId = () => Math.round(Math.random() * 1500)

const addTransactionsArray = (transactionName, transactionAmount) => { // adiciona as informacoes ao local storage
    transactions.push ({
        id: generateId(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () =>{ // limpa os inputs apos serem enviados
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit =  event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeEmpty) {
        alert('Por favor, preencha os dois campos para realizar a inserção dos valores na lista!') 
        return; // se algum dos botoes estiver vazio dispara uma alerta
    }

    addTransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();
}

init();
form.addEventListener('submit', handleFormSubmit)

//addTransactionIntoDom(transactions[0]) método inicial para saber se todo o codigo esta funcionando