const symbols = [
    'Cherry',
    'Lemon',
    'Bell',
    'Bar',
    'Seven',
];

let accountBalance = 100;

const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3'), document.getElementById('reel4')];
const spinButton = document.getElementById('spin');
const betAmountInput = document.getElementById('betAmount');
const resultDisplay = document.getElementById('result');
const accountDisplay = document.getElementById('account');

spinButton.addEventListener('click', spinReels);

function spinReels() {
    const betAmount = parseInt(betAmountInput.value, 10);
    if (isNaN(betAmount) || betAmount < 2 || betAmount > 10) {
        resultDisplay.textContent = 'Zadejte prosím platnou částku mezi 2 a 10 Kč.';
        return;
    }

    if (accountBalance < betAmount) {
        resultDisplay.textContent = 'Nemáte dostatek peněz na vsazení.';
        return;
    }

    spinButton.disabled = true;

    const spinPromises = reels.map(reel => spinReel(reel));

    Promise.all(spinPromises)
        .then(results => {
            const winAmount = calculateWin(betAmount, results);
            updateAccount(winAmount - betAmount);
            displayResult(winAmount, results);
        })
        .finally(() => {
            spinButton.disabled = false;
        });
}

function spinReel(reel) {
    reel.innerHTML = '';
    const symbolsToShow = 4;

    const spinInterval = 200;

    return new Promise(resolve => {
        let currentSymbol = 0;

        const spinIntervalId = setInterval(() => {
            const symbolIndex = Math.floor(Math.random() * symbols.length);
            const img = document.createElement('img');
            img.src = `./img/${symbols[symbolIndex].toLowerCase()}.jpg`;
            img.alt = symbols[symbolIndex];
            reel.appendChild(img);

            currentSymbol++;

            if (currentSymbol === symbolsToShow) {
                clearInterval(spinIntervalId);
                resolve(symbolIndex);
            }
        }, spinInterval);
    });
}
function calculateWin(betAmount, results) {
    // Podmínky na výhru pro symboly vedle sebe nebo v kříži
    if (
        (results[0] === results[1] && results[1] === results[2] && results[2] === results[3]) // Výhra pro čtyři stejné symboly
    ) {
        return betAmount * 15; // Výhra pro čtyři stejné symboly
    } else if (
        (results[0] === results[1] && results[1] === results[2]) || // Výhra pro symboly vedle sebe
        (results[0] === results[1] && results[2] === results[3]) || // Výhra pro křížové symboly
        (results[1] === results[2] && results[2] === results[3]) // Výhra pro symboly vedle sebe
    ) {
        return betAmount * 10; // Výhra pro shodu tří symbolů vedle sebe nebo v kříži
    } else if (
        (results[0] === results[1]) || // Výhra pro dva stejné symboly vedle sebe
        (results[1] === results[2]) || // Výhra pro dva stejné symboly vedle sebe
        (results[2] === results[3]) // Výhra pro dva stejné symboly vedle sebe
    ) {
        return betAmount * 5; // Výhra pro shodu dvou symbolů vedle sebe
    } else {
        return 0; // Prohra
    }
}


function updateAccount(amount) {
    accountBalance += amount;
    accountDisplay.textContent = `Aktuální stav účtu: ${accountBalance} Kč`;
}

function displayResult(winAmount, results) {
    const winSymbols = getWinningSymbols(results);
    if (winAmount > 0 && winSymbols.length > 0) {
        resultDisplay.innerHTML = `Gratulujeme, vyhráli jste ${winAmount} Kč!`;
    } else {
        resultDisplay.textContent = `Bohužel, prohráli jste. Zkuste to znovu.`;
    }
}

function getWinningSymbols(results) {
    return results.map(result => symbols[result]);
}












