// External modules
import { Serializable } from "@geph/serializable";
import { ValidationResult } from "@geph/core";
import { ActivatedRoute, Params } from "@angular/router";

// Services
import { AngularService } from "../services/common.service";

// Utilities
import { Subscriber } from "../utility/subscriber.utility";

/**
 * Detail component
 */
export abstract class DetailComponent<T extends Serializable> extends Subscriber {

    // Service
    protected abstract service: AngularService<T>;

    // Activated route
    protected abstract activatedRoute: ActivatedRoute;

    // Entity identifier within url params
    protected identifier: string = 'id';

    /**
     * On construct hook
     */
    protected onConstruct(): void {
        // Subsribe to url params
        this.subscribe('params', this.activatedRoute.params.subscribe((params: Params) => {
            // Check wheter we are on detail or creating new one
            return params[this.identifier] ? this.onDetail(params) : this.onCreate(params);
        }));
    }

    /**
     * On detail
     * @param params 
     */
    protected onDetail(params: Params): void {
        // Get detail
        this.get({ _id: params[this.identifier] } as T);
    }

    /**
     * On create
     * @param params 
     */
    protected onCreate(params: Params): void {
        return;
    }

    /**
     * Get entity
     * @param entity 
     */
    protected get(entity: T) {
        this.service.get(entity).then(validation => this.onDidGet(validation));
    }

    /**
     * On did get hook
     * @param validation 
     */
    protected abstract onDidGet(validation: ValidationResult<T>): void;

    /**
     * Save
     * @param entity 
     */
    protected save(entity: T) {
        this.service.save(entity).then(validation => this.onDidSave(validation));
    }

    /**
     * On did save
     * @param validation 
     */
    protected abstract onDidSave(validation: ValidationResult<T>): void;
}