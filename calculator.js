let display = document.getElementById('display');
let historyList = document.getElementById('historyList');
let calculationHistory = [];

// Function to append values to the display
function appendToDisplay(value) {
    display.value += value;
}

// Function to handle mathematical functions
function mathFunction(func) {
    display.value += func + '('; // Append function and open parenthesis
}

// Function to calculate the result
function calculate() {
    try {
        // Replace any instances of 'π' and 'e' with their respective values
        let expression = display.value.replace(/π/g, Math.PI).replace(/e/g, Math.E);
        
        // Convert degrees to radians for trigonometric functions
        expression = expression.replace(/sin\(([^)]+)\)/g, (match, p1) => `Math.sin(${p1} * Math.PI / 180)`);
        expression = expression.replace(/cos\(([^)]+)\)/g, (match, p1) => `Math.cos(${p1} * Math.PI / 180)`);
        expression = expression.replace(/tan\(([^)]+)\)/g, (match, p1) => `Math.tan(${p1} * Math.PI / 180)`);
        
        // Automatically close any unclosed parentheses
        let openParentheses = (expression.match(/\(/g) || []).length;
        let closeParentheses = (expression.match(/\)/g) || []).length;
        
        // If there are unclosed parentheses, add the necessary closing ones
        if (openParentheses > closeParentheses) {
            expression += ')'.repeat(openParentheses - closeParentheses);
        }

        // Evaluate the expression using math.js for safety
        let result = math.evaluate(expression); // Use math.js for evaluation
        let calculation = `${display.value} = ${result}`;
        addToHistory(calculation); // Add to history
        display.value = result; // Show result in display
    } catch (error) {
        display.value = 'Error'; // Handle errors
    }
}

// Function to add a calculation to history
function addToHistory(calculation) {
    calculationHistory.unshift(calculation); // Add to the beginning of the array
    if (calculationHistory.length > 10) {
        calculationHistory.pop(); // Limit history to the last 10 calculations
    }
    updateHistoryDisplay(); // Update the displayed history
}

// Function to update the history display
function updateHistoryDisplay() {
    historyList.innerHTML = ''; // Clear the current history display
    calculationHistory.forEach(calc => {
        let li = document.createElement('li'); // Create a new list item
        li.textContent = calc; // Set the text content to the calculation
        historyList.appendChild(li); // Append the list item to the history list
    });
}

// Function to clear the display
function clearDisplay() {
    display.value = '';
}

// Function to remove the last character from the display
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Function to paste text into the display
async function pasteEquation() {
    try {
        const text = await navigator.clipboard.readText();
        display.value = text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        alert('Unable to paste. Please check your browser permissions.');
    }
}

function calculateDerivative(expression) {
    // Extract the function and variable from derivative(f(x), x)
    let match = expression.match(/derivative\((.*),\s*(.*)\)/);
    if (match) {
        let func = match[1];
        let variable = match[2];
        return math.derivative(func, variable).toString();
    }
    throw new Error('Invalid derivative format');
}

function calculateIntegral(expression) {
    // Extract the function and variable from integrate(f(x), x)
    let match = expression.match(/integrate\((.*),\s*(.*)\)/);
    if (match) {
        let func = match[1];
        let variable = match[2];
        return math.integrate(func, variable).toString();
    }
    throw new Error('Invalid integral format');
}

function solveEquation(expression) {
    // Extract the equation from solve(equation, variable)
    let match = expression.match(/solve\((.*),\s*(.*)\)/);
    if (match) {
        let equation = match[1];
        let variable = match[2];
        return math.solve(equation, variable).toString();
    }
    throw new Error('Invalid equation format');
}

function animateButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const hue = Math.random() * 360;
        button.style.backgroundColor = `hsl(${hue}, 100%, 30%)`;
        button.style.color = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
    });
    animationFrame = requestAnimationFrame(animateButtons);
}

animateButtons();
 // Particle system
 const canvas = document.createElement('canvas');
 document.body.appendChild(canvas);
 canvas.style.position = 'fixed';
 canvas.style.top = '0';
 canvas.style.left = '0';
 canvas.style.pointerEvents = 'none';
 const ctx = canvas.getContext('2d');

 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;

 const particles = [];

 class Particle {
     constructor() {
         this.x = Math.random() * canvas.width;
         this.y = Math.random() * canvas.height;
         this.size = Math.random() * 5 + 1;
         this.speedX = Math.random() * 3 - 1.5;
         this.speedY = Math.random() * 3 - 1.5;
         this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
     }

     update() {
         this.x += this.speedX;
         this.y += this.speedY;

         if (this.size > 0.2) this.size -= 0.1;
     }

     draw() {
         ctx.fillStyle = this.color;
         ctx.beginPath();
         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
         ctx.fill();
     }
 }

 function handleParticles() {
     for (let i = 0; i < particles.length; i++) {
         particles[i].update();
         particles[i].draw();

         if (particles[i].size <= 0.2) {
             particles.splice(i, 1);
             i--;
         }
     }
 }

 function animate() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     if (particles.length < 100) {
         particles.push(new Particle());
     }
     handleParticles();
     requestAnimationFrame(animate);
 }

 animate();

 window.addEventListener('resize', () => {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
 });
