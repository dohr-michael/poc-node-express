export interface Persistence<T = any, ID = any> {
    findOne(id: ID): Promise<T | undefined>;
    remove(id: ID): Promise<void>;
    save(id: ID, toUpdate: any): Promise<T>;
}
