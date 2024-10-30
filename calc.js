let currentOperand = '0';
        let previousOperand = '';
        let operation = undefined;
        let shouldResetScreen = false;

        const calculator = document.querySelector('.calculator');
        const currentOperandElement = document.querySelector('.current-operand');
        const previousOperandElement = document.querySelector('.previous-operand');
        const modeButtons = document.querySelectorAll('.mode-toggle button');

        function toggleMode(mode) {
            if (mode === 'scientific') {
                calculator.classList.add('scientific');
            } else {
                calculator.classList.remove('scientific');
            }
            
            modeButtons.forEach(button => {
                button.classList.remove('active');
                if (button.textContent.toLowerCase() === mode) {
                    button.classList.add('active');
                }
            });
        }

        function updateDisplay() {
            currentOperandElement.textContent = currentOperand;
            previousOperandElement.textContent = previousOperand;
        }

        function appendNumber(number) {
            if (shouldResetScreen) {
                currentOperand = '';
                shouldResetScreen = false;
            }
            if (number === '.' && currentOperand.includes('.')) return;
            if (currentOperand === '0' && number !== '.') {
                currentOperand = number;
            } else {
                currentOperand += number;
            }
            updateDisplay();
        }

        function appendConstant(constant) {
            switch (constant) {
                case 'π':
                    currentOperand = Math.PI.toString();
                    break;
                case 'e':
                    currentOperand = Math.E.toString();
                    break;
            }
            updateDisplay();
        }

        function appendOperator(operator) {
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                performCalculation();
            }
            operation = operator;
            previousOperand = `${currentOperand} ${operation}`;
            shouldResetScreen = true;
            updateDisplay();
        }

        function invertNumber() {
            currentOperand = (-parseFloat(currentOperand)).toString();
            updateDisplay();
        }

        function calculate(func) {
            const number = parseFloat(currentOperand);
            let result;

            switch (func) {
                case 'sin':
                    result = Math.sin(number * (Math.PI / 180));
                    break;
                case 'cos':
                    result = Math.cos(number * (Math.PI / 180));
                    break;
                case 'tan':
                    result = Math.tan(number * (Math.PI / 180));
                    break;
                case 'sqrt':
                    if (number < 0) {
                        alert("Cannot calculate square root of negative number!");
                        return;
                    }
                    result = Math.sqrt(number);
                    break;
                case 'log':
                    if (number <= 0) {
                        alert("Cannot calculate logarithm of non-positive number!");
                        return;
                    }
                    result = Math.log10(number);
                    break;
                case 'ln':
                    if (number <= 0) {
                        alert("Cannot calculate natural logarithm of non-positive number!");
                        return;
                    }
                    result = Math.log(number);
                    break;
                case 'abs':
                    result = Math.abs(number);
                    break;
                case 'fact':
                    if (number < 0 || !Number.isInteger(number)) {
                        alert("Factorial is only defined for positive integers!");
                        return;
                    }
                    result = factorial(number);
                    break;
            }

            currentOperand = result.toString();
            operation = undefined;
            previousOperand = '';
            updateDisplay();
        }

        function factorial(n) {
            if (n === 0 || n === 1) return 1;
            return n * factorial(n - 1);
        }

        function performCalculation() {
            if (shouldResetScreen || operation === undefined) return;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            if (isNaN(prev) || isNaN(current)) return;

            let computation;
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        alert("Cannot divide by zero!");
                        return;
                    }
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                case '^':
                    computation = Math.pow(prev, current);
                    break;
            }

            currentOperand = computation.toString();
            operation = undefined;
            previousOperand = '';
            shouldResetScreen = true;
            updateDisplay();
        }

        function clearDisplay() {
            currentOperand = '0';
            previousOperand = '';
            operation = undefined;
            shouldResetScreen = false;
            updateDisplay();
        }

        function deleteNumber() {
            if (currentOperand.length === 1) {
                currentOperand = '0';
            } else {
                currentOperand = currentOperand.slice(0, -1);
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9' || event.key === '.') {
                appendNumber(event.key);
            }
            if (event.key === '+' || event.key === '-') {
                appendOperator(event.key);
            }
            if (event.key === '*') {
                appendOperator('×');
            }
            if (event.key === '/') {
                event.preventDefault();
                appendOperator('÷');
            }
            if (event.key === 'Enter' || event.key === '=') {
                performCalculation();
            }
            if (event.key === 'Backspace') {
                deleteNumber();
            }
            if (event.key === 'Escape') {
                clearDisplay();
            }
            if (event.key === '%') {
                appendOperator('%');
            }
        });