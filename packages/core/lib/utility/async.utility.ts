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