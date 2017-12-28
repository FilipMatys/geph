import { IEntityDefinition, IPropertyDefinition, ISerializableDefinition, ISerializableSchema } from '../interfaces/serializable.interfaces';
import { EntityMetadataKey } from '../symbols/entity.symbol';
import { PropertyMetadataKey } from '../symbols/property.symbol';

/**
 * Serializer class 
 * @description Processes entity and property definitions and creates schemas
 */
export class Serializer {
    /**
     * Get property definition
     * @param target 
     * @param propertyKey 
     */
    protected getPropertyDefinition(target: Object, propertyKey: string): IPropertyDefinition {
        return Reflect.getMetadata(PropertyMetadataKey, target, propertyKey)
    }

    /**
     * Get entity definition
     * @param target 
     */
    protected getEntityDefinition(target: Object): IEntityDefinition {
        return Reflect.getMetadata(EntityMetadataKey, target);
    }

    /**
     * Get definition of given entity
     * @param entity 
     */
    public getDefinition<T>(entity: new () => T): ISerializableDefinition | any {
        // Init definition
        let definition: ISerializableDefinition = { entity: {}, properties: {} };

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
            // Get property definition
            let propertyDefinition = this.getPropertyDefinition(original, name);

            // Check if definition was found
            if (!propertyDefinition) {
                return;
            }

            // Assign property definition
            (definition.properties as ISerializableSchema)[name] = propertyDefinition;
        });

        // Return definition
        return definition;
    }
}