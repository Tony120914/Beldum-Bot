import { expect, test } from 'vitest';
import { mockEnv, mockInteraction } from './mocks.js';
import { tests } from "../8ball.js";
import type { MessageDataType } from '../../templates/discord/InteractionResponse.js';


test('initial response', async () => {
    const mockArgs = ['8ball', 'question'];
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
});
