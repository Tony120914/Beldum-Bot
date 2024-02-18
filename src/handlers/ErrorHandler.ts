
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
