import { CommonService as _CommonService, IPopulate, IQuery, IQueryResult } from '@geph/common';
import { Serializable } from '@geph/serializable';
import { ValidationResult } from '@geph/core';
import { model, Model, modelNames } from 'mongoose';
import { Serializer } from '../utility/serializer.utility';

/**
 * Mongoose service
 */
export abstract class CommonService<T extends Serializable> extends _CommonService<T> {

    // Model
    protected _model: Model<any>;

    // Model getter
    public get model(): Model<any> {
        return this._model;
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

        // Get target definition
        let definition = serializer.getDefinition(target);

        // We might want to work over entities, that are just
        // abstract representation of one table. So we need
        // to check that the model is not duplicated
        if (modelNames().indexOf(definition.name) !== -1) {
            // Output information
            console.log('[INFO]: Attaching existing model instead of creating new.', definition.name);

            // Get existing model
            this._model = model(definition.name);
        }
        else {
            // Create model
            this._model = model(definition.name, definition.schema);
        }
    }

    /**
     * Peri hook for GET
     * @param validation 
     * @param populate 
     * @param args 
     */
    protected periGet(validation: ValidationResult<T>, populate?: IPopulate[], ...args: any[]): Promise<ValidationResult<T>> {
        // Init query
        let queryToExecute = this._model.findById((validation.data as T)._id).lean();

        // Check for populate
        if (populate && populate.length > 0) {
            queryToExecute.populate(populate);
        }

        // Create new promise
        return new Promise((resolve) => {
            // Execute query
            queryToExecute
                .then((dbEntity) => {
                    // Assign data
                    validation.data = dbEntity as T;

                    // Resolve validation
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
     * Peri hook for GET LIST
     * @param validation 
     * @param query 
     * @param args 
     */
    protected periGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        // Make sure query is set
        query = query || {};

        // Init query
        let queryToExecute = this._model.find(query.filter || {}).lean();

        // Set populate
        if (query.populate && query.populate.length > 0) {
            queryToExecute.populate(query.populate);
        }

        // Set limit
        if (query.limit) {
            queryToExecute.limit(query.limit);
        }

        // Set skip
        if (query.skip) {
            queryToExecute.skip(query.skip);
        }

        // Set distinct
        if (query.distinct) {
            queryToExecute.distinct(query.distinct);
        }

        // Set select
        if (query.select) {
            queryToExecute.select(query.select);
        }

        // Set sort
        if (query.sort) {
            queryToExecute.sort(query.sort);
        }

        // Create new promise
        return new Promise((resolve) => {
            // Execute query
            queryToExecute
                .then((entities) => {
                    // Assign data
                    (validation.data as IQueryResult<T>).items = entities as T[];

                    // Get number of all items
                    return new Promise<number>((resolve, reject) => {
                        // Get count
                        this._model.count(query.filter || {})
                            .then((count) => resolve(count))
                            .catch((error) => reject(error));
                    });
                })
                .then((count: number) => {
                    // Assign data
                    (validation.data as IQueryResult<T>).total = count;

                    // Resolve
                    return resolve(validation)
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
     * Peri hook for SAVE
     * @param validation 
     * @param args 
     */
    protected periSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Check if entity is new
        const isNew = !(validation.data as T)._id;

        // entity is new
        if (isNew) {
            // for sure remove non-existent _id 
            delete (validation.data as T)._id;
        }

        // Create model
        let model = new this._model(validation.data);
        // Set isNew flag
        model.isNew = isNew;

        // Create new promise
        return new Promise((resolve) => {
            // Save entity
            model.save()
                .then((entity: any) => {
                    // Assign entity
                    validation.data = entity.toObject();

                    // Pass result
                    return resolve(validation);
                })
                .catch((error: any) => {
                    // Handle save error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation))
                });
        });
    }

    /**
     * Peri hook for REMOVE
     * @param validation 
     * @param args 
     */
    protected periRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Remove entity
            this._model.remove({ _id: validation.data._id })
                .then(() => resolve(validation))
                .catch((error) => {
                    // Handle save error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });
    }

    /**
     * Peri hook for REMOVE LIST
     * @param validation 
     * @param query 
     * @param args 
     */
    protected periRemoveList(validation: ValidationResult<any>, query: IQuery, ...args: any[]): Promise<ValidationResult<any>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Remove entity
            this._model.remove(query.filter)
                .then(() => resolve(validation))
                .catch((error) => {
                    // Handle save error
                    this.handleDbError(error, validation)
                        .then((validation) => resolve(validation))
                        .catch((validation) => resolve(validation));
                });
        });
    }

    /**
     * Peri hook for CHANGE STATE
     * @param args 
     */
    protected periChangeState(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return this.periSave(validation, ...args);
    }

    /**
     * Handle DB error
     * @param error 
     * @param validation 
     */
    protected handleDbError(error: any, validation: ValidationResult<any>): Promise<ValidationResult<any>> {
        // Add error to validation
        validation.addError(error.message, null, error.code);

        // Resolve
        return Promise.resolve(validation);
    }
}