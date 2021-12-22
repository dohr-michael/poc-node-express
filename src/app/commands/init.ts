import { Channel, DMChannel, Message, NewsChannel, PermissionString, TextChannel } from 'discord.js';

import { translate } from '/i18n';
import { Persistence } from '/persistence';
import { ServerState } from '/app/states/server_state';
import { AllPermissionForChannel } from '/helpers/discord';

const permissions: Array<PermissionString> = AllPermissionForChannel;

export default async function apply(serverState: ServerState, persistence: Persistence<ServerState>, message: Message): Promise<void> {
    console.log(`init for guild '${ message.guild.name }' (${ message.guild.id })`)
    let currentState = serverState;
    if (message.guild.ownerID !== message.author.id) {
        return Promise.reject(translate(serverState.language, 'errors.commands.init.unauthorized'))
    }


    const save = (update: any): Promise<ServerState> => persistence.save(serverState._id, update);
    const sendMessage = (key: string, channel?: TextChannel | DMChannel | NewsChannel, args: Array<string> = []): Promise<Message> =>
        (channel || message.channel).send(translate(currentState.language, key, ...args));

    await sendMessage('messages.init.start');
    if (!currentState.roles.master || !message.guild.roles.resolve(currentState.roles.master)) {
        console.log('  - master role not exists, create it')
        const role = await message.guild.roles.create({
            data: {
                name: translate(currentState.language, 'name.role.master'),
                color: 'GOLD'
            }
        });
        currentState = await save({ 'roles.master': role.id });
        await sendMessage('messages.init.master-role-created');
    }
    if (!currentState.roles.players || !message.guild.roles.resolve(currentState.roles.players)) {
        console.log('  - players role not exists, create it');
        const role = await message.guild.roles.create({
            data: {
                name: translate(currentState.language, 'name.role.players'),
                color: 'DARK_GREEN'
            }
        });
        currentState = await save({ 'roles.players': role.id });
        await sendMessage('messages.init.players-role-created');
    }
    if (!currentState.channels.players || !message.guild.channels.resolve(currentState.channels.players)) {
        console.log('  - players channel not exists, create it');
        const channel = await message.guild.channels.create(translate(currentState.language, 'name.channel.players'), { type: 'category' });
        currentState = await save({ 'channels.players': channel.id });
    }
    const players = message.guild.channels.resolve(currentState.channels.players);
    if (players) {
        console.log('  - configure players channel roles')
        await players.edit({
            permissionOverwrites: [
                {
                    id: currentState.roles.master,
                    type: 'role',
                    allow: permissions,
                },
                {
                    id: message.guild.id,
                    deny: [ 'VIEW_CHANNEL' ]
                }
            ]
        })
    }

    if (!currentState.channels.withBot || !message.guild.channels.resolve(currentState.channels.withBot)) {
        console.log('  - system channel not exists, create it');
        const channel = await message.guild.channels.create(translate(currentState.language, 'name.channel.with-bot'), { parent: currentState.channels.players });
        currentState = await save({ 'channels.withBot': channel.id });
        await sendMessage('messages.init.config-hint', channel);
        await sendMessage('messages.init.finish', channel, [ currentState.config.prefix ]);
    }
    await message.react('👌');
}
