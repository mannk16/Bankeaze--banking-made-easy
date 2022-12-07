"use strict";

// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2,
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, -8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector(".Welcome-text");
const labelDate = document.querySelector(".date-time");
const labelBalance = document.querySelector(".balance-amount");

const labelArrow = document.querySelector(".arrow");
const labelSumIn = document.querySelector(".movements-amount.in");
const labelSumOut = document.querySelector(".text-out");
const labelSumInterest = document.querySelector(".movements-amount.interest");
const labelTimer = document.querySelector(".timing");
const labelContainer = document.querySelector(".container");

const inputUser = document.querySelector(".user");
const inputPin = document.querySelector(".pin");
const inputTransferTo = document.querySelector(".input-one.transferto");
const inputTransferAmount = document.querySelector(".input-two.transferamount");
const inputRequestLoan = document.querySelector(".input-one.requestloan");
const inputCloseUser = document.querySelector(".input-one.closeuser");
const inputCloserPin = document.querySelector(".input-two.closepin");
const buttonTransferAmount = document.querySelector(".arrow-right.transfer");
const buttonRequestLoanAmount = document.querySelector(
  ".arrow-right.requestloan"
);
const buttonCloseAmount = document.querySelector(".arrow-right.close");
const buttonSorted = document.querySelector(".sort-now");

const containerApp = document.querySelector(".display");
const containerMovements = document.querySelector(".display-content");

//Writing dates

const formatMovementDate = function (date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDayPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//currency function:
const formattedcurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
/////writing DOM

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerApp.innerHTML = "";
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawl";

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formattedcurr(mov, acc.locale, acc.currency);
    const html = `<div class="display-content">
        <div class="left-display">
          <span class="transaction-display ${type}">${i + 1} ${type}</span>
          <span class="date">${displayDate}</span>
        </div>
        
        <div class="right-display">
          <span class="display-amount">${formattedMov} </span>
        </div>
      </div>
      <hr />
`;
    containerApp.insertAdjacentHTML("afterbegin", html);
  });
};

// displayMovements(account1.movements);

//Username:

const createUseNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (name) {
        return name[0];
      })
      .join("");
  });
};

createUseNames(accounts);
console.log(accounts);

//Displaying the current balance by using the reduce method:
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);

  labelBalance.textContent = formattedcurr(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// calcPrintBalance(account1.movements);

//calculating ins outs and interest

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedcurr(incomes, acc.locale, acc.currency);

  const outgoing = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formattedcurr(outgoing, acc.locale, acc.currency);

  //On each deposits we are getting an interest rate

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedcurr(
    interest,
    acc.locale,
    acc.currency
  );
};

// calcDisplaySummary(account1.movements);

//Login functionality:

//Timer functionality

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call print the remaining time to User interface
    labelTimer.textContent = `${min}:${sec}`;
    //Decrease time

    //When 0 time stop timer and log out user

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = "Login to get started";
      labelContainer.style.opacity = 0;
    }
    time--;
  };
  //Set the time to five minutes

  let time = 300;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const updateUI = function (acc) {
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
  displayMovements(acc);
};

//logins

let currentAccount, timer;

labelArrow.addEventListener("click", function (e) {
  //Prevents form from submitting
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === inputUser.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputPin.value)) {
    //Display ui and welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    labelContainer.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //clearing input fields

    inputUser.value = inputPin.value = "";

    //display balance

    //display summary
    //display movements

    //Logouttimer to be startted
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();

    //simply call update ui
    updateUI(currentAccount);
  }
});

//Transfer implementation
buttonTransferAmount.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveraccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, receiveraccount);

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiveraccount &&
    currentAccount.balance >= amount &&
    receiveraccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveraccount.movements.push(amount);

    //Add current dates
    currentAccount.movementsDates.push(new Date());
    receiveraccount.movementsDates.push(new Date());

    //Update ui
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//Request loan account functionality:

buttonRequestLoanAmount.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputRequestLoan.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //ADD MOVEMENT

    setTimeout(function () {
      currentAccount.movements.push(amount);

      //Add Loan Date:

      currentAccount.movementsDates.push(new Date());

      //UPDATE UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputRequestLoan.value = "";
});

//close account functionality

buttonCloseAmount.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUser.value === currentAccount.username &&
    Number(inputCloserPin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    //Delet account
    accounts.splice(index, 1);

    //Hide UI
    labelContainer.style.opacity = 0;
  }
  inputCloseUser.value = inputCloserPin.value = "";
});

//sort button:
let sort = false;
buttonSorted.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;
});

//setting up dates
