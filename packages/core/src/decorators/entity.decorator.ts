import "reflect-metadata";

import { IEntityDefinition } from './decorator.interfaces';
import { EntityMetadataKey } from './entity.symbol';

/**
 * Entity decorator
 * @param definition 
 */
export function Entity(definition: IEntityDefinition) {
    return Reflect.metadata(EntityMetadataKey, definition);
}