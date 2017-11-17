import "reflect-metadata";

import { IEntityDefinition } from '../interfaces/serializable.interfaces';
import { EntityMetadataKey } from '../symbols/entity.symbol';

/**
 * Entity decorator
 * @param definition 
 */
export function Entity(definition: IEntityDefinition) {
    return Reflect.metadata(EntityMetadataKey, definition);
}