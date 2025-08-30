import { UI } from "./ui.js";
import { TwoPlayer } from "./game.js";
import { PlayerVSComputer } from "./ai.js";

const gameUtils = new UI();
window.addEventListener("DOMContentLoaded", () => {
    const choice=sessionStorage.getItem("choice");
    if (choice === "TwoPlayer") {
        const twoPlayerGame = new TwoPlayer(gameUtils);
    } else if (choice === "OnePlayer") {
        const aiGame = new PlayerVSComputer(gameUtils);
    }
});
