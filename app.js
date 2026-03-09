const boxes = document.querySelectorAll(".boxes");
let isTurnO = false;
let suceed = false;
const winnPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let clickSequence = [];
let gameDrawn = false;
// for model UI overlay
let msgBoxButn = document.querySelector("#msgBoxButton");
function startGame() {
    document.getElementById("startOverlay").style.display = "none";
};
msgBoxButn.addEventListener("click", startGame);
//game's logic
boxes.forEach((box, index) => {
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

        clickSequence.push(index);

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
            }
        }
    }

    if (suceed) {
        boxes.forEach((box) => box.disabled = true);
    }
    else if (clickSequence.length === 9) {
        // all 9 moves played, no winner
        let lastIndex = clickSequence[clickSequence.length - 1];

        boxes.forEach((box, idx) => {
            if (idx !== lastIndex) {
                box.innerText = "";
                box.disabled = false;
            }
        });

        // reset sequence tracking
        clickSequence = [lastIndex];
        indexOfClickSequence = 1;
        gameDrawn = true;
        console.log("Game continues after draw, last move stays!");

    }
};

//for reset logic
document.getElementById("resetButton").addEventListener("click", () => {
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
    });
    isTurnO = false;
    suceed = false;
    clickSequence = [];
    gameDrawn = false;
    console.log("Game reset!");
});