/**
 * Async utility
 */
export class Async {

    /**
     * Delay execution
     * @param amount 
     */
    public static delay(amount: number): Promise<void> {
        // Create new promise
        return new Promise<void>((resolve) => {
            // Set timout
            setTimeout(() => resolve(), amount);
        });
    }

    /**
     * Process one item after another one at a time
     * @param items 
     * @param func 
     * @param args 
     */
    public static step<T, R>(items: T[], func: (item: T, index?: number, ...args: any[]) => Promise<R>, ...args: any[]): Promise<R[]> {
        // Init result
        const result: R[] = [];

        // Check length
        if (!items.length) {
            // Return result
            return Promise.resolve(result);
        }

        // Get copy
        const copy: T[] = items.slice();
        // Get first 
        const first: T = copy.shift() as T;

        // Init index
        let index = 1;

        // Create new promise
        return new Promise<R[]>((resolve, reject) => {
            // Reduce items
            copy.reduce((promise: Promise<R>, item: T) => {
                // Process promise
                return promise.then((output) => {
                    // Add output to result
                    result.push(output);

                    // Execute function
                    return func(item, ++index, ...args);
                });
            }, func(first, index, ...args))
                .then((output) => {
                    // Add output to result
                    result.push(output);

                    // Resole result
                    return resolve(result);
                })
                .catch((exception) => reject(exception));
        });
    }

    /**
     * Sequence
     * @param promises 
     * @param breakOnException 
     */
    public static sequence(promises: Promise<any>[], breakOnException: boolean = false): Promise<any[]> {
        // Init results
        let results: any[] = [];

        // Create new promise
        return new Promise<any[]>((resolve, reject) => {
            // Reduce list of promises
            promises.reduce((prev, next) => prev.then((result) => {
                if (result) {
                    // Add result to list
                    results.push(result);
                }

                // Call next promise
                return next;
            }).catch((error) => {
                // Add error to list
                results.push(error);

                // Check whether to call next promise
                if (breakOnException) {
                    return Promise.reject(error);
                }

                // Otherwise return next promise in sequence
                return next;
            }), Promise.resolve()).then((result) => {
                if (result) {
                    // Add result to list
                    results.push(result);
                }

                // And call resolve
                return resolve(results);
            }).catch((error) => {
                // Add error to list
                results.push(error);

                // Reject
                return reject(results);
            });
        });
    }
}