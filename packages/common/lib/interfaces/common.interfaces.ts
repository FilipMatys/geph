import { ValidationResult } from '@geph/core';

// Query interface
export interface IQuery {
    filter?: any;
    term?: string;
    populate?: IPopulate[];
    limit?: number;
    skip?: number;
    sort?: string;
    select?: string;
}

// Query result interface
export interface IQueryResult<T> {
    items?: T[];
    total?: number;
}

// Populate interface
export interface IPopulate {
    path: string;
    select?: string;
    populate?: IPopulate[];
}

// Common service interface
export interface ICommonService<T> {
    // Get detail
    get(payload: T, populate?: IPopulate[], ...args: any[]): Promise<ValidationResult<T>>;
    // Get list
    getList(query: IQuery, ...args: any[]): Promise<ValidationResult<IQueryResult<T>>>;
    // Save
    save(payload: T, ...args: any[]): Promise<ValidationResult<T>>;
    // Change state
    changeState(payload: T, ...args: any[]): Promise<ValidationResult<T>>;
    // Remove
    remove(payload: T, ...args: any[]): Promise<ValidationResult<T>>;
    // Remove list
    removeList(query: IQuery, ...args: any[]): Promise<ValidationResult<any>>;
}