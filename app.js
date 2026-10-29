const boxes = document.querySelectorAll(".boxes");
let isTurnO = false;
let suceed = false;
const winnPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let gameDrawn = false;
let winPatrnDivs = [];

document.querySelectorAll('input[name="choseTurn"]').forEach(radio => {
    radio.addEventListener('change', e => {
        isTurnO = e.target.value === "0"; // true if O, false if X
        toogleXorO();
    });
});

document.getElementById("continue").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
});

//game's logic
let scoreX = 0;
let scoreO = 0;
let scoreTie = 0;

// Update scoreboard UI
const updateScoreboard = () => {
    document.getElementById("updtX").innerText = `${scoreX}`;
    document.getElementById("updtO").innerText = `${scoreO}`;
    document.getElementById("updtTie").innerText = `${scoreTie}`;
};

const triggerBorderPulse = (element) => {
    if (!element) return;

    // 1. Remove class to reset state
    element.classList.remove('border-pulse');

    // 2. Force reflow (Magic line to restart animation)
    void element.offsetWidth;

    // 3. Add the new class
    element.classList.add('border-pulse');
}

boxes.forEach((box, index) => {  // click box
    box.addEventListener("click", () => {
        if (isTurnO === true) {
            box.innerText = "O";
            isTurnO = false;
        }
        else {
            box.innerText = "X";
            isTurnO = true;
        }

        box.disabled = true;

        toogleXorO();
        checkWinner();
    });
});

const checkWinner = () => {
    for (let patterns of winnPatterns) {
        let pos1Val = boxes[patterns[0]].innerText;
        let pos2Val = boxes[patterns[1]].innerText;
        let pos3Val = boxes[patterns[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                console.log("winner", pos1Val);
                suceed = true;
                boxes.forEach((box) => box.disabled = true);

                if (pos1Val === "X") {
                    scoreX++; triggerBorderPulse(document.getElementById("scoreX"));
                }
                else { scoreO++; triggerBorderPulse(document.getElementById("scoreO")); }

                updateScoreboard();
                winPatrnDivs = [boxes[patterns[0]], boxes[patterns[1]], boxes[patterns[2]]];
                drawLine();
                toggleBlink(true);
            }
        }
    }

    if (!suceed && [...boxes].every(box => box.innerText !== "")) {
        scoreTie++;
        triggerBorderPulse(document.getElementById("tie"));
        updateScoreboard();
        toggleBlink(true);
        gameDrawn = true;
        console.log("Game continues after draw, last move stays!");
    }

};

// for reset butn blink
const resetBtn = document.getElementById("resetButton");

const toggleBlink = (shouldBlink) => {
    if (shouldBlink) {
        resetBtn.classList.add("blinking");
    } else {
        resetBtn.classList.remove("blinking");
    }
};

// Draw line 
function drawLine() {
    if (winPatrnDivs.length === 3) {
        const rect1 = winPatrnDivs[0].getBoundingClientRect();
        const rect3 = winPatrnDivs[2].getBoundingClientRect();
        const rectMid = winPatrnDivs[1].getBoundingClientRect();
        const board = document.getElementById("container").getBoundingClientRect();

        const line = document.getElementById("winLine");
        line.style.display = "block";

        // origin = middle box center
        const originX = rectMid.left + rectMid.width / 2 - board.left;
        const originY = rectMid.top + rectMid.height / 2 - board.top;
        line.style.left = `${originX}px`;
        line.style.top = `${originY}px`;

        // angle = vector from first to last box
        const angle = Math.atan2(
            (rect3.top + rect3.height / 2) - (rect1.top + rect1.height / 2),
            (rect3.left + rect3.width / 2) - (rect1.left + rect1.width / 2)
        ) * 180 / Math.PI;
        line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        // reset width
        line.style.width = "0px";

        // grow outward
        setTimeout(() => {
            const length = Math.hypot(
                (rect3.left + rect3.width / 2) - (rect1.left + rect1.width / 2),
                (rect3.top + rect3.height / 2) - (rect1.top + rect1.height / 2)
            );
            line.style.width = `${length}px`;
        }, 50);
    }
}

//for reset logic
const reset = () => {
    toggleBlink(false);
    const line = document.getElementById("winLine");
    line.style.display = "none";
    line.style.width = "0px";

    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    });
    isTurnO = false;
    suceed = false;
    gameDrawn = false;
    winPatrnDivs = [];

    toogleXorO();
    console.log("Game reset!");
};
document.getElementById("resetButton").addEventListener("click", reset);
//for toogling x and o
function toogleXorO() {
    if (isTurnO === false)
        document.getElementById("toogle").checked = false;
    else
        document.getElementById("toogle").checked = true;
};
document.getElementById("toogle").disabled = true;
// for new game logic
document.getElementById("newButton").addEventListener("click", () => {
    reset();

    scoreX = 0;
    scoreO = 0;
    scoreTie = 0;
    updateScoreboard();
    document.getElementById("startOverlay").style.display = "flex";
});