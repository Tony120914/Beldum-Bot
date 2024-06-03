import { ApplicationCommand } from '../templates/discord/ApplicationCommand.js'
import { Command } from '../templates/app/Command.js';
import { APPLICATION_COMMAND_TYPE, BUTTON_STYLE, INTERACTION_RESPONSE_TYPE, INTERACTION_TYPE } from '../templates/discord/Enums.js';
import { Embed } from '../templates/discord/Embed.js';
import { InteractionResponse } from '../templates/discord/InteractionResponse.js'
import { getRandomInt } from '../handlers/Utils.js';
import { ActionRow, ButtonNonLink, UserSelect } from '../templates/discord/MessageComponents.js';
import { buildUser } from '../handlers/MessageHandler.js';

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
        interactionResponse.setType(INTERACTION_RESPONSE_TYPE.UPDATE_MESSAGE);
        const data = new GameData();
        let currentPlayerId: string;
        let gameState: GAME_STATE;
        if (interaction.data.custom_id == 'user_select') {
            const players = randomizePlayerOrder(interaction.message.interaction_metadata.user_id, interaction.data.values[0], interaction.application_id);
            currentPlayerId = players[0];
            data.setOpponentId(players[1]);
            if (data.opponentId != interaction.application_id) {
                data.setGrid(Array(GRID_SIZE).fill(SYMBOL.VACANT));
                data.setSymbol(SYMBOL.X);
            }
            else {
                data.setGrid(Array(GRID_SIZE - 1).fill(SYMBOL.VACANT).concat([SYMBOL.X]));
                data.setSymbol(SYMBOL.O);
            }
            gameState = GAME_STATE.ONGOING;
        }
        else {
            const prevData = new GameData();
            prevData.assignObject(JSON.parse(interaction.data.custom_id));
            data.setGrid(prevData.getGrid().slice(0, prevData.buttonId)
                .concat([prevData.symbol])
                .concat(prevData.getGrid().slice(prevData.buttonId + 1, prevData.getGrid().length)));
            data.setSymbol(prevData.symbol); // Let game state be evaluated before changing symbols
            if (prevData.opponentId != interaction.application_id) {
                currentPlayerId = prevData.opponentId;
                data.setOpponentId(interaction.message.interaction_metadata.user_id);
                gameState = evaluateTicTacToe(data);
                data.setSymbol(prevData.symbol == SYMBOL.X ? SYMBOL.O : SYMBOL.X);
            }
            else {
                currentPlayerId = interaction.message.interaction_metadata.user_id;
                data.setOpponentId(interaction.application_id);
                data.setSymbol(SYMBOL.X);
                data.setGrid(getBestPosition(data));
                gameState = evaluateTicTacToe(data);
                data.setSymbol(SYMBOL.O);
            }
        }
        
        const embed = new Embed();
        embed.setTitle('Tic-Tac-Toe');
        embed.setDescription(`Game between ${buildUser(currentPlayerId)} and ${buildUser(data.opponentId)}${currentPlayerId == data.opponentId ? '\n***What a loser, playing this game with yourself :joy:***' : ''}`);
        if (gameState == GAME_STATE.WIN) {
            embed.addField('Winner', `${buildUser(data.opponentId)} won! Congratulations :tada:`);
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

enum GAME_STATE {
    ONGOING,
    WIN,
    DRAW,
}

class GameData {
    buttonId: number
    symbol: SYMBOL
    grid: string // of SYMBOL
    opponentId: string

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
    setOpponentId(opponentId: string) { this.opponentId = opponentId; }
}

function randomizePlayerOrder(player1Id: string, player2Id: string, botId: string) {
    // Bot always player2 to retain opponent status
    if (player2Id == botId) { return [player1Id, botId]; }
    const randomInt = getRandomInt(0, 1);
    if (randomInt == 0) { return [player1Id, player2Id]; }
    else { return [player2Id, player1Id]; }
}

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

function minimax(data: GameData, depth: number) {
    let isBotTurn = data.symbol == SYMBOL.X;
    const gameState = evaluateTicTacToe(data);
    if (gameState == GAME_STATE.WIN && isBotTurn) { return GRID_SIZE - depth; }
    else if (gameState == GAME_STATE.WIN && !isBotTurn) { return -GRID_SIZE + depth; }
    else if (gameState == GAME_STATE.DRAW) { return 0; }
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
