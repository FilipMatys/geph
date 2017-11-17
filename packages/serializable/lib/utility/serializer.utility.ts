import { IEntityDefinition, IPropertyDefinition, ISerializableDefinition, ISerializableSchema } from '../interfaces/serializable.interfaces';
import { EntityMetadataKey } from '../symbols/entity.symbol';
import { PropertyMetadataKey } from '../symbols/property.symbol';

/**
 * Serializer class 
 * @description Processes entity and property definitions and creates schemas
 */
export class Serializer {
    // Do not allow to make instances
    // of this class
    private constructor() { };

    /**
     * Get property definition
     * @param target 
     * @param propertyKey 
     */
    private static getPropertyDefinition(target: Object, propertyKey: string): IPropertyDefinition {
        return Reflect.getMetadata(PropertyMetadataKey, target, propertyKey)
    }

    /**
     * Get entity definition
     * @param target 
     */
    private static getEntityDefinition(target: Object): IEntityDefinition {
        return Reflect.getMetadata(EntityMetadataKey, target);
    }

    /**
     * Get definition of given entity
     * @param entity 
     */
    public static getDefiniton<T>(entity: new () => T): ISerializableDefinition {
        // Init definition
        let definition: ISerializableDefinition = { properties: {} };

        // Get entity definition
        definition.entity = this.getEntityDefinition(entity);

        // Get target instance
        let target = new entity();
        // And keep original
        const original = target;

        // Init array of property names
        var propertyNames = [];

        // Get all properties including prototypes
        for (; target != null; target = Object.getPrototypeOf(target)) {
            var op = Object.getOwnPropertyNames(target);
            for (var i = 0; i < op.length; i++)
                if (propertyNames.indexOf(op[i]) == -1)
                    propertyNames.push(op[i]);
        }

        // Now iterate each property to get column definition
        propertyNames.forEach((name) => {
            // Assign property definition
            (definition.properties as ISerializableSchema)[name] = this.getPropertyDefinition(original, name);
        });

        // Return definition
        return definition;
    }
}