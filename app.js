const boxes = document.querySelectorAll(".boxes");
let isTurnO = false;
let suceed = false;
const winnPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let clkSquncLstIdx = null;
let gameDrawn = false;
let winPatrnDivs = [];

function choseTurn(){
    if(isTurnO === false){
        document.getElementById("isTurnOf").classList.remove("left");
        document.getElementById("isTurnOf").classList.add("right");
        isTurnO = true;
    }
    else{
        document.getElementById("isTurnOf").classList.remove("right");
        document.getElementById("isTurnOf").classList.add("left");
        isTurnO = false;
    }
    toogleXorO();
};
choseTurn();
// for model UI overlay
document.getElementById("isTurnBtnBox").addEventListener("click", choseTurn);
document.getElementById("continue").addEventListener("click", () => {
    document.getElementById("startOverlay").style.display = "none";
});
document.getElementById("toogle").disabled=true;

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

        clkSquncLstIdx = index;
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

                if (pos1Val === "X") scoreX++;
                else scoreO++;

                updateScoreboard();
                winPatrnDivs = [boxes[patterns[0]], boxes[patterns[1]], boxes[patterns[2]]];
                drawLine();
            }
        }
    }

    if (!suceed && [...boxes].every(box => box.innerText !== "")) {
        scoreTie++;
        boxes.forEach((box, idx) => {
            if (idx !== clkSquncLstIdx) {
                box.innerText = "";
                box.disabled = false;
            }
        });
        updateScoreboard();
        gameDrawn = true;
        console.log("Game continues after draw, last move stays!");
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
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    });
    isTurnO = false;
    suceed = false;
    clkSquncLstIdx = null;
    gameDrawn = false;

    const line = document.getElementById("winLine");
    line.style.width = "0px";
    console.log("Game reset!");
};
document.getElementById("resetButton").addEventListener("click", reset);
//for toogling x and o
function toogleXorO(){
    if(isTurnO===false)
        document.getElementById("toogle").checked = false;
    else
        document.getElementById("toogle").checked = true;
};
// for new game logic
document.getElementById("newButton").addEventListener("click", () => {
    reset();
    document.getElementById("startOverlay").style.display = "flex";
});