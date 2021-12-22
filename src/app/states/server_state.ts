export interface Player {
    id: string;
    characterName: string;
    channel: string;
}

export interface ServerState {
    _id: string;
    config: {
        prefix: string;
    },
    roles: {
        master?: string;
        players?: string;
    },
    channels: {
        players?: string;
        withBot?: string;
    },
    master?: string;
    players: Array<Player>;
    createdAt?: number;
    language?: 'fr' | 'en';
    workflows: { [ id: string ]: any };
}

export function emptyServerState(id: string): ServerState {
    return {
        _id: id,
        config: {
            prefix: '$',
        },
        roles: {},
        channels: {},
        players: [],
        workflows: {},
    };
}
