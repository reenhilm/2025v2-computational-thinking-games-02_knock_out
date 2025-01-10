import createPrompt from 'prompt-sync';

//Main game function
function playKnockout(knockoutNumber, targetScore) {
    if (![6, 7, 8, 9].includes(knockoutNumber)) {
        throw new Error("Knockout number has to be either 6, 7, 8 or 9.");
    }

    const throwDice = () => Math.floor(Math.random() * 6) + 1;

    let currentScore = 0;
    let throwHistory = [];

    while (currentScore < targetScore) {
        //Throw two dice
        let dice1 = throwDice();
        let dice2 = throwDice();
        let sum = dice1 + dice2;

        throwHistory.push({ dice1, dice2, sum });

        //Update points
        if (sum === knockoutNumber) {
            //Minus points for knockout
            currentScore -= sum;
        }
        else {
            //Add points if avoided knockout
            currentScore += sum;
        }
    }

    return {
        totalThrows: throwHistory.length,
        historik: throwHistory,
        endPoints: currentScore,
    };
}

const isNumberInputValid = (input) => {
    return !isNaN(input) && isFinite(Number(input));
}

//High-order function to validate
const isNumberInputValidRange = (min, max) => {
    return (input) => {   
        if (!isNumberInputValid(input))
            return false;

        let numValue = Number(input);        
        if (numValue < min || numValue > max)
        {
            console.log("Invalid range! only 6, 7, 8 or 9 allowed");
            return false;
        }
        
        return true;
    }
}

const prompt = createPrompt();

let knockoutNumber = promptNumber(prompt, "Enter knockout number (6, 7, 8 or 9): ", isNumberInputValidRange(6,9), Number);
let targetScore = promptNumber(prompt, "Enter goal points: ", isNumberInputValid, Number);

function promptNumber(prompt, promptText, validator, transformer) {

    let bValidChoice, input;

    do
    {
        input = prompt(promptText); 
        //Validate user input
        if (!validator(input)) {
            bValidChoice = false;
            console.log("Invalid choice! Please enter valid number");
        }
        else
            bValidChoice = true;
    }
    while (!bValidChoice);

    return transformer ? transformer(input) : input;
}

//Start the game
const result = playKnockout(knockoutNumber, targetScore);

//Log result of game
console.log(`${result.totalThrows} throws to reach goal.`);
console.log("Throw history:", result.historik);
console.log(`End points: ${result.endPoints}`);
