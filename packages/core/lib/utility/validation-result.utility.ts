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
    public data?: T;

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
        // Assign data if data is set
        if (data) {
            this.data = data;
        }
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
     * Check that property is defined
     * @param value 
     */
    public isDefined(value: (object: T | undefined) => any, error: string | IValidationMessage): boolean {
        return this.processValidationResult(value(this.data) != null, error);
    }

    /**
     * Check that property is not empty
     * @param value 
     * @param error 
     */
    public isNotEmpty(value: (object: T | undefined) => any, error: string | IValidationMessage): boolean {
        // Get value
        let _value = value(this.data);

        // Check for array
        if (_value instanceof Array) {
            return this.processValidationResult(_value && _value.length > 0, error);
        }
        // Check for string
        else if (typeof _value === "string") {
            return this.processValidationResult(_value != null && _value.trim().length > 0, error);
        }
        // And others
        else {
            return this.processValidationResult(!!_value, error);
        }
    }

    /**
     * Check that property is greater or equal
     * @param value 
     * @param number 
     * @param error 
     */
    public isGreaterOrEqual(value: (object: T | undefined) => number, number: number, error: string | IValidationMessage) : boolean {
        return this.processValidationResult(value(this.data) >= number, error);
    }

    /**
     * Check that property is lesser or equal
     * @param value 
     * @param number 
     * @param error 
     */
    public isLesserOrEqual(value: (object: T | undefined) => number, number: number, error: string | IValidationMessage): boolean {
        return this.processValidationResult(value(this.data) <= number, error);
    }

    /**
     * Check that property is equal
     * @param value 
     * @param valueToCompare 
     * @param error 
     */
    public isEqual(value: (object: T | undefined) => any, valueToCompare: any, error: string | IValidationMessage): boolean {
        return this.processValidationResult(value(this.data) === valueToCompare, error);
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