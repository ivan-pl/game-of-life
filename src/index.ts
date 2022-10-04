import "./index.html";
import "./styles/style.scss";
import { GameController } from "./scripts/gameController";
import { GameModel } from "./scripts/gameModel";
import { GameView } from "./scripts/gameView";

const AppElement = document.querySelector(".field") as HTMLElement;
const gameModel = new GameModel(7, 7);
const gameView = new GameView(AppElement);
const gameController = new GameController(gameModel, gameView); // eslint-disable-line @typescript-eslint/no-unused-vars
