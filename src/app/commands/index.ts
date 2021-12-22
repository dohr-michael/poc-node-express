import { Message } from 'discord.js';
import { Persistence } from '/persistence';
import { ServerState, emptyServerState } from '/app/states/server_state';
import { translate } from '/i18n';
import init from './init';
import set from './set';
import config from './config';


export class Services {
    constructor(private persistence: Persistence<ServerState>) {}

    apply = async (message: Message, serverState: ServerState, command: string, ...args: Array<string>): Promise<void> => {
        switch (command) {
            case 'ping':
                return message.reply('pong').then();
            case 'config':
                return config(serverState, this.persistence, message);
            case 'init':
                return init(serverState, this.persistence, message);
            case 'set':
                return set(args, serverState, this.persistence, message);
            default:
                return Promise.reject(translate(serverState.language, 'errors.commands.unknown', command))
        }
    }
}
