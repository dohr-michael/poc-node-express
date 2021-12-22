import { Message } from 'discord.js';
import { ServerState } from '/app/states/server_state';
import { Persistence } from '/persistence';
import { translate } from '/i18n';
import helpers from '/helpers';

const errorPrefix = 'errors.commands.set.master'

export default async function (args: string[], serverState: ServerState, persistence: Persistence<ServerState>, message: Message): Promise<void> {
    if (args.length === 0) {
        return Promise.reject(translate(serverState.language, `${ errorPrefix }.missing`));
    }

    const masterRole = serverState.roles.master && message.guild.roles.resolve(serverState.roles.master);
    if (!masterRole) {
        return Promise.reject(translate(serverState.language, `${ errorPrefix }.role-missing`, serverState.config.prefix));
    }

    const maybeMasterId = helpers.discord.getUserIdFromMention(args[ 0 ]);
    if (!maybeMasterId) {
        return Promise.reject(translate(serverState.language, `errors.not-a-person`, args[ 0 ]));
    }
    const currentMaster = serverState.master && message.guild.member(serverState.master);
    if (maybeMasterId && currentMaster && currentMaster.id === maybeMasterId && masterRole.members.find(v => v.id === currentMaster.id)) {
        await message.react('👌');
        return;
    }
    const maybeMaster = message.guild.member(maybeMasterId);
    if (!maybeMaster) {
        return Promise.reject(translate(serverState.language, `errors.unknown-person`, maybeMasterId));
    }
    if (currentMaster) {
        await currentMaster.roles.remove(masterRole);
    }
    await maybeMaster.roles.add(masterRole);
    await persistence.save(serverState._id, { master: maybeMaster.id });
    await message.react('👌');
    return
}
