/**
 * Import decorator
 * @param clazz
 */
export function Import(clazz: new () => any, enumerable: boolean = false) {
    /**
     * Property decorator function
     */
    return function (target: Object, key: string) {
        // Assign class instance to property
        Object.defineProperty(target, key, {
            value: new clazz(),
            enumerable: enumerable,
            configurable: true,
            writable: true
        });
    }
}