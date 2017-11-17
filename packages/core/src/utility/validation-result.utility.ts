/**
 * Validation result
 */
export class ValidationResult<T> {

    // Data
    public data: T | undefined;

    /**
     * Constructor
     * @param data 
     */
    constructor(data?: T) {
        // Assign data
        this.data = data;
    }
}