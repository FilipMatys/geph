import { ValidationResult } from '@geph/core';
import { ICommonService, IPopulate, IQuery, IQueryResult } from '@geph/common';
import { Serializable } from '@geph/serializable';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

/**
 * Angular service
 */
export class AngularService<T extends Serializable> implements ICommonService<T> {

    // Http
    protected http: Http;

    // Path
    protected path: string[];

    // Init headers
    protected headers: Headers = new Headers({ 'Content-Type': 'application/json' });

    /**
     * Constructor
     * @param http
     * @param path 
     */
    constructor(http: Http, path: string[]) {
        // Assign values
        this.http = http;
        this.path = path;
    }

    /**
     * Get entity
     * @param payload 
     */
    public get(payload: T): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['get']).join('/'), JSON.stringify(payload), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => this.extractData(response))
                .catch((response: Response) => this.handleError(response));
        });
    }

    /**
     * Get list
     * @param query 
     */
    public getList(query: IQuery): Promise<ValidationResult<IQueryResult<T>>> {
        // Create new promise
        return new Promise((resolve) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['list']).join('/'), JSON.stringify(query), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => this.extractData(response))
                .catch((response: Response) => this.handleError(response));
        });
    }

    /**
     * Change state
     * @param payload 
     */
    public changeState(payload: T): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['state']).join('/'), JSON.stringify(payload), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => this.extractData(response))
                .catch((response: Response) => this.handleError(response));
        });
    }

    /**
     * Save
     * @param payload 
     */
    public save(payload: T): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['save']).join('/'), JSON.stringify(payload), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => this.extractData(response))
                .catch((response: Response) => this.handleError(response));
        });
    }

    /**
     * Remove
     * @param payload 
     */
    public remove(payload: T): Promise<ValidationResult<T>> {
        // Create new promise
        return new Promise((resolve) => {
            // Get headers
            this.alterHeaders(this.headers)
                // Send request
                .then((headers) => this.http.post(this.path.concat(['remove']).join('/'), JSON.stringify(payload), {
                    headers: headers
                }).toPromise())
                // Process response
                .then((response: Response) => this.extractData(response))
                .catch((response: Response) => this.handleError(response));
        });
    }

    /**
     * Handle error
     * @param error 
     */
    protected handleError(error: Response | any) {
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