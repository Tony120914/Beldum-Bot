import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_CALLBACK_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink, UserSelect } from '../templates/discord/MessageComponents.js';
import { buildUser } from '../handlers/MessageHandler.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';
import { ephemeralError } from '../handlers/ErrorHandler.js';
import type { Interaction } from '../templates/discord/InteractionReceive.js';

const applicationCommand = new ApplicationCommand(
    'tictactoe',
    'Play tic-tac-toe with another user (or with the bot if you dare...)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: Interaction, env: Env, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_CALLBACK_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    const data = interactionResponse.initMessageData();
    if (interaction.type == INTERACTION_TYPE.APPLICATION_COMMAND) {
        const actionRow = new ActionRow();
        const userSelect = new UserSelect(COMPONENT.USER_SELECT);
        userSelect.setPlaceholder('Select a user to play tic-tac-toe with');
        actionRow.addComponent(userSelect);
        data.addComponent(actionRow);
    }
    else if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        const originalUserId = interaction.message?.interaction_metadata?.user.id;
        const invokingUserId = interaction.member?.user?.id ? interaction.member.user.id : interaction.user?.id;
        if (!originalUserId || !invokingUserId) { return ephemeralError(interactionResponse, 'Error: user id not found.'); }
        let selectedUserId: string;
        const botId = interaction.application_id;
        let currentPlayerId: string;
        let gameState: GAME_STATE;
        const gameData = new GameData();
        if (interaction.data?.custom_id == COMPONENT.USER_SELECT) {
            if (!isOriginalUserInvoked(interaction)) {
                return ephemeralError(interactionResponse, 'Error: You are not the original user who triggered the interaction. Please invoke a new slash command.');
            }
            // Initialize Tic-Tac-Toe game
            if (!interaction.data?.values) { return ephemeralError(interactionResponse, 'Error: 🐛1'); }
            selectedUserId = interaction.data.values[0] as string;
            currentPlayerId = chooseFirstPlayer(originalUserId, selectedUserId, botId);
            gameData.setTurn(currentPlayerId == originalUserId ? TURN.ORIGINAL_USER : TURN.SELECTED_USER);
            gameData.setSelectedId(selectedUserId);
            if (selectedUserId != botId) {
                // Player vs player initialization
                gameData.setGrid(Array(GRID_SIZE).fill(SYMBOL.VACANT));
                gameData.setSymbol(SYMBOL.X);
            }
            else {
                // Player vs bot initialization
                const startingGrid = Array(GRID_SIZE).fill(SYMBOL.VACANT);
                const indexesOfInterest = [0, GRID_WIDTH-1, GRID_SIZE-GRID_WIDTH, GRID_SIZE-1, GRID_CENTER]; // 4 Corners and 1 center
                startingGrid[indexesOfInterest[getRandomInt(0, indexesOfInterest.length-1)] || 0] = SYMBOL.X;
                gameData.setGrid(startingGrid); // Bot will always start in a corner or center;
                gameData.setSymbol(SYMBOL.O);
            }
            gameState = GAME_STATE.ONGOING;
        }
        else {
            // Update Tic-Tac-Toe game after a button press
            if (!interaction.data) { return ephemeralError(interactionResponse, 'Error: 🐛2'); }
            Object.assign(gameData, JSON.parse(interaction.data.custom_id));
            if (gameData.selectedId === undefined || gameData.symbol === undefined || gameData.buttonId === undefined) {
                return ephemeralError(interactionResponse, 'Error: Data error, please try again later.');
            }
            selectedUserId = gameData.selectedId;
            const prevGrid = gameData.getGrid();
            gameData.setGrid(prevGrid.slice(0, gameData.buttonId)
                .concat([gameData.symbol])
                .concat(prevGrid.slice(gameData.buttonId + 1, prevGrid.length))); // Update grid based on button pressed from previous interaction
            currentPlayerId = gameData.turn == TURN.ORIGINAL_USER ? originalUserId : selectedUserId;
            if (invokingUserId != currentPlayerId) {
                return ephemeralError(interactionResponse, 'Error: It is either not your turn yet, or you are not involved in this match.');
            }
            if (selectedUserId != botId) {
                // Player vs player update
                gameState = evaluateTicTacToe(gameData);
                gameData.setSymbol(gameData.symbol == SYMBOL.X ? SYMBOL.O : SYMBOL.X);
                gameData.setTurn(gameData.turn == TURN.ORIGINAL_USER ? TURN.SELECTED_USER : TURN.ORIGINAL_USER);
                currentPlayerId = gameData.turn == TURN.ORIGINAL_USER ? originalUserId : selectedUserId;
            }
            else {
                // Player vs bot update
                gameData.setSymbol(SYMBOL.X);
                gameData.setGrid(getBestPosition(gameData));
                gameState = evaluateTicTacToe(gameData);
                gameData.setSymbol(SYMBOL.O);
                currentPlayerId = originalUserId;
            }
        }
        interactionResponse.setType(INTERACTION_CALLBACK_TYPE.UPDATE_MESSAGE);

        const embed = new Embed();
        embed.setTitle('Tic-Tac-Toe');
        embed.setDescription(`Game between ${buildUser(originalUserId)} and ${buildUser(selectedUserId)}${originalUserId == selectedUserId ? '\n***What a loser, playing this game with yourself :joy:***' : ''}`);
        if (gameState == GAME_STATE.WIN) {
            let winnerId = isOriginalUserInvoked(interaction) ? originalUserId : selectedUserId; // Most recent user to invoke is the winner.
            winnerId = selectedUserId == botId ? botId : winnerId; // Bot is programmed to always win if a win state is achieved.
            embed.addField('Winner', `${buildUser(winnerId)} won! Congratulations :tada:`);
        }
        else if (gameState == GAME_STATE.DRAW) {
            embed.addField('Draw', 'It\'s a draw :yawning_face:');
        }
        else if (gameState == GAME_STATE.ONGOING) {
            if (gameData.symbol === undefined) {
                return ephemeralError(interactionResponse, 'Error: 🐛3');
            }
            embed.addField('Instructions', `${buildUser(currentPlayerId)}'s turn. Your symbol is ${SYMBOL_TO_EMOJI[gameData.symbol]}`);
        }
        data.addEmbed(embed);

        for (let i = 0; i < GRID_SIZE; i+=GRID_WIDTH) {
            const actionRow = new ActionRow();
            for (let j = i; j < i + GRID_WIDTH; j++) {
                gameData.setButtonId(j);
                const button = new ButtonNonLink(JSON.stringify(gameData), BUTTON_STYLE.PRIMARY);
                const symbol = gameData.getGrid()[j];
                if (symbol === undefined) {
                    return ephemeralError(interactionResponse, 'Error: 🐛4');
                }
                button.setEmoji(undefined, SYMBOL_TO_EMOJI[symbol]);
                if (gameData.getGrid()[j] == SYMBOL.X) {
                    button.setStyle(BUTTON_STYLE.SUCCESS);
                    button.setDisabled(true);
                }
                else if (gameData.getGrid()[j] == SYMBOL.O) {
                    button.setStyle(BUTTON_STYLE.DANGER);
                    button.setDisabled(true);
                }
                else {
                    button.setStyle(BUTTON_STYLE.SECONDARY);
                    if (gameState != GAME_STATE.ONGOING) { button.setDisabled(true); }
                }
                actionRow.addComponent(button);
            }
            data.addComponent(actionRow);
        }
    }
    return interactionResponse;
}

