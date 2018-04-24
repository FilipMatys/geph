// External modules
import { IQuery } from "@geph/common";
import { Serializable } from "@geph/serializable";

/**
 * Base dao interface
 */
export interface IBaseDao<T extends Serializable> {
    save: (entity: T) => Promise<T>;
    get: (entity: T) => Promise<T>;
    remove: (entity: T) => Promise<T>;
    removeList: (query: IQuery) => Promise<any>;
    getList: (query: IQuery) => Promise<T[]>;
}