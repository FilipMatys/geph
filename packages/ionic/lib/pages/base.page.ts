// Utilities
import { Subscriber } from "../utility/subscriber.utility";

/**
 * Page class
 */
export abstract class Page extends Subscriber {

    /**
     * On construct hook
     * @description This should implement platform ready, but 
     * ionic as a package is too complex, so the build would
     * be broken all the time. If platform ready is needed,
     * it has to be implemented as an override.
     */
    protected onConstruct(): void {
        // Call on ready hook
        this.onReady();
    };

    /**
     * On ready hook
     */
    protected onReady(): void {}
}