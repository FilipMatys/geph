/**
 * Validation message interface
 */
export interface IValidationMessage {
    text?: string;
    params?: any;
    code?: any;
}

/**
 * Validation result
 */
export class ValidationResult<T> {

    // Is valid flag
    public isValid: boolean = true;

    // Data
    public data: T | undefined;

    // List of errors
    public errors: IValidationMessage[] = [];

    // List of warnings
    public warnings: IValidationMessage[] = [];

    // List of successes
    public successes: IValidationMessage[] = [];

    // Virtual list of messages
    public get messages(): IValidationMessage[] {
        // Concatenate all types of messages
        return this.successes.concat(this.warnings, this.errors);
    }

    /**
     * Constructor
     * @param data 
     */
    constructor(data?: T) {
        // Assign data
        this.data = data;
    }

    /**
     * Add error
     * @param text 
     * @param params 
     * @param code 
     */
    public addError(text: string, params?: any, code?: any) {
        // Set is valid flag
        this.isValid = false;

        // Add error
        this.errors.push({
            text: text,
            params: params,
            code: code
        });
    }

    /**
     * Add warning
     * @param text 
     * @param params 
     * @param code 
     */
    public addWarning(text: string, params?: any, code?: any) {
        // Add warning
        this.warnings.push({
            text: text,
            params: params,
            code: code
        });
    }

    /**
     * Add success
     * @param text 
     * @param params 
     * @param code 
     */
    public addSuccess(text: string, params?: any, code?: any) {
        // Add sucess
        this.successes.push({
            text: text,
            params: params,
            code: code
        });
    }

    /**
     * Append validation
     * @param validation 
     */
    public append(validation: ValidationResult<any>): boolean {
        // Set is valid flag
        this.isValid = this.isValid && validation.isValid;

        // Add messages
        this.errors = this.errors.concat(validation.errors);
        this.warnings = this.warnings.concat(validation.warnings);
        this.successes = this.successes.concat(validation.successes);

        // Return new isValid flag
        return this.isValid;
    }

    /**
     * Resets all messages and isValid flag
     */
    public clear() {
        // Reset is valid flag
        this.isValid = true;

        // Reset messages
        this.errors = [];
        this.warnings = [];
        this.successes = [];
    }

    /**
     * Given expression must be true
     * @param expression 
     * @param error 
     */
    public must(expression: boolean, error: string | IValidationMessage): boolean {
        return this.processValidationResult(expression, error);
    }

    /**
     * Process validation result
     * @param result 
     * @param error 
     */
    private processValidationResult(result: boolean, error: string | IValidationMessage): boolean {
        // Check result
        if (result) {
            return true;
        }

        // Init message
        let message: IValidationMessage = {};

        // We need to add error, but first check, if error is string
        if (typeof error === "string") {
            message.text = error;
        }
        else {
            message = error;
        }

        // Add error
        this.addError(message.text as string, message.params, message.code);

        // Return false
        return false;
    }
}