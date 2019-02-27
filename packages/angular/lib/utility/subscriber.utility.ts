import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
/**
 * Subscriber utility
 */
export class Subscriber implements OnDestroy {

    // Subscriptions
    private subscriptions: { [key: string]: Subscription } = {};

    /**
     * Subscribe
     * @param name 
     * @param subscription 
     */
    protected subscribe(name: string, subscription: Subscription): void {
        // Check if subscription is already there
        if (name in this.subscriptions) {
            throw new Error(`Trying to subscribe multiple times to a single name '${name}'! Check your implementation to avoid memory leaks.`);
        }

        // Assign subscription
        this.subscriptions[name] = subscription;
    }

    /**
     * Get subscription by name
     * @param name 
     */
    protected subscription(name: string): Subscription {
        // Check if subscription exists
        if (!(name in this.subscriptions)) {
            throw new Error(`Trying to access non existent subscription '${name}'`);
        }

        // Retrieve subscription
        return this.subscriptions[name];
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy() {
        // Unsubscribe all subscriptions
        this.unsubscribe();
    }

    /**
     * Unsubscribe subscription
     * @param name 
     */
    protected unsubscribe(name: string): void;

    /**
     * Unsubscribe all subscriptions
     */
    protected unsubscribe(): void;

    /***
     * Unsubscribe
     */
    protected unsubscribe(name?: string) {
        // Check for name
        if (!name) {
            for (let name in this.subscriptions) {
                // Unsubscribe
                this.subscriptions[name].unsubscribe();

                // Remove from subscriptions
                delete this.subscriptions[name];
            }

            return;
        }

        // Check if name exists
        if (!(name in this.subscriptions)) {
            return;
        }

        // Unsubscribe
        this.subscriptions[name].unsubscribe();
        
        // Remove from subscriptions
        delete this.subscriptions[name];
    }
}