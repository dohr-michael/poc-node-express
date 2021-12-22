import { default as frRaw } from './fr';

const defaultLang = 'fr';

function flatten(current: any, parent?: string): { [ key: string ]: string } {
    if (typeof current === 'object') {
        return Object.keys(current).reduce((acc, c) => {
            return { ...acc, ...flatten(current[ c ], parent ? `${ parent }.${ c }` : c) }
        }, {})
    } else if (typeof current === 'string') {
        return { [ parent || '' ]: current };
    }
}

const fr = flatten(frRaw);


const messages: { [ lang: string ]: { [ key: string ]: string } } = {
    fr,
}

export function translate(lang: string | undefined, key: string, ...args: Array<string>): string {
    const baseMessage = (messages[ lang || defaultLang ] || messages[ defaultLang ])[ key ] || key;
    return args.reduce((acc, c, idx) => {
        return acc.split(`{${ idx }}`).join(c)
    }, baseMessage);
}
