import { PermissionString } from 'discord.js';

export const AllPermissionForChannel: Array<PermissionString> = [
    'VIEW_CHANNEL',
    'ADD_REACTIONS',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'USE_EXTERNAL_EMOJIS',
]

export function getUserIdFromMention(mention: string): string | null {
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        let tmp = mention.slice(2, -1);
        if (tmp.startsWith('!')) {
            tmp = tmp.slice(1);
        }
        return tmp;
    }
    return null;
}
