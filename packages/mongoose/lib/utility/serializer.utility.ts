import { Serializer as _Serializer, Types } from '@geph/serializable';
import { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOpts } from 'mongoose';

/**
 * Mongoose serializer
 */
export class Serializer extends _Serializer {

    /**
     * Get definition of entity
     * @param entity 
     */
    public getDefinition<T>(entity: new () => T): {
        name: string;
        schema: Schema
    } {
        // Init definition
        let schemaDefinition: SchemaDefinition = {};

        // init options
        let schemaOptions: SchemaOptions = {};

        // Get definition
        let definition = super.getDefinition(entity);

        // Assign options
        schemaOptions._id = !!definition.entity._id;
        schemaOptions.timestamps = !!definition.entity.timestamps;

        // Check for auto index
        if (definition.entity.autoIndex !== undefined) {
            schemaOptions.autoIndex = !!definition.entity.autoIndex;
        }

        // Now go trought properties and map them to mongoose types
        Object.keys(definition.properties).forEach((name) => {
            // Init schema type options
            let schemaTypeOptions: SchemaTypeOpts<any> = {};

            // Get property definition
            let propertyDefinition = definition.properties[name];

            // Check for reference
            if (propertyDefinition.type === Types.REF) {
                // Assign values
                schemaTypeOptions.type = Schema.Types.ObjectId;
                schemaTypeOptions.ref = this.getEntityDefinition(propertyDefinition.ref as new () => any).name;
            }
            // Check for embedded
            else if (propertyDefinition.type === Types.EMBEDDED) {
                // Assign values
                schemaTypeOptions.type = this.getDefinition(propertyDefinition.ref as new () => any).schema;
            }
            // Now just map other types
            else {
                switch (propertyDefinition.type) {
                    // Date
                    case Types.DATE:
                        schemaTypeOptions.type = Schema.Types.Date;
                        break;
                    // Integer or real
                    case Types.REAL:
                    case Types.INTEGER:
                        schemaTypeOptions.type = Schema.Types.Number;
                        break;
                    // Mixed
                    case Types.MIXED:
                        schemaTypeOptions.type = Schema.Types.Mixed;
                        break;
                    // Text
                    case Types.TEXT:
                        schemaTypeOptions.type = Schema.Types.String;
                        break;
                    // Boolean
                    case Types.BOOLEAN:
                        schemaTypeOptions.type = Schema.Types.Boolean;
                        break;
                    // Unknown
                    default:
                        throw new Error(`Invalid property definition "${propertyDefinition.type}" for "${name}"`);

                }
            }

            // Set common values
            schemaTypeOptions.required = !!propertyDefinition.isRequired;
            schemaTypeOptions.unique = !!propertyDefinition.isUnique;
            
            // Check if indexed is set
            if (propertyDefinition.isIndexed !== undefined) {
                schemaTypeOptions.index = !!propertyDefinition.isIndexed;
            }

            // Check for default
            if (propertyDefinition.default) {
                schemaTypeOptions.default = propertyDefinition.default;
            }

            // Check for enum
            if (propertyDefinition.enum) {
                schemaTypeOptions.enum = propertyDefinition.enum;
            }

            // Now assign type options to schema definition
            if (propertyDefinition.isArray) {
                schemaDefinition[name] = [schemaTypeOptions];
            }
            else {
                schemaDefinition[name] = schemaTypeOptions;
            }
        });

        // Create schema
        let schema = new Schema(schemaDefinition, schemaOptions);

        // Check for index
        if (definition.entity.index) {
            schema.index(definition.entity.index);
        }

        // Return schema
        return {
            name: definition.entity.name,
            schema: schema
        };
    }
} 