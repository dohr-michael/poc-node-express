import { Message } from 'discord.js';
import { ServerState } from '/app/states/server_state';
import { Persistence } from '/persistence';
import { translate } from '/i18n';
import helpers from '/helpers';
import { AllPermissionForChannel } from '/helpers/discord';

const errorPrefix = 'errors.commands.set.player'

export default async function (args: string[], serverState: ServerState, persistence: Persistence<ServerState>, message: Message): Promise<void> {
    if (args.length < 2) {
        return Promise.reject(translate(serverState.language, `${ errorPrefix }.missing`));
    }

    const playerRole = serverState.roles.players && message.guild.roles.resolve(serverState.roles.players);
    if (!playerRole) {
        return Promise.reject(translate(serverState.language, `${ errorPrefix }.role-missing`, serverState.config.prefix));
    }
    const players = message.guild.channels.resolve(serverState.channels.players);
    if (!players) {
        return Promise.reject(translate(serverState.language, `${ errorPrefix }.channel-missing`, serverState.config.prefix));
    }

    const maybeUserId = helpers.discord.getUserIdFromMention(args[ 0 ]);
    if (!maybeUserId) {
        return Promise.reject(translate(serverState.language, `errors.not-a-person`, args[ 0 ]));
    }
    const maybePlayer = message.guild.members.resolve(maybeUserId);
    if (!maybePlayer) {
        return Promise.reject(translate(serverState.language, `errors.unknown-person`, maybeUserId));
    }


    await maybePlayer.roles.add(playerRole);
    const characterName = args.slice(1).join(' ');
    const currentPlayedCharacter = serverState.players.find(p => p.id === maybePlayer.id);
    if (currentPlayedCharacter && message.guild.channels.resolve(currentPlayedCharacter.channel)) {
        return Promise.reject(translate(serverState.language, `${ errorPrefix }.have-already-character`, maybePlayer.displayName, currentPlayedCharacter.characterName));
    }

    const playerChannel = await message.guild.channels.create(args.slice(1).join('-').toLocaleLowerCase(), { parent: players.id });
    await playerChannel.edit({
        permissionOverwrites: [
            {
                id: maybePlayer.id,
                type: 'member',
                allow: AllPermissionForChannel
            },
            {
                id: serverState.roles.master,
                type: 'role',
                allow: AllPermissionForChannel
            },
            {
                id: message.guild.id,
                deny: [ 'VIEW_CHANNEL' ]
            }
        ]
    });
    if (message.guild.me.hasPermission('MANAGE_NICKNAMES') && maybePlayer.id !== message.guild.ownerID) {
        await maybePlayer.setNickname(characterName);
    } else {
        await message.channel.send(translate(serverState.language, `${ errorPrefix }.cannot-change-name`, maybePlayer.displayName, characterName))
    }

    await persistence.save(serverState._id, {
        players: [ ...serverState.players.filter(p => p.id !== maybePlayer.id), {
            id: maybePlayer.id, characterName: characterName, channel: playerChannel.id
        } ]
    })

    await message.react('👌');
    return

}
