import { expect, test } from 'vitest';
import { mockEnv, mockInteraction } from './mocks.js';
import { tests } from "../spongebobmock.js";
import type { MessageDataType } from '../../templates/discord/InteractionResponse.js';
import { INTERACTION_TYPE } from '../../templates/discord/Enums.js';

test('initial response', async () => {
    const mockArgs = ['spongebob mock'];
    mockInteraction.data = {
        target_id: '111111111111111111',
        resolved: {
            messages: {
                // @ts-ignore
                '111111111111111111': {
                    content: 'mock this text!'
                }
            }
        }
    }
    mockInteraction.type = INTERACTION_TYPE.MESSAGE_COMPONENT;
    const interactionResponse = await tests.execute(mockInteraction, mockEnv, mockArgs);
    const data = interactionResponse.data as MessageDataType;
    expect(data.embeds).toHaveLength(1);
    expect(data.components).toHaveLength(1);
});

test('isAlpha function', () => {
    const isAlpha = tests.isAlpha;
    expect(isAlpha('')).toBe(false);
    expect(isAlpha('0')).toBe(false);
    expect(isAlpha('1')).toBe(false);
    expect(isAlpha('!')).toBe(false);
    expect(isAlpha('#')).toBe(false);
    expect(isAlpha('zz')).toBe(false);
    expect(isAlpha('a')).toBe(true);
    expect(isAlpha('B')).toBe(true);
});

test('mockText function', () => {
    const mockText = tests.mockText;
    expect(mockText('')).toBe('');
    expect(mockText('4^*@$%2^%$97')).toBe('4^*@$%2^%$97');
    expect(mockText('abcdef')).toBe('aBcDeF');
    expect(mockText('ABCDEF')).toBe('aBcDeF');
    expect(mockText('abcdefg')).toBe('aBcDeFg');
    expect(mockText('ABCDEFG')).toBe('aBcDeFg');
    expect(mockText('ab cd e fg')).toBe('aB cD e Fg');
    expect(mockText('abc123def!@# h4eSes5%$Wh4wH')).toBe('aBc123DeF!@# h4EsEs5%$Wh4Wh'); 
});

