// External modules
import { Serializable } from "@geph/serializable";
import { ValidationResult } from "@geph/core";
import { IQueryResult, IQuery } from "@geph/common";
import { ActivatedRoute, Params } from "@angular/router";

// Service
import { AngularService } from "../services/common.service";

// Utilities
import { Subscriber } from "../utility/subscriber.utility";

/**
 * List component
 */
export abstract class ListComponent<T extends Serializable> extends Subscriber {

    // Service
    protected abstract service: AngularService<T>;

    /**
     * On construct
     */
    protected onConstruct() {
        // Get list of entities
        this.getList({});
    }

    /**
     * Get list
     * @param query 
     */
    protected getList(query: IQuery) {
        this.service.getList(query).then(validation => this.onDidGetList(validation));
    }

    /**
     * On did get list hook
     * @param validation 
     */
    protected abstract onDidGetList(validation: ValidationResult<IQueryResult<T>>): void;
}