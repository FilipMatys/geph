/**
 * Entity definition interface
 */
export interface IEntityDefinition {
    name?: string;
    _id?: boolean;
    timestamps?: boolean;
}

/**
 * Property definition
 */
export interface IPropertyDefinition {
    type?: any;
    ref?: new() => any;
    isRequired?: boolean;
    isArray?: boolean;
    enum?: any[];
}

/**
 * Serializable schema
 */
export interface ISerializableSchema {
    [name: string]: IPropertyDefinition;
}

/**
 * Serializable definition
 */
export interface ISerializableDefinition {
    entity: IEntityDefinition;
    properties: ISerializableSchema;
}
