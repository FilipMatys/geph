// External modules
import { Serializable } from "@geph/serializable";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";

// Components
import { ListComponent } from "./list.component";

// Utilities
import { Filter } from "../utility/filter";

/**
 * Filtered list component
 */
export abstract class FilteredListComponent<T extends Serializable> extends ListComponent<T>  {

    // Init filter
    public filter: Filter = new Filter();

    // Router
    protected abstract router: Router;

    // Activated route
    protected abstract activatedRoute: ActivatedRoute;

    /** 
     * On construct 
     */
    protected onConstruct() {
        // Subscribe to filter events
        this.subscribe('filterChange', this.filter.$change.subscribe((extras) => this.onFilterChange(extras)));
        this.subscribe('paramsChange', this.filter.$params.subscribe(() => this.onParamsChange()));

        // Subscribe to query params
        this.subscribe('queryParams', this.activatedRoute.queryParams.subscribe(params => this.filter.params(params)));
    }

    /**
     * On filter change
     * @param extras 
     */
    protected onFilterChange(extras: NavigationExtras) {
        // Reload current route with extras
        this.router.navigate([], extras);
    }

    /** 
     * On params change
     * @description Process filter values and get list
     */
    protected onParamsChange() {
        // Get list
        this.getList({});
    }
}