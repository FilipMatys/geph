import "reflect-metadata";

import { IPropertyDefinition } from './decorator.interfaces';
import { PropertyMetadataKey } from './property.symbol';

/**
 * Property definition
 * @param definition 
 */
export function Property(definition: IPropertyDefinition) {
    return Reflect.metadata(PropertyMetadataKey, definition);
}