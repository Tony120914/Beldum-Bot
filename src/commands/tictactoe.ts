import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink, UserSelect } from '../templates/discord/MessageComponents.js';
import { buildUser } from '../handlers/MessageHandler.js';
import { isOriginalUserInvoked } from '../handlers/InteractionHandler.js';

const applicationCommand = new ApplicationCommand(
    'tictactoe',
    'Play tic-tac-toe with another user (or with the bot if you dare...)',
    APPLICATION_COMMAND_TYPE.CHAT_INPUT
);

const execute = async function(interaction: any, env: any, args: string[]) {
    const interactionResponse = new InteractionResponse(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    if (interaction.type == INTERACTION_TYPE.APPLICATION_COMMAND) {
        const actionRow = new ActionRow();
        const userSelect = new UserSelect('user_select');
        userSelect.setPlaceholder('Select a user to play tic-tac-toe with');
        actionRow.addComponent(userSelect);
        interactionResponse.data?.addComponent(actionRow);
    }
    else if (interaction.type == INTERACTION_TYPE.MESSAGE_COMPONENT) {
        const data = new GameData();
        const originalUserId = interaction.message.interaction_metadata.user.id;
        const invokingUserId = interaction.member?.user?.id ? interaction.member.user.id : interaction.user.id;
        let selectedUserId: string;
        const botId = interaction.application_id;
        let currentPlayerId: string;
        let gameState: GAME_STATE;
        if (interaction.data.custom_id == 'user_select') {
            if (!isOriginalUserInvoked(interaction)) {
                interactionResponse.data?.setContent('\`Error: You are not the original user who triggered the interaction. Please invoke a new slash command.\`');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            // Initialize Tic-Tac-Toe game
            selectedUserId = interaction.data.values[0];
            currentPlayerId = chooseFirstPlayer(originalUserId, selectedUserId, botId);
            data.setTurn(currentPlayerId == originalUserId ? TURN.ORIGINAL_USER : TURN.SELECTED_USER);
            data.setSelectedId(selectedUserId);
            if (selectedUserId != botId) {
                // Player vs player initialization
                data.setGrid(Array(GRID_SIZE).fill(SYMBOL.VACANT));
                data.setSymbol(SYMBOL.X);
            }
            else {
                // Player vs bot initialization
                const startingGrid = Array(GRID_SIZE).fill(SYMBOL.VACANT);
                const indexesOfInterest = [0, GRID_WIDTH-1, GRID_SIZE-GRID_WIDTH, GRID_SIZE-1, GRID_CENTER]; // 4 Corners and 1 center
                startingGrid[indexesOfInterest[getRandomInt(0, 4)]] = SYMBOL.X;
                data.setGrid(startingGrid); // Bot will always start in a corner or center;
                data.setSymbol(SYMBOL.O);
            }
            gameState = GAME_STATE.ONGOING;
        }
        else {
            // Update Tic-Tac-Toe game after a button press
            data.assignObject(JSON.parse(interaction.data.custom_id));
            selectedUserId = data.selectedId;
            const prevGrid = data.getGrid();
            data.setGrid(prevGrid.slice(0, data.buttonId)
                .concat([data.symbol])
                .concat(prevGrid.slice(data.buttonId + 1, prevGrid.length))); // Update grid based on button pressed from previous interaction
            currentPlayerId = data.turn == TURN.ORIGINAL_USER ? originalUserId : selectedUserId;
            if (invokingUserId != currentPlayerId) {
                interactionResponse.data?.setContent('\`Error: It is either not your turn yet, or you are not involved in this match.\`');
                interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
                return interactionResponse;
            }
            if (selectedUserId != botId) {
                // Player vs player update
                gameState = evaluateTicTacToe(data);
                data.setSymbol(data.symbol == SYMBOL.X ? SYMBOL.O : SYMBOL.X);
                data.setTurn(data.turn == TURN.ORIGINAL_USER ? TURN.SELECTED_USER : TURN.ORIGINAL_USER);
                currentPlayerId = data.turn == TURN.ORIGINAL_USER ? originalUserId : selectedUserId;
            }
            else {
                // Player vs bot update
                data.setSymbol(SYMBOL.X);
                data.setGrid(getBestPosition(data));
                gameState = evaluateTicTacToe(data);
                data.setSymbol(SYMBOL.O);
                currentPlayerId = originalUserId;
            }
        }
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);

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
            const symbolToEmoji = {
                [SYMBOL.X]: ':negative_squared_cross_mark:',
                [SYMBOL.O]: ':o2:',
            }
            embed.addField('Instructions', `${buildUser(currentPlayerId)}'s turn. Your symbol is ${symbolToEmoji[data.symbol]}`);
        }
        interactionResponse.data?.addEmbed(embed);

        for (let i = 0; i < GRID_SIZE; i+=GRID_WIDTH) {
            const actionRow = new ActionRow();
            for (let j = i; j < i + GRID_WIDTH; j++) {
                data.setButtonId(j);
                const button = new ButtonNonLink(JSON.stringify(data));
                button.setLabel(data.getGrid()[j]);
                if (data.getGrid()[j] == SYMBOL.X) {
                    button.setStyle(BUTTON_STYLE.SUCCESS);
                    button.setDisabled(true);
                }
                else if (data.getGrid()[j] == SYMBOL.O) {
                    button.setStyle(BUTTON_STYLE.DANGER);
                    button.setDisabled(true);
                }
                else {
                    button.setStyle(BUTTON_STYLE.PRIMARY);
                    if (gameState != GAME_STATE.ONGOING) { button.setDisabled(true); }
                }
                actionRow.addComponent(button);
            }
            interactionResponse.data?.addComponent(actionRow);
        }
    }
    return interactionResponse;
}

