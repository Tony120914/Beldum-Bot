import { expect, test } from 'vitest';
import { mockEnv, mockInteraction } from './mocks.js';
import { tests } from "../rps.js";
import type { MessageDataType } from '../../templates/discord/InteractionResponse.js';
import { INTERACTION_TYPE } from '../../templates/discord/Enums.js';

test('initial response', async () => {
    const mockArgs = ['rps'];
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.components).toHaveLength(1);
});

test('play again', async () => {
    const mockArgs = ['rps'];
    const rpsOptions = ['rock', 'paper', 'scissors'];
    for (let option in rpsOptions) {
        // @ts-ignore
        mockInteraction.data = { custom_id: option }
        mockInteraction.type = INTERACTION_TYPE.MESSAGE_COMPONENT;
        let interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
        let data = interactionResponse.data as MessageDataType;
        expect(data.embeds).toHaveLength(1);
        expect(data.components).toHaveLength(1);
    }
});

test('rps evaluation', () => {
    enum RPS {
        ROCK = 'rock',
        PAPER = 'paper',
        SCISSORS = 'scissors'
    }
    const draw = ':zzz: _but nothing happened._';
    const lose = ':skull: _it\'s not very effective..._';
    const win = ':boom: _it\'s super effective!_';
    const evaluateRps = tests.evaluateRps;
    expect(evaluateRps(RPS.ROCK, RPS.ROCK)).toBe(draw);
    expect(evaluateRps(RPS.PAPER, RPS.PAPER)).toBe(draw);
    expect(evaluateRps(RPS.SCISSORS, RPS.SCISSORS)).toBe(draw);

    expect(evaluateRps(RPS.SCISSORS, RPS.ROCK)).toBe(lose);
    expect(evaluateRps(RPS.ROCK, RPS.PAPER)).toBe(lose);
    expect(evaluateRps(RPS.PAPER, RPS.SCISSORS)).toBe(lose);

    expect(evaluateRps(RPS.ROCK, RPS.SCISSORS)).toBe(win);
    expect(evaluateRps(RPS.PAPER, RPS.ROCK)).toBe(win);
    expect(evaluateRps(RPS.SCISSORS, RPS.PAPER)).toBe(win);
});
