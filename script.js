class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.history = [];
    this.allClear();
  }

  allClear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  clearEntry() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" && operation !== "±") return;
    if (operation === "±") {
      this.toggleSign();
      this.updateDisplay();
      return;
    }
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const previous = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(previous) || isNaN(current)) return;
    switch (this.operation) {
      case "%":
        computation = previous % current;
        break;
      case "÷":
        computation = previous / current;
        break;
      case "*":
        computation = previous * current;
        break;
      case "-":
        computation = previous - current;
        break;
      case "+":
        computation = previous + current;
        break;
      default:
        return;
    }
    this.saveHistory(previous, this.operation, current, computation);
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  toggleSign() {
    if (this.currentOperand === "") return;
    this.currentOperand = this.currentOperand * -1;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }

  saveHistory(previous, operation, current, result) {
    const timestamp = new Date().toLocaleTimeString();
    this.history.push({ timestamp, previous, operation, current, result });
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyTableBody = document.querySelector("#history-table tbody");
    historyTableBody.innerHTML = "";
    this.history.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${entry.timestamp}</td>
          <td>${entry.previous} ${entry.operation} ${entry.current}</td>
          <td><button class="history-result">${entry.result}</button></td>
        `;
      historyTableBody.appendChild(row);
    });
    this.addHistoryEventListeners();
  }

  addHistoryEventListeners() {
    const historyButtons = document.querySelectorAll(".history-result");
    historyButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.currentOperand = this.history[index].result;
        this.updateDisplay();
      });
    });
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const clearEntryButton = document.querySelector("[data-clear-entry]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", () => {
  calculator.allClear();
  calculator.updateDisplay();
});

clearEntryButton.addEventListener("click", () => {
  calculator.clearEntry();
  calculator.updateDisplay();
});
