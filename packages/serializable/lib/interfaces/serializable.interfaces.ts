/**
 * Entity definition interface
 */
export interface IEntityDefinition {
    name?: string;
    _id?: boolean;
    timestamps?: boolean;
    index?: any;
    autoIndex?: boolean;
}

/**
 * Property definition
 */
export interface IPropertyDefinition {
    type?: any;
    ref?: new() => any;
    isRequired?: boolean;
    isArray?: boolean;
    isUnique?: boolean;
    isIndexed?: boolean;
    default?: any;
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
