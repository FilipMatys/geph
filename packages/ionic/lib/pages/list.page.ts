// External modules
import { ValidationResult } from "@geph/core";
import { IQuery, IQueryResult, CommonService } from "@geph/common";
import { Serializable } from "@geph/serializable";

// Pages
import { Page } from "./base.page";

/**
 * List base
 */
export abstract class ListPage<T extends Serializable> extends Page {

    // Service
    protected abstract service: CommonService<T>;

    /**
     * On ready
     */
    protected onReady() {
        // Get list
        this.getList({});
    }

    /**
     * Get list
     * @param query 
     */
    protected getList(query: IQuery): void {
        this.service.getList(query).then(validation => this.onDidGetList(validation));
    }

    /**
     * On did get list hook
     * @param validation 
     */
    protected abstract onDidGetList(validation: ValidationResult<IQueryResult<T>>): void;
}