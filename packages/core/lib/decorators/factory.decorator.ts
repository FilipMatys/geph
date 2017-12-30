// Factory services
interface IFactoryServices {
    [name: string]: any
}

/**
 * Service factory
 */
class ServiceFactory {
    // Make constructor private
    private constructor() { };

    // Dictionary of services
    private static services: IFactoryServices = {};

    /**
     * Import class
     * @param constructor 
     * @param name 
     */
    public static import<T>(constructor: { new(): T }, name: string): T {
        // Check if instance of class exists
        if (!(name in this.services)) {
            this.services[name] = new constructor();
        }

        // Return instance of service
        return this.services[name];
    }
}

/**
 * Factory decorator
 */
export function Factory<T>(name: string) {
    /**
     * Modify constructor
     */
    return function (constructor: { new(): T }) {

        // Preserve original
        const original = constructor;

        // Construct function
        function construct(constructor: { new(): T }) {
            // Create constructor
            var c: any = function (this: any) {
                return constructor.apply(this);
            }

            // Assign prototype
            c.prototype = constructor.prototype;

            // Create new instance
            return ServiceFactory.import(c, name);
        }

        // Constructor behaviour
        var f: any = function () {
            return construct(original);
        }

        // Copy prototype
        f.prototype = original.prototype;

        // Return new 
        return f;
    }
}