const GRID_WIDTH = 3;
const GRID_SIZE = GRID_WIDTH * GRID_WIDTH;
const GRID_CENTER = GRID_WIDTH * Math.floor(GRID_WIDTH/2) + Math.floor(GRID_WIDTH/2);

enum COMPONENT {
    USER_SELECT = 'user_select'
}

enum SYMBOL {
    VACANT = '-',
    X = 'X',
    O = 'O'
}

enum TURN {
    ORIGINAL_USER,
    SELECTED_USER
}

enum GAME_STATE {
    ONGOING,
    WIN,
    DRAW,
}

const SYMBOL_TO_EMOJI = {
    [SYMBOL.VACANT]: '▪️',
    [SYMBOL.X]: '❎',
    [SYMBOL.O]: '🅾️'
}

/**
 * Tic-Tac-Toe game data structure when passing data through buttons
 */
class GameData {
    buttonId?: number
    symbol?: SYMBOL
    grid?: string // of SYMBOL
    selectedId?: string
    turn?: TURN

    setButtonId(buttonId: number) { this.buttonId = buttonId; }
    setSymbol(symbol: SYMBOL) { this.symbol = symbol; }
    getGrid(): SYMBOL[] {
        if (!this.grid) { return [] as SYMBOL[] }
        return this.grid.split('') as SYMBOL[];
    }
    setGrid(grid: SYMBOL[]) {
        if (grid.length != GRID_SIZE) {
            console.error(`Tic-Tac-Toe grid is size ${grid.length}, expected ${GRID_SIZE}`);
            return;
        }
        grid.forEach(symbol => {
            if (!Object.values(SYMBOL).includes(symbol)) {
                console.error(`Tic-Tac-Toe grid contains an invalid symbol: ${grid}`);
                return;
            }
        });
        this.grid = grid.join('');
    }
    setSelectedId(selectedId: string) { this.selectedId = selectedId; }
    setTurn(turn: TURN) { this.turn = turn; }
}

/**
 * Randomly selects which player goes first.
 * (The bot will always "go first" by making its first move during the grid initialization.
 * However, the bot will be considered player 2 to retain opponent status,
 * since it will technically always be the player's turn.)
 */
