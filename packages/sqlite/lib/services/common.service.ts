// External modules
import { Serializable, Serializer, ISerializableDefinition } from "@geph/serializable";
import { ValidationResult } from "@geph/core";
import { CommonService as _CommonService, IPopulate, IQueryResult, IQuery } from "@geph/common";

// Dao
import { BaseDao } from "../dao/base.dao";

/**
 * SQLite service
 */
export class CommonService<T extends Serializable> extends _CommonService<T> {

    // Dao
    protected _dao: BaseDao<T>;

    // Dao getter
    public get dao(): BaseDao<T> {
        return this._dao;
    }

    /**
     * Constructor
     * @param target 
     */
    constructor(target: new () => T) {
        // Call super constructor
        super();

        // Init serializer
        let serializer = new Serializer();

        // Get definition
        let definition = serializer.getDefinition(target) as ISerializableDefinition;

        // Set dao
        this._dao = new BaseDao(definition.entity, definition.properties);
    }

    /**
     * Initialize
     */
    protected init(): Promise<ValidationResult<void>> {
        // Init validation
        const validation = new ValidationResult<void>();

        // Create new promise
        return new Promise((resolve) => {
            // Initialize dao
            this._dao.init()
                .then(() => resolve(validation))
                .catch((error) => {
                    // Handle db error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });
    }

    /**
     * Peri hook for Remove list
     * @param args 
     */
    protected periRemoveList(...args: any[]): Promise<ValidationResult<any>> {
        throw new Error('Not implemented');
    }

    /**
     * Peri hook for Change state
     * @param args 
     */
    protected periChangeState(...args: any[]): Promise<ValidationResult<T>> {
        throw new Error('Not implemented');
    }

    /**
     * Remove
     * @param validation 
     * @param args 
     */
    protected periRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve) => {
            // Remove entity
            this._dao.remove(validation.data)
                .then(() => resolve(validation))
                .catch((error) => {
                    // Handle db error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });
    }

    /**
     * Peri hook for Get
     * @param validation 
     * @param populate 
     */
    protected periGet(validation: ValidationResult<T>, populate?: IPopulate[], ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve) => {
            // Get entity
            this._dao.get(validation.data)
                .then(() => resolve(validation))
                .catch((error) => {
                    // Handle db error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });
    }

    /**
     * Peri hook for Get list
     * @param validation 
     * @param query 
     * @param args 
     */
    protected periGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        // Create new promise
        return new Promise((resolve) => {
            // Execute query
            this._dao.getList(query)
                .then((items) => {
                    // Assign data
                    validation.data.items = items;

                    // Also get count of items
                    return this._dao.count(query);
                })
                .then((count) => {
                    // Assign count
                    validation.data.total = count;

                    // Resolve
                    return resolve(validation);
                })
                .catch((error) => {
                    // Handle db error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });

    }

    /**
     * Peri hook for Save
     * @param validation 
     * @param args 
     */
    protected periSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise<ValidationResult<T>>((resolve) => {
            // Save entity
            this._dao.save(validation.data)
                .then((entity) => {
                    // Assign data
                    validation.data = entity;

                    // Resolve
                    return resolve(validation);
                })
                .catch((error) => {
                    // Handle db error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });
    }

    /**
     * Handle DB error
     * @param error 
     * @param validation 
     */
    protected handleDbError(error: any, validation: ValidationResult<any>): Promise<ValidationResult<any>> {
        // Add error to validation
        validation.addError(error);

        // Resolve
        return Promise.resolve(validation);
    }
}