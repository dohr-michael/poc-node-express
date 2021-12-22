import { Message } from 'discord.js';
import { ServerState } from '/app/states/server_state';
import { Persistence } from '/persistence';

export default async function (args: string[], serverState: ServerState, persistence: Persistence<ServerState>, message: Message): Promise<void> {
    return
}
