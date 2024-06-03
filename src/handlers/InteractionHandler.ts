
/**
 * Checks if the invoking user is the same as the original user
 * who triggered the interaction.
 * (This is useful when using message components.)
 */
export function isOriginalUser(interaction: any) {
    const originalUserId = interaction.message?.interaction_metadata?.user?.id;
    const invokingUserId = interaction.member?.user?.id ? interaction.member.user.id : interaction.user.id;
    return originalUserId == invokingUserId;
}