function chooseFirstPlayer(player1Id: string, player2Id: string, botId: string): string {
    if (player2Id == botId) { return player1Id; }
    const players = [player1Id, player2Id];
    return players[getRandomInt(0, players.length-1)] || player1Id;
}

/**
 * Evaluate Tic-Tac-Toe game and returns the game state
 */
function evaluateTicTacToe(data: GameData) {
    // Checking for row wins
    for (let i = 0; i < GRID_SIZE; i+=GRID_WIDTH) {
        let count = 0;
        for (let j = i; j < i + GRID_WIDTH; j++) {
            if (data.getGrid()[j] == data.symbol) { count++; }
        }
        if (count == GRID_WIDTH) { return GAME_STATE.WIN; }
    }
    // Checking for column wins
    for (let i = 0; i < GRID_WIDTH; i++) {
        let count = 0;
        for (let j = i; j < i + GRID_SIZE - GRID_WIDTH + 1; j+=GRID_WIDTH) {
            if (data.getGrid()[j] == data.symbol) { count++; }
        }
        if (count == GRID_WIDTH) { return GAME_STATE.WIN; }
    }
    // Checking for diagonal wins
    let count = 0;
    for (let i = 0; i < GRID_SIZE; i+=GRID_WIDTH + 1) {
        if (data.getGrid()[i] == data.symbol) { count++; }
    }
    if (count == GRID_WIDTH) { return GAME_STATE.WIN; }
    count = 0;
    for (let i = GRID_WIDTH - 1; i < GRID_SIZE - GRID_WIDTH + 1; i+=GRID_WIDTH - 1) {
        if (data.getGrid()[i] == data.symbol) { count++; }
    }
    if (count == GRID_WIDTH) { return GAME_STATE.WIN; }
    // Check for ongoing game
    if (data.getGrid().includes(SYMBOL.VACANT)) { return GAME_STATE.ONGOING; }
    // If all the above is not satisfied, then it is a draw
    return GAME_STATE.DRAW;
}

/**
 * The bot will make decisions based on the minimax algorithm.
 * (Includes alpha beta pruning.)
 * https://en.wikipedia.org/wiki/Minimax
 * https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
 */
function minimaxAB(data: GameData, depth: number, alpha: number, beta: number) {
    let isBotTurn = data.symbol == SYMBOL.X;
    const gameState = evaluateTicTacToe(data);
    if (gameState == GAME_STATE.WIN && isBotTurn) { return GRID_SIZE - depth; } // Less depth means faster wins are favored
    else if (gameState == GAME_STATE.WIN && !isBotTurn) { return -GRID_SIZE + depth; } // More depths means slower losses are favored
    else if (gameState == GAME_STATE.DRAW) { return 0; } // Draws are neutral
    isBotTurn = !isBotTurn;

    if (isBotTurn) {
        let score = Number.NEGATIVE_INFINITY;
        const childPositions = getChildPositions(data, SYMBOL.X);
        for (const childData of childPositions) {
            score = Math.max(score, minimaxAB(childData, depth + 1, alpha, beta));
            alpha = Math.max(alpha, score);
            if (score >= beta) { break; }
        }
        return score;
    }
    else {
        let score = Number.POSITIVE_INFINITY;
        const childPositions = getChildPositions(data, SYMBOL.O);
        for (const childData of childPositions) {
            score = Math.min(score, minimaxAB(childData, depth + 1, alpha, beta));
            beta = Math.min(beta, score);
            if (score <= alpha) { break; }
        }
        return score;
    }
}

/**
 * Find and return all grid positions that are one move away from the current position
 */
function getChildPositions(data: GameData, symbol: SYMBOL) {
    const grid = data.getGrid();
    const childPositions: GameData[] = [];
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] == SYMBOL.VACANT) {
            const childGrid = grid.slice();
            childGrid[i] = symbol;
            const childData = new GameData();
            Object.assign(childData, data);
            childData.setSymbol(symbol);
            childData.setGrid(childGrid);
            childPositions.push(childData);
        }
    }
    return childPositions;
}

/**
 * Find and return the best child grid position that is one move away from the current position
 */
function getBestPosition(data: GameData): SYMBOL[] {
    if (data.symbol === undefined) { return []; }
    let maxScore = Number.NEGATIVE_INFINITY;
    let bestPosition: SYMBOL[] = data.getGrid();
    getChildPositions(data, data.symbol).forEach(childData => {
        const childScore = minimaxAB(childData, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        if (childScore > maxScore) {
            maxScore = childScore;
            bestPosition = childData.getGrid();
        }
    });
    return bestPosition;
}

/**
 * Tic-Tac-Toe Command
 */
const TicTacToe = new Command(applicationCommand, execute);
export default TicTacToe;
