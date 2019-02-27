// External modules
import { CommonService } from "@geph/common";
import { NavigationExtras, Params } from '@angular/router';

// Data
import { FilterItem } from "./filter-item.class";
import { Subject, Observable } from "rxjs";

/** Filter utility */
export class Filter {

    // Filter items
    public items: { [key: string]: FilterItem<any> } = {}

    // On filter change
    protected changeSource: Subject<NavigationExtras> = new Subject<NavigationExtras>();
    public $change: Observable<NavigationExtras> = this.changeSource.asObservable();

    // On params
    protected paramsSource: Subject<void> = new Subject<void>();
    public $params: Observable<void> = this.paramsSource.asObservable();

    /**
     * Register filter
     * @param name 
     * @param type
     * @param value 
     * @param service 
     */
    public register<T>(name: string, type: number, value: T, service?: CommonService<T>) {
        this.items[name] = new FilterItem(type, value, service);
    }

    /**
     * Remove filter
     * @param name 
     */
    public remove(name: string) {
        delete this.items[name];
    }

    /**
     * Check if filter is set
     * @param name 
     */
    public isSet(name: string): boolean {
        return name in this.items && this.items[name].isSet();
    }

    /**
     * Check if filter is registered
     * @param name 
     */
    public isRegistered(name: string): boolean {
        return name in this.items;
    }

    /**
     * Get filter value
     * @param name 
     */
    public get<T>(name: string): T {
        // Check if filter exists
        if (!this.isRegistered(name)) {
            throw new Error(`Filter '${name}' not registered. Did you forget to call 'register(${name})?'`);
        }

        // Get value
        return this.items[name].value;
    }

    /**
     * Set value
     * @param name 
     * @param value 
     * @param omit
     */
    public set<T>(name: string, value: T, omit: boolean = false): void {
        // Check if filter exists
        if (!this.isRegistered(name)) {
            throw new Error(`Filter '${name}' not registered. Did you forget to call 'register(${name})?'`);
        }

        // Check whether value changed
        if (this.items[name].value === value) {
            // Value did not change, so omit it
            return;
        }

        // Set value
        this.items[name].value = value;

        // Check whether to omit change
        if (omit) {
            return;
        }

        // Call on change hook
        this.onChange();
    }

    /**
     * Params
     * @param params 
     */
    public params(params: Params) {
        // Iterate filters
        for (let name in this.items) {
            // Check if name is in params
            if (!(name in params)) {
                continue;
            }

            // Set filter value
            this.items[name].fromParam(params[name]);
        }

        // Emit params
        this.paramsSource.next();
    }

    /** On change */
    private onChange() {
        // Init extras
        let extras: NavigationExtras = { queryParams: {} };

        // Iterate filters
        for (let name in this.items) {
            // Check if item is set
            if (this.items[name].isSet()) {
                // Add to extras
                (extras.queryParams as any)[name] = this.items[name].toParam();
            }
        }

        // Emit change
        this.changeSource.next(extras);
    }
}