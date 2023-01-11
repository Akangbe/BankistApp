"use script";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [`2019-11-18t2:31:17.178Z`],
};
const account2 = {
  owner: "Akangbe Henry",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};
const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};
const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
// let arr = ["a", "b", "c", "d", "e"];
// console.log(arr.slice(2));
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${
      i + 1
    }    ${type} </div>
          <div class="movements__value">#${mov.toFixed(2)}</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// creating username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((Name) => Name[0])
      .join("");
  });
};
const updateUI = function (acc) {
  //Display Movement
  displayMovements(acc.movements);
  //Display Balance
  calDisplayBalance(acc);

  //Display summary
  calDisplaySummary(acc);
};
const startLogTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //DECREASE
    time--;
  };
  //set time to 5 min
  let time = 100;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
createUsernames(accounts);
console.log(accounts);
//CREATING BALANCE
const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `#${acc.balance.toFixed(2)}`;
};

const calDisplaySummary = function (acc) {
  // For MONEY ENTERING
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `#${incomes.toFixed(2)}`;
  //FOR MONEY GOING OUT
  const output = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `#${Math.abs(output)}`;
  // FOR BANK INTEREST
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `#${interest.toFixed(2)}`;
};

let currentAccount, timer;
//fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

const now = new Date();
const option = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  // weekday: `long`,
};
const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(locale, option).format(now);
// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hours = `${now.getHours() + 1}`.padStart(2, 0);
// const min = `${now.getMinutes() + 1}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year} ${hours}:${min}`;
// Event handler FOR LOGIN
btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input field
    inputLoginUsername.value = inputLoginPin.value = "";
    inputClosePin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogTimer();

    //UPDATE UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);
      // update ui
      updateUI(currentAccount);
      //Reset timer
      clearInterval(timer);
      timer = startLogTimer();
    }, 2500);
  }
  inputLoanAmount.value = ``;
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // inputTransferAmount.value = inputTransferTo = "";
  inputTransferAmount.value = inputTransferTo.value = ``;
  // console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
    // clearInterval(timer);
    // timer = startLogTimer();
  }
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value === currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ``;
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(movements.includes(-130));
//PRACTICING
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);

// const depositfor = [];
// for (const mov of movements) if (mov > 0) depositfor.push(mov);
// console.log(depositfor);

// const widthdrawal = movements.filter((mov) => mov < 0);
// console.log(widthdrawal);

// const balance = movements.reduce((acc, curr, i) => acc + curr, 0);
// console.log(balance);

// //FOR OF LOOP
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// //maximum Value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// const euroToUSD = 1.1;
// const totalDepositeUSD = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * euroToUSD)
//   .reduce((mov, acc) => acc + mov, 0);

// console.log(totalDepositeUSD);
// console.log(owner.sort());
