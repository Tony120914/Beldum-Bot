import { INTERACTION_RESPONSE_FLAGS, INTERACTION_RESPONSE_TYPE } from "../templates/discord/Enums";
import { InteractionResponse } from "../templates/discord/InteractionResponse";

/**
 * Get error text from a failed Fetch Response
 */
export async function getFetchErrorText(failedResponse: Response) {
    let errorText = `${failedResponse.url}: ${failedResponse.status} ${failedResponse.statusText}`;
    try {
        const error = await failedResponse.text();
        if (error) {
            errorText += `\n${error}`;
        }
    } catch {}
    return errorText;
}

/**
 * Wrapper for errors that warrant a EPHEMERAL response
 */
export async function ephemeralError(interactionResponse: InteractionResponse, errorText: string, error?: any) {
    if (error) { console.error(error); }
    interactionResponse.setType(INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE);
    interactionResponse.data?.setFlags(INTERACTION_RESPONSE_FLAGS.EPHEMERAL);
    interactionResponse.data?.setContent(`\`${errorText}\``);
    return interactionResponse;
}
