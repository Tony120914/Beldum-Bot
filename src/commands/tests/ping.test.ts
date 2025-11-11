import { expect, test } from 'vitest';
import { mockEnv, mockInteraction } from './mocks.js';
import { tests } from "../ping.js";
import type { MessageDataType } from '../../templates/discord/InteractionResponse.js';

test('initial response', async () => {
    const mockArgs = ['ping'];
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
});

test('ping to emoji', () => {
    const rocket = ':rocket:';
    const red_car = ':red_car:';
    const snail = ':snail:';
    const skull = ':skull:';

    const pingToEmote = tests.pingToEmote;
    expect(pingToEmote(-50)).toBe(rocket);
    expect(pingToEmote(0)).toBe(rocket);
    expect(pingToEmote(50)).toBe(rocket);
    expect(pingToEmote(100)).toBe(red_car);
    expect(pingToEmote(150)).toBe(red_car);
    expect(pingToEmote(200)).toBe(snail);
    expect(pingToEmote(250)).toBe(snail);
    expect(pingToEmote(300)).toBe(skull);
    expect(pingToEmote(400)).toBe(skull);
    expect(pingToEmote(1000)).toBe(skull);
});
