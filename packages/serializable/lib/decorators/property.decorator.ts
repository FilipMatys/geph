import "reflect-metadata";

import { IPropertyDefinition } from '../interfaces/serializable.interfaces';
import { PropertyMetadataKey } from '../symbols/property.symbol';

/**
 * Property definition
 * @param definition 
 */
export function Property(definition: IPropertyDefinition) {
    return Reflect.metadata(PropertyMetadataKey, definition);
}