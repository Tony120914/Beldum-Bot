import { expect, test } from 'vitest';
import { mockEnv, mockInteraction } from './mocks.js';
import { tests } from "../cointoss.js";
import type { MessageDataType } from '../../templates/discord/InteractionResponse.js';
import { INTERACTION_TYPE } from '../../templates/discord/Enums.js';


test('initial response', async () => {
    const mockArgs = ['cointoss'];
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
    expect(data.components).toHaveLength(1);
});

test('toss again with history', async () => {
    const mockArgs = ['cointoss'];    
    // @ts-ignore
    mockInteraction.data = { custom_id: 'HTHT' };
    const history = mockInteraction.data?.custom_id;
    mockInteraction.type = INTERACTION_TYPE.MESSAGE_COMPONENT;
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
    expect(data.components).toHaveLength(1);
    const footer = data.embeds![0]?.footer;
    expect(footer?.text.slice(0, footer?.text.length-1)).toBe(`History: ${history}`);
});
