import { ValidationResult } from '@geph/core';
import { IPopulate, IQuery, IQueryResult, CommonService } from '@geph/common';
import { Serializable } from '@geph/serializable';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

/**
 * Angular service
 */
export abstract class AngularService<T extends Serializable> extends CommonService<T> {

    // Http
    protected abstract http: Http;

    // Path
    protected path: string[];

    // Init headers
    protected headers: Headers = new Headers({ 'Content-Type': 'application/json' });

    /**
     * Constructor
     * @param path 
     */
    constructor(path: string[]) {
        // Call super constructor
        super();

        // Assign path
        this.path = path;
    }

    /**
     * Peri get hook
     * @param validation 
     * @param args 
     */
    protected periGet(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['get']).join('/'), JSON.stringify(validation.data), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => resolve(this.extractData(response)))
                .catch((response: Response) => reject(this.handleError(response)));
        });
    }

    /**
     * Peri get list hook
     * @param validation 
     * @param query 
     * @param args 
     */
    protected periGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['list']).join('/'), JSON.stringify(query), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => resolve(this.extractData(response)))
                .catch((response: Response) => reject(this.handleError(response)));
        });
    }

    /**
     * Peri change state hook
     * @param payload 
     */
    protected periChangeState(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['state']).join('/'), JSON.stringify(validation.data), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => resolve(this.extractData(response)))
                .catch((response: Response) => reject(this.handleError(response)));
        });
    }

    /**
     * 
     * @param validation 
     * @param args 
     */
    protected periSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['save']).join('/'), JSON.stringify(validation.data), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => resolve(this.extractData(response)))
                .catch((response: Response) => reject(this.handleError(response)));
        });
    }

    /**
     * Remove
     * @param payload 
     */
    protected periRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['remove']).join('/'), JSON.stringify(validation.data), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => resolve(this.extractData(response)))
                .catch((response: Response) => reject(this.handleError(response)));
        });
    }

    /**
     * Remove list
     * @param query 
     */
    protected periRemoveList(validation: ValidationResult<any>, query: IQuery, ...args: any[]): Promise<ValidationResult<any>> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['remove-list']).join('/'), JSON.stringify(query), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => resolve(this.extractData(response)))
                .catch((response: Response) => reject(this.handleError(response)));
        });
    }

    /**
     * Handle error
     * @param error 
     */
    protected handleError(error: Response | any): Promise<ValidationResult<any>> {
        // Init validation result
        var validation = new ValidationResult<T>();

        // Set error
        validation.addError('REQUEST_FAILED');

        // Return validation
        return Promise.resolve(validation);
    }

    /**
     * Alter headers
     * @param headers
     */
    protected alterHeaders(headers: Headers): Promise<Headers> {
        return Promise.resolve(headers);
    }

    /**
     * Extract data from response
     * @param res 
     */
    protected extractData(res: Response) {
        return Object.assign(new ValidationResult<T>(), res.json());
    }
}