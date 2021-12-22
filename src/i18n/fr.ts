export default {
    messages: {
        welcome: 'Hello.',
        config: 'Voilà la configuration de ton serveur : ',
        init: {
            'start': 'Je commence à préparer ton serveur pour recevoir tes joueurs.',
            'players-role-created': 'Le rôle  \'Joueurs\' a été créé',
            'master-role-created': 'Le rôle  \'MJ\' a été créé',
            'config-hint': 'Ce channel sera utilisé pour administrer tes parties et ton serveur (changement de config, ajout et suppression de PJ, demande de jet de dés, ...)',
            'finish': 'Le serveur est configuré, il ne te reste qu\'à assigner ton MJ via la commande `{0}set master @tonMj`',
        },
        set: {
            master: {
                help: 'Commande : {0}set master `@master`'
            },
            player: {
                help: 'Commande : {0}set player `@joueur` nom du joueur'
            }
        },
        oops: 'Ooops, une erreur c\'est produite'
    },
    name: {
        role: {
            players: 'Joueurs',
            master: 'MJ',
        },
        channel: {
            players: 'Entres joueurs & maitres',
            'with-bot': 'roll-and-paper_bot',
        }
    },
    errors: {
        'not-a-person': '{0} ne correspond pas à une personne de ton serveur',
        'unknown-person': 'je ne connais pas la personne {0}',
        commands: {
            set: {
                badCommand: 'je ne vois pas ce que tu veux éditer, je ne connais pas d\'éditeur pour \'{0}\', je ne suis capable que de changer que {1}',
                unauthorized: 'tu n\'est pas authorisé à changer ma config',
                master: {
                    'missing': 'tu n\'as pas précisé ton maitre de jeu',
                    'role-missing': 'le role `MJ` n\'exite pas, as tu initialisé le serveur avec `{0}init` ?'
                },
                player: {
                    'missing': 'tu n\'as pas précisé ton joueur ou le nom du personnage',
                    'role-missing': 'le role `Joueurs` n\'exite pas, as tu initialisé le serveur avec `{0}init` ?',
                    'channel-missing': 'le channel `Entres joueurs & maitres` n\'exite pas, as tu initialisé le serveur avec `{0}init` ?',
                    'have-already-character': 'le joueur {0} interprete déjà le personnage {1}, pour pouvoir lui réafecter un nouveau personnage, supprime le channel de son personne existant',
                    'cannot-change-name': 'Je n\'ai pas les droits pour changer le nom de {0} pour {1}',
                }
            },
            init: {
                unauthorized: 'seul le propriétaire du serveur peu m\'initialiser',
            },
            unknown: 'Commande inconnue : {0}'
        },
    }
}
