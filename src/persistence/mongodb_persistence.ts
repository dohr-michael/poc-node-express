import { Persistence } from './persistence';
import { Collection } from 'mongodb';

export class MongodbPersistence<T extends { _id: ID }, ID = any> implements Persistence<T, ID> {
    constructor(private collection: Collection<T>, private afterFind: (value: T) => T = v => v) {}

    findOne(id: ID): Promise<T | undefined> { return this.collection.findOne({ _id: id }).then(v => v ? this.afterFind(v) : undefined); }

    remove(id: ID): Promise<void> { return this.collection.deleteOne({ _id: id }).then(_ => {}); }

    save(id: ID, toUpdate: any): Promise<T> {
        const { _id, ...others } = toUpdate;
        return this.collection.updateOne(
            { _id: id },
            {
                $set: others,
                $setOnInsert: { _id: id } as any,
            },
            { upsert: true }
        ).then(_ => this.findOne(id)).then(t => t ? Promise.resolve(t) : Promise.reject({ status: 404 }));
    }

}
