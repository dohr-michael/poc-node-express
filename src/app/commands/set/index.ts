import { Message } from 'discord.js';
import { translate } from '/i18n';
import { ServerState } from '/app/states/server_state';
import { Persistence } from '/persistence';


type Fn = (args: string[], serverState: ServerState, persistence: Persistence<ServerState>, message: Message) => Promise<void>;

const commands: { [ key: string ]: Fn } = {
    master: require('./master').default,
    player: require('./player').default,
    prefix: require('./prefix').default,
    diceSystem: require('./dicesystem').default,
};
const allCommands = Object.keys(commands).map(v => `'${ v }'`).join(', ')

export default async function apply(args: string[], serverState: ServerState, persistence: Persistence<ServerState>, message: Message): Promise<void> {
    if (args.length === 0) {
        return Promise.reject(translate(serverState.language, 'errors.commands.set.badCommand', '', allCommands));
    }
    const [ subCommand, ...others ] = args;
    if (!commands.hasOwnProperty(subCommand)) {
        return Promise.reject(translate(serverState.language, 'errors.commands.set.badCommand', subCommand, allCommands));
    }
    if (message.channel.id !== serverState.channels.withBot) {
        return Promise.reject(translate(serverState.language, 'errors.commands.set.unauthorized'))
    }
    console.log(` - start 'set ${ subCommand }'`)
    if (others[ 0 ] === '--help') {
        return message.channel.send(translate(serverState.language, `messages.set.${ subCommand }.help`, serverState.config.prefix)).then(() => {});
    }
    return commands[ subCommand ](others, serverState, persistence, message);
}
