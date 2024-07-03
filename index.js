import pokemonList from "./pokemonList.js";

const pokemonNameSpan = document.getElementById("pokemon-name");
const languageHint = document.getElementById("language-hint");
const languageText = document.getElementById("language-text");
const generationHint = document.getElementById("generation-hint");
const generationText = document.getElementById("generation-text");
const typeHint = document.getElementById("type-hint");
const typeText = document.getElementById("type-text");

const playerInput = document.getElementById("player-input");
const guessButton = document.getElementById("make-guess");
const guessStatus = document.getElementById("guess-status");

const guessesDiv = document.getElementById("guesses");
const hintsDiv = document.getElementById("hint-buttons");
const languageButton = document.getElementById("language-button");
const generationButton = document.getElementById("generation-button");
const typeButton = document.getElementById("type-button");

const gameWinDiv = document.getElementById("game-win");
const officialArt = document.getElementById("official-art");
const winTextSpan = document.getElementById("win-text");
const playAgain = document.getElementById("play-again");

const randomArrayEntry = (arr) => arr[Math.floor(Math.random() * arr.length)];
const answerFormat = (name) => name.trim().toLowerCase().replace(/[:.']/, "").replace("é", "e");
const capitalize = (string) => `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`;
const guessesFormat = (name) => name.trim().split(" ").map(capitalize).join(" ");
const displayStatus = (message) => {
    guessStatus.innerText = message;
    guessStatus.classList.remove("hidden");
};

let englishName;
let guesses = [];
let availableHints = [];

const setup = () => {
    const chosenPokemon = randomArrayEntry(pokemonList);
    const { name, generation, type, otherNames } = chosenPokemon;

    englishName = name;
    generationText.innerText = generation;
    typeText.innerText = type;

    const [chosenLanguage, chosenName] = randomArrayEntry(Object.entries(otherNames));

    languageText.innerText = capitalize(chosenLanguage);

    pokemonNameSpan.innerText = chosenName;
    winTextSpan.innerText = `Correct! ${chosenName} is ${englishName}'s ${capitalize(
        chosenLanguage
    )} name!`;

    officialArt.src = `./images/${englishName.replace(":", "")}.webp`;
    officialArt.alt = `Official artwork of ${englishName}, the correct guess in this round`;
};
setup();

const updateHintButtons = () => {
    if (availableHints.length) {
        hintsDiv.classList.remove("hidden");
    } else {
        hintsDiv.classList.add("hidden");
    }
};

const checkForHints = () => {
    switch (guesses.length) {
        case 1:
            availableHints.push("language");
            languageButton.classList.remove("hidden");
            break;

        case 3:
            availableHints.push("generation");
            generationButton.classList.remove("hidden");
            break;

        case 6:
            availableHints.push("type");
            typeButton.classList.remove("hidden");
            break;

        default:
            break;
    }

    updateHintButtons();
};

playerInput.addEventListener("input", () => guessStatus.classList.add("hidden"));

guessButton.addEventListener("click", () => {
    const input = answerFormat(playerInput.value);

    if (pokemonList.some((nameObj) => answerFormat(nameObj.name) === input)) {
        const answer = answerFormat(englishName);

        if (input === answer) {
            gameWinDiv.classList.remove("hidden");
            guessButton.disabled = true;
            playerInput.disabled = true;
        } else if (!guesses.map(answerFormat).includes(input)) {
            displayStatus("Not quite right! try again");

            if (!guesses.length) {
                const titleSpan = document.createElement("span");
                titleSpan.innerText = "guesses:";

                guessesDiv.appendChild(titleSpan);
                guessesDiv.appendChild(document.createElement("br"));
            }

            const newGuess = document.createElement("span");
            newGuess.innerText = guessesFormat(playerInput.value);

            guessesDiv.appendChild(newGuess);
            guessesDiv.appendChild(document.createElement("br"));

            guesses.push(answerFormat(playerInput.value));

            checkForHints();
        } else {
            displayStatus("You've already tried that one");
        }
    } else {
        displayStatus("Maybe try guessing the name of a Pokémon that can be in this game");
    }
});

const handleHintClick = (hint) => {
    availableHints = availableHints.filter((item) => item !== hint);

    switch (hint) {
        case "language":
            languageButton.classList.add("hidden");
            languageHint.classList.remove("hidden");
            break;

        case "generation":
            generationButton.classList.add("hidden");
            generationHint.classList.remove("hidden");
            break;

        case "type":
            typeButton.classList.add("hidden");
            typeHint.classList.remove("hidden");
            break;

        default:
            break;
    }

    updateHintButtons();
};

languageButton.addEventListener("click", () => handleHintClick("language"));
generationButton.addEventListener("click", () => handleHintClick("generation"));
typeButton.addEventListener("click", () => handleHintClick("type"));

playAgain.addEventListener("click", () => {
    languageHint.classList.add("hidden");
    generationHint.classList.add("hidden");
    typeHint.classList.add("hidden");
    gameWinDiv.classList.add("hidden");

    guessButton.disabled = false;
    playerInput.disabled = false;

    playerInput.value = "";
    playerInput.focus();

    guessesDiv.innerHTML = "";
    guesses = [];

    setup();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (gameWinDiv.classList.contains("hidden")) {
            guessButton.click();
        } else {
            playAgain.click();
        }
    }
});
