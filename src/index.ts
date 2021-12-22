import * as Discord from 'discord.js';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as commands from '/app/commands';
import { MongodbPersistence } from '/persistence/mongodb_persistence';
import { emptyServerState, ServerState } from '/app/states/server_state';
import { translate } from '/i18n';
import { MongoClient } from 'mongodb';

// Read .env files.
require('dotenv').config()

const client = new Discord.Client();

let ready = false;
let ok = true;

const app = require('express')() as express.Application;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.route('/@/ready').get((req, res) => {
    res.status(ready ? 200 : 400).json({
        ready
    });
});

app.route('/@/health').get((req, res) => {
    // TODO check mongo connection.
    const health = ready && ok;
    res.status(health ? 200 : 400).json({
        health
    });
});

(async function () {
    const mongoClient = await MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true });

    const serverStatePersistence = new MongodbPersistence<ServerState>(mongoClient.db().collection<ServerState>('discord_guilds'), s => ({
            ...s,
            config: s.config ? s.config : { prefix: '$' },
            workflows: s.workflows ? s.workflows : {},
            channels: s.channels ? s.channels : {},
            roles: s.roles ? s.roles : {},
            players: s.players ? s.players : [],
        })
    )


    const commandServices = new commands.Services(serverStatePersistence);

    client.on('ready', () => console.log(`Logged in as ${ client.user.tag }`));

    client.on('message', async msg => {
        console.log('on message')
        if (msg.author.id === msg.client.user.id) { return; }
        const serverState = await serverStatePersistence.findOne(msg.guild.id).then(s => s ? s : emptyServerState(msg.guild.id));
        if (!msg.content.startsWith(serverState.config.prefix)) { return }

        const [ cmd, ...args ] = msg.content.slice(serverState.config.prefix.length).split(' ');
        await commandServices.apply(msg, serverState, cmd, ...args).catch(err => {
            console.log('error : ', err);
            let mess = translate(serverState.language, 'messages.oops');
            if (typeof err === 'string' && err.length > 0) {
                mess = mess + ' : ' + err;
            }
            return msg.channel.send(mess);
        });

    });

    client.on('messageReactionRemove', async msg => {
        console.log('on message reaction remove')
    })
    client.on('messageReactionAdd', async msg => {
        console.log('on message reaction add', msg.emoji.identifier)
    })

    await client.login(process.env.DISCORD_TOKEN);
    ready = true;
})().catch(err => {
    console.log(err);
    ok = false;
})

app.listen(8080, () => console.log('App is running'));
