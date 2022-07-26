

const bal_el = document.querySelector(".balance .value");
const total_inc_el = document.querySelector(".income-total");
const total_out_el = document.querySelector(".outcome-total");
const inc_el = document.querySelector("#income");
const ex_el = document.querySelector("#expense");
const all_el = document.querySelector("#all");
const inc_li = document.querySelector("#income .list");
const exp_li = document.querySelector("#expense .list");
const all_li = document.querySelector("#all .list");


const ex_btn = document.querySelector(".tab1");
const inc_btn = document.querySelector(".tab2");
const all_btn = document.querySelector(".tab3");


const add_expense = document.querySelector(".add-expense");
const exp_title = document.getElementById("expense-title-input");
const exp_amount = document.getElementById("expense-amount-input");

const add_income = document.querySelector(".add-income");
const inc_income = document.getElementById("income-title-input");
const inc_amount = document.getElementById("income-amount-input");


let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();


ex_btn.addEventListener("click", function(){
    show(ex_el);
    hide( [inc_el, all_el] );
    active( ex_btn );
    inactive( [inc_btn, all_btn] );
})
inc_btn.addEventListener("click", function(){
    show(inc_el);
    hide( [ex_el, all_el] );
    active( inc_btn );
    inactive( [ex_btn, all_btn] );
})
all_btn.addEventListener("click", function(){
    show(all_el);
    hide( [inc_el, ex_el] );
    active( all_btn );
    inactive( [inc_btn, ex_btn] );
})

add_expense.addEventListener("click", function(){
  
    if(!exp_title.value || !exp_amount.value ) return;

    
    let expense = {
        type : "expense",
        title : exp_title.value,
        amount : parseInt(exp_amount.value)
    }
    ENTRY_LIST.push(expense);

    updateUI();
    clearInput( [exp_title, exp_amount] )
})

add_income.addEventListener("click", function(){
   
    if(!inc_income.value || !inc_amount.value ) return;

    let income = {
        type : "income",
        title : inc_income.value,
        amount : parseInt(inc_amount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [inc_income, inc_amount] )
})

inc_li.addEventListener("click", deleteOrEdit);
exp_li.addEventListener("click", deleteOrEdit);
all_li.addEventListener("click", deleteOrEdit);



function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        inc_amount.value = ENTRY.amount;
        inc_income.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        exp_amount.value = ENTRY.amount;
        exp_title.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI(){
    income = total_cal("income", ENTRY_LIST);
    outcome = total_cal("expense", ENTRY_LIST);
    balance = Math.abs(bal_cal(income, outcome));

   
    let sign = (income >= outcome) ? "$" : "-$";

    
    bal_el.innerHTML = `<small>${sign}</small>${balance}`;
    total_out_el.innerHTML = `<small>$</small>${outcome}`;
    total_inc_el.innerHTML = `<small>$</small>${income}`;

    clearElement( [exp_li, inc_li, all_li] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(exp_li, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry(inc_li, entry.type, entry.title, entry.amount, index)
        }
        showEntry(all_li, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function total_cal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function bal_cal(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}

function hide( elements ){
    elements.forEach( element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements ){
    elements.forEach( element => {
        element.classList.remove("active");
    })
}