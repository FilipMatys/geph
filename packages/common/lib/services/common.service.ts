import { ValidationResult } from '@geph/core';
import { ICommonService, IPopulate, IQuery, IQueryResult } from '../interfaces/common.interfaces';

/**
 * Common service
 */
export abstract class CommonService<T> implements ICommonService<T> {

    /**
     * Pre hook for GET
     * @param validation 
     * @param args 
     */
    protected preGet(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Peri hook for GET
     * @param validation 
     * @param args 
     */
    protected abstract periGet(validation: ValidationResult<T>, populate?: IPopulate[], ...args: any[]): Promise<ValidationResult<T>>;

    /**
     * Post hook for GET
     * @param validation 
     * @param args 
     */
    protected postGet(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Get detail of entity
     * @param payload 
     * @param populate 
     * @param args 
     */
    public get(payload: T, populate?: IPopulate[], ...args: any[]): Promise<ValidationResult<T>> {
        // Init validation
        let validation = new ValidationResult<T>(payload);

        // Execute hooks
        return this.preGet(validation, ...args)
            .then((validation) => this.periGet(validation, populate, ...args))
            .then((validation) => this.postGet(validation, ...args))
    }

    /**
     * Pre hook for SAVE
     * @param validation 
     * @param args 
     */
    protected preSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Peri hook for SAVE
     * @param validation 
     * @param args 
     */
    protected abstract periSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>>;

    /**
     * Post hook for SAVE
     * @param validation 
     * @param args 
     */
    protected postSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Save entity
     * @param payload 
     * @param args 
     */
    public save(payload: T, ...args: any[]): Promise<ValidationResult<T>> {
        // Init validation
        let validation = new ValidationResult<T>(payload);

        // Execute hooks
        return this.preSave(validation, ...args)
            .then((validation) => this.periSave(validation, ...args))
            .then((validation) => this.postSave(validation, ...args));
    }

    /**
     * Pre hook for REMOVE
     * @param validation 
     * @param args 
     */
    protected preRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Peri hook for REMOVE
     * @param validation 
     * @param args 
     */
    protected abstract periRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>>;

    /**
     * Post hook for REMOVE
     * @param validation 
     * @param args 
     */
    protected postRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Remove entity
     * @param payload
     * @param args 
     */
    public remove(payload: T, ...args: any[]): Promise<ValidationResult<T>> {
        // Init validation
        let validation = new ValidationResult<T>(payload);

        // Execute hooks
        return this.preRemove(validation, ...args)
            .then((validation) => this.periRemove(validation, ...args))
            .then((validation) => this.postRemove(validation, ...args));
    }

    /**
     * Pre hook for GET LIST
     * @param validation 
     * @param query 
     * @param args 
     */
    protected preGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        return Promise.resolve(validation);
    }

    /**
     * Peri hook for GET LIST
     * @param validation 
     * @param query 
     * @param args 
     */
    protected abstract periGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>>; 

    /**
     * Post hook for GET LIST
     * @param validation 
     * @param query 
     * @param args 
     */
    protected postGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        return Promise.resolve(validation);
    }

    /**
     * Get list
     * @param query 
     * @param args 
     */
    public getList(query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        // Init validation
        let validation = new ValidationResult<IQueryResult<T>>({
            items: [],
            total: 0
        });

        // Execute hooks
        return this.preGetList(validation, query, ...args)
            .then((validation) => this.periGetList(validation, query, ...args))
            .then((validation) => this.postGetList(validation, query, ...args));
    }

    /**
     * Pre hook for CHANGE STATE
     * @param validation 
     * @param args 
     */
    protected preChangeState(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Peri hook for CHANGE STATE
     * @param validation 
     * @param args 
     */
    protected abstract periChangeState(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>>;

    /**
     * Post hook for CHANGE STATE
     * @param validation 
     * @param args 
     */
    protected postChangeState(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return Promise.resolve(validation);
    }

    /**
     * Change state
     * @param payload 
     * @param args 
     */
    public changeState(payload: T, ...args: any[]): Promise<ValidationResult<T>> {
        // Init validation
        let validation = new ValidationResult<T>(payload);

        // Execute hooks
        return this.preChangeState(validation, ...args)
            .then((validation) => this.periChangeState(validation, ...args))
            .then((validation) => this.postChangeState(validation, ...args));
    }
}