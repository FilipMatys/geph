// External modules
import { ValidationResult } from "@geph/core";
import { CommonService, IQuery, IQueryResult } from "@geph/common";
import { Serializable } from "@geph/serializable";
import { HTTP, HTTPResponse } from "@ionic-native/http";

/**
 * Http service
 */
export abstract class HttpService<T extends Serializable> extends CommonService<T> {

    // Http
    protected abstract http: HTTP;

    // Serializer
    protected serializer: string = 'json';

    // Path
    protected path: string[] = [];

    // Headers
    protected headers: { [key: string]: string } = { 'Content-Type': 'application/json' };

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
     * Peri save hook
     * @param validation 
     * @param args 
     */
    protected periSave(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return this.request('POST', ['save'], validation.data);
    }

    /**
     * Peri change state hook
     * @param validation 
     * @param args 
     */
    protected periChangeState(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return this.request('POST', ['state'], validation.data);
    }

    /**
     * Peri get hook
     * @param validation 
     * @param args 
     */
    protected periGet(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return this.request('POST', ['get'], validation.data);
    }

    /**
     * Peri get list hook
     * @param validation 
     * @param query 
     * @param args 
     */
    protected periGetList(validation: ValidationResult<IQueryResult<T>>, query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>> {
        return this.request('POST', ['list'], query);
    }

    /**
     * Peri remove hook
     * @param validation 
     * @param args 
     */
    protected periRemove(validation: ValidationResult<T>, ...args: any[]): Promise<ValidationResult<T>> {
        return this.request('POST', ['remove'], validation.data);
    }

    /**
     * Remove list
     * @param validation 
     * @param query 
     * @param args 
     */
    protected periRemoveList(validation: ValidationResult<any>, query: IQuery, ...args: any[]): Promise<ValidationResult<any>> {
        return this.request('POST', ['remove-list'], query);
    }

    /**
     * Make request
     * @param method 
     */
    protected request<V>(method: 'POST' | 'GET' | 'PUT' | 'DELETE', relative: string[], data: any = {}, serializer: string = this.serializer): Promise<ValidationResult<V>> {
        // Create new promise
        return new Promise<ValidationResult<V>>((resolve) => {
            // Get headers
            this.alterHeaders(this.headers)
                .then((headers) => {
                    // Set serializer
                    this.http.setDataSerializer(serializer);

                    // Check method
                    switch (method) {
                        case 'GET':
                            // Make request
                            return this.http.get(this.path.concat(relative).join('/'), data, headers);
                        case 'PUT':
                            // Make request
                            return this.http.put(this.path.concat(relative).join('/'), data, headers);
                        case 'DELETE':
                            // Make request
                            return this.http.delete(this.path.concat(relative).join('/'), data, headers);
                        case 'POST':
                        default:
                            // Make request
                            return this.http.post(this.path.concat(relative).join('/'), data, headers);
                    }
                })
                // Process response
                .then((response) => resolve(this.extractData<V>(response)))
                // Handle error
                .catch((response) => this.handlerError(response).then((validation) => resolve(validation)));
        });
    }

    /**
     * Alter headers
     * @param headers 
     */
    protected alterHeaders(headers: any): Promise<any> {
        return Promise.resolve(Object.assign({}, headers));
    }

    /**
     * Extract data
     * @param response 
     */
    protected extractData<V>(response: HTTPResponse): ValidationResult<V> {
        return Object.assign(new ValidationResult<V>(), JSON.parse(response.data));
    }

    /**
     * Handle error
     * @param response 
     */
    protected handlerError(response: HTTPResponse): Promise<ValidationResult<any>> {
        // Init validation
        let validation = new ValidationResult<void>();

        // Add error
        validation.addError(response.error as string);

        // Resolve
        return Promise.resolve(validation);
    }
}