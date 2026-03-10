export enum SendCampaignErrorCode {
    CantCreateCampaign,
    CantCreateCampaignForRecipientList,
    FailedToAttachContentToCampaign,
    Unknown,
}

export type SendCampaignResult =
    | { status: 'success' }
    | { status: 'error'; error: SendCampaignErrorCode };
