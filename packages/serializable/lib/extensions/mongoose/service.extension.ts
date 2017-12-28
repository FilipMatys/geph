import { CommonService, IPopulate, IQuery, IQueryResult } from '@geph/common';
import { ValidationResult } from '@geph/core';
import { model, Model } from 'mongoose';
import { MongooseSerializer } from './serializer.extension';
import { Serializable } from '../../classes/serializable.class';

/**
 * Mongoose service
 */
export abstract class MongooseService<T extends Serializable> extends CommonService<T> {

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
        let serializer = new MongooseSerializer();

        // Get target definition
        let definition = serializer.getDefinition(target);

        // Set model
        this._model = model(definition.name, definition.schema);
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
                    validation.data = entity;

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
     * Peri hook for CHANGE STATE
     * @param args 
     */
    protected periChangeState(...args: any[]): any {
        return new Error('Not implemented');
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