import { expect, test } from 'vitest';
import { mockEnv, mockInteraction } from './mocks.js';
import { tests } from "../rng.js";
import type { MessageDataType } from '../../templates/discord/InteractionResponse.js';
import { INTERACTION_TYPE } from '../../templates/discord/Enums.js';

test('initial response', async () => {
    const mockArgs = ['rng', '1', '100'];
    // @ts-ignore
    mockInteraction.data = { options: [{value: 1}, {value: 100}] };
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
    expect(data.components).toHaveLength(1);
});

test('roll again', async () => {
    const mockArgs = ['rng'];
    // @ts-ignore
    mockInteraction.data = { custom_id: JSON.stringify({"int1": 1, "int2": 100}) };
    mockInteraction.type = INTERACTION_TYPE.MESSAGE_COMPONENT;
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
    expect(data.components).toHaveLength(1);
});