const GRID_WIDTH = 3;
const GRID_SIZE = GRID_WIDTH * GRID_WIDTH;
const GRID_CENTER = GRID_WIDTH * Math.floor(GRID_WIDTH/2) + Math.floor(GRID_WIDTH/2);

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

/**
 * Tic-Tac-Toe game data structure when passing data through buttons
 */
class GameData {
    buttonId: number
    symbol: SYMBOL
    grid: string // of SYMBOL
    selectedId: string
    turn: TURN

    assignObject(object: object) {
        Object.assign(this, object);
    }

    setButtonId(buttonId: number) { this.buttonId = buttonId; }
    setSymbol(symbol: SYMBOL) { this.symbol = symbol; }
    getGrid() {
        return <SYMBOL[]>this.grid.split('');
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
function chooseFirstPlayer(player1Id: string, player2Id: string, botId: string) {
    if (player2Id == botId) { return player1Id; }
    return [player1Id, player2Id][getRandomInt(0, 1)];
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
 * https://en.wikipedia.org/wiki/Minimax
 */
function minimax(data: GameData, depth: number) {
    let isBotTurn = data.symbol == SYMBOL.X;
    const gameState = evaluateTicTacToe(data);
    if (gameState == GAME_STATE.WIN && isBotTurn) { return GRID_SIZE - depth; } // Less depth means faster wins are favored
    else if (gameState == GAME_STATE.WIN && !isBotTurn) { return -GRID_SIZE + depth; } // More depths means slower losses are favored
    else if (gameState == GAME_STATE.DRAW) { return 0; } // Draws are neutral
    isBotTurn = !isBotTurn;

    if (isBotTurn) {
        let score = Number.NEGATIVE_INFINITY;
        const childPositions = getChildPositions(data, SYMBOL.X);
        childPositions.forEach(childData => {
            score = Math.max(score, minimax(childData, depth + 1));
        })
        return score;
    }
    else {
        let score = Number.POSITIVE_INFINITY;
        const childPositions = getChildPositions(data, SYMBOL.O);
        childPositions.forEach(childData => {
            score = Math.min(score, minimax(childData, depth + 1));
        })
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
            const childData = new GameData();
            const childGrid = grid.slice();
            childGrid[i] = symbol;
            childData.assignObject(data);
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
function getBestPosition(data: GameData) {
    let maxScore = Number.NEGATIVE_INFINITY;
    let bestPosition: SYMBOL[] = data.getGrid();
    getChildPositions(data, data.symbol).forEach(childData => {
        const childScore = minimax(childData, 0);
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
export const TicTacToe = new Command(applicationCommand, execute);
