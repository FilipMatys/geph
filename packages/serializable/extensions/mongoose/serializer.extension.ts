import { Serializer } from '../../lib/utility/serializer.utility';
import { Types } from '../../lib/enums/serializable.enums';
import { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOpts } from 'mongoose';

// Add getMongooseSchema to serializer class
Serializer.prototype.getMongooseDefinition = function <T>(entity: new () => T): {
    name?: string;
    schema?: Schema
} {
    // Init definition
    let schemaDefinition: SchemaDefinition = {};

    // init options
    let schemaOptions: SchemaOptions = {};

    // Get definition
    let definition = this.getDefiniton(entity);

    // Assign options
    schemaOptions._id = !!definition.entity._id;
    schemaOptions.timestamps = !!definition.entity.timestamps;

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
        else if (propertyDefinition.type === Schema.Types.Embedded) {
            // Assign values
            schemaTypeOptions.type = this.getMongooseDefinition(propertyDefinition.ref as new () => any).schema;
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
                // Unknown
                default:
                    throw new Error(`Invalid property definition "${propertyDefinition.type}" for "${name}"`);

            }
        }

        // Set common values
        schemaTypeOptions.required = !!propertyDefinition.isRequired;

        // Now assign type options to schema definition
        if (propertyDefinition.isArray) {
            schemaDefinition[name] = [schemaTypeOptions];
        }
        else {
            schemaDefinition[name] = schemaTypeOptions;
        }
    });

    // Return schema
    return {
        name: definition.entity.name,
        schema: new Schema(schemaDefinition, schemaOptions)
    };
}

// Add method to class interface
declare module '../../lib/utility/serializer.utility' {
    interface Serializer {
        getMongooseDefinition: <T>(entity: new () => T) => {
            name?: string;
            schema?: Schema
        }
    }
}