// External modules
import { Serializable, IEntityDefinition, ISerializableSchema, Types } from "@geph/serializable";
import { IQuery } from "@geph/common";
import * as ObjectId from "bson-objectid";

// Data
import { IBaseDao } from "../interfaces/sqlite.interfaces";

// Utilities
import { SQLiteDatabase } from "../utility/database";

/**
 * Base dao
 */
export class BaseDao<T extends Serializable> implements IBaseDao<T> {

    // Schema
    protected schema: ISerializableSchema;

    // Definition
    protected definition: IEntityDefinition

    /**
     * Constructor
     * @param definition 
     * @param schema 
     */
    constructor(definition: IEntityDefinition, schema: ISerializableSchema) {
        // Assign data
        this.definition = definition;

        // We need to check definition before adding schema
        if (this.definition._id) {
            // Add identifier to schema
            schema['_id'] = {
                type: Types.TEXT
            }
        }

        // Now check for timestamps
        if (this.definition.timestamps) {
            schema['createdAt'] = { type: Types.DATE };
            schema['updatedAt'] = { type: Types.DATE };
        }

        // Assign schema
        this.schema = schema;
    }

    /**
     * Initialize entity table
     */
    public init(): Promise<void> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Init fields
            let fields: string[] = [];

            // Get fields 
            Object.keys(this.schema).forEach((name) => {
                // Check if name is reserved
                if (SQLiteDatabase.isReserved(name)) {
                    // Add underscore to name, so it does not
                    // violate the reserved keyword
                    name = `_${name}`;
                }

                fields.push(`${name} ${this.getSqLiteType(this.schema[name].type)}`);
            });

            // Create table query
            let query = `CREATE TABLE IF NOT EXISTS ${this.definition.name} (${fields.join(', ')})`;

            // Execute query
            return SQLiteDatabase.execute(query)
                .then(() => {
                    // Also create update queries to add any new columns
                    return Promise.all(fields.map(f => new Promise((resolve) => {
                        // Create query
                        const query = `ALTER TABLE ${this.definition.name} ADD COLUMN ${f}`;

                        // Execute query and ignore exception (column already there)
                        SQLiteDatabase.execute(query)
                            .then(() => resolve())
                            .catch(() => resolve());
                    })));
                })
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    /**
     * Save entity
     * @param entity 
     */
    public save(entity: T): Promise<T> {
        // Check whether to insert or update entity
        return !entity._id ? this.insert(entity) : this.update(entity);
    }

    /**
     * Get entity
     * @param entity 
     */
    public get(entity: T): Promise<T> {
        // Create new promise
        return new Promise<T>((resolve, reject) => {
            // Init query
            let query: IQuery = { filter: { _id: entity._id } };

            // Try to find entity
            this.getList(query)
                .then((result) => {
                    // Check if anything was found
                    if (!result.length) {
                        return resolve();
                    }

                    // Resolve result
                    return resolve(result[0]);
                })
                .catch((err) => reject(err));
        });

    }

    /**
     * Get count
     * @param query 
     */
    public count(query: IQuery): Promise<number> {
        // Init where clause
        let where: string = '';

        // Check for filter
        if (query.filter && Object.keys(query.filter)) {
            // Get fields and values
            const { fields, values, operators } = this.getFieldsAndValues(query.filter);

            // Build where clause
            for (let index = 0; index < fields.length; index++) {
                // Init condition
                let condition = index ? ',' : '';

                // Set field and value
                condition = `${condition}${fields[index]}${operators[index]}${values[index]}`;

                // Add condition to clause
                where = where + condition;
            }

        }

        // Build query
        const dbQuery = `SELECT COUNT(*) FROM ${this.definition.name} ${where}`;

        // Create new promise
        return new Promise((resolve, reject) => {
            // Execute query
            SQLiteDatabase.execute(dbQuery)
                .then((result) => resolve(result.rows.item(0)['COUNT(*)']))
                .catch((err) => reject(err));
        });
    }

    /**
     * Get list
     * @param query 
     */
    public getList(query: IQuery): Promise<T[]> {

        // Init where clause
        let where: string = '';

        // Check for filter
        if (query.filter && Object.keys(query.filter)) {
            // Get fields and values
            const { fields, values, operators } = this.getFieldsAndValues(query.filter);

            // Build where clause
            for (let index = 0; index < fields.length; index++) {
                // Init condition
                let condition = index ? ',' : '';

                // Set field and value
                condition = `${condition}${fields[index]}${operators[index]}${values[index]}`;

                // Add condition to clause
                where = where + condition;
            }
        }

        // Init select
        let select: string = '*';

        // Check for select
        if (query.select) {
            select = query.select.split(' ').join(',');
        }

        // Set limit
        let limit: string = query.limit ? `LIMIT ${query.limit}` : '';
        // Set offset
        let offset: string = query.skip ? `OFFSET ${query.skip}` : '';
        // Set order by
        let orderBy: string = query.sort ? `ORDER BY ${query.sort}` : '';

        // Build query
        const dbQuery: string = `SELECT ${select} FROM ${this.definition.name} ${where} ${orderBy} ${limit} ${offset}`;

        // Create new promise
        return new Promise((resolve, reject) => {
            // Execute query
            SQLiteDatabase.execute(dbQuery)
                .then((result) => {
                    // Init rows
                    let rows: T[] = [];

                    // Get rows
                    for (let index = 0; index < result.rows.length; index++) {
                        rows.push(this.parseRow(result.rows.item(index)));
                    }

                    // Return rows
                    return resolve(rows);
                })
                .catch((err) => reject(err));
        });
    }

    /**
     * Remove entities
     * @param entity 
     */
    public remove(entity: T): Promise<T> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Init query
            let query: IQuery = { filter: { _id: entity._id } };

            // Remove entity
            this.removeList(query)
                .then(() => resolve(entity))
                .catch((err) => reject(err));
        });
    }

    /**
     * Remove list
     * @param query 
     */
    public removeList(query: IQuery): Promise<any> {
        // Init where clause
        let where: string = '';

        // Check for filter
        if (query.filter && Object.keys(query.filter)) {
            // Get fields and values
            const { fields, values, operators } = this.getFieldsAndValues(query.filter);

            // Build where clause
            for (let index = 0; index < fields.length; index++) {
                // Init condition
                let condition = index ? ',' : '';

                // Set field and value
                condition = `${condition}${fields[index]}${operators[index]}${values[index]}`;

                // Add condition to clause
                where = where + condition;
            }
        }

        // Build query
        const dbQuery: string = `DELETE FROM ${this.definition.name} ${where}`;

        // Create new promise
        return new Promise((resolve, reject) => {
            // Execute query
            SQLiteDatabase.execute(dbQuery)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    /**
     * Insert entity
     * @param entity 
     */
    private insert(entity: T): Promise<T> {
        // Assign object id
        entity._id = (ObjectId as any)().toString();

        // Check for timestamps
        if (this.definition.timestamps) {
            // Assign dates
            entity.createdAt = new Date();
            entity.updatedAt = entity.createdAt;
        }

        // Get fields and values
        const { fields, values } = this.getFieldsAndValues(entity);

        // Init insert query
        const query = `INSERT INTO ${this.definition.name} (${fields.join(', ')}) VALUES (${values.join(', ')})`;

        // Create new promise
        return new Promise((resolve, reject) => {
            // Execute query
            SQLiteDatabase.execute(query)
                .then(() => resolve(entity))
                .catch((err) => reject(err));
        });
    }

    /**
     * Update entity
     * @param entity 
     */
    private update(entity: T): Promise<T> {
        // Check for timestamps
        if (this.definition.timestamps) {
            // Assign date
            entity.updatedAt = new Date();
        }

        // Get fields and values
        const { fields, values } = this.getFieldsAndValues(entity);

        // Init query
        let query = `UPDATE ${this.definition.name} SET `;

        // Iterate fields
        for (let index = 0; index < fields.length; index++) {
            // Init condition
            let condition = index ? ', ' : '';

            // Set field and value
            condition = `${condition}${fields[index]}=${values[index]}`;

            // Add condition to query
            query = query + condition;
        }

        // Add where
        query = query + ` where _id = '${entity._id}'`;

        // Create new promise
        return new Promise((resolve, reject) => {
            // Execute query
            SQLiteDatabase.execute(query)
                .then(() => resolve(entity))
                .catch((err) => reject(err));
        });
    }

    /**
     * Get fields and values (with operators)
     * @param entity 
     */
    private getFieldsAndValues(entity: T): { fields: string[], values: any[], operators: string[] } {
        // Init result
        let fields: string[] = [];
        let values: string[] = [];
        let operators: string[] = [];

        // Iterate keys
        Object.keys(entity).forEach((name) => {
            // Check if name is defined in schema
            if (!(name in this.schema)) {
                return;
            }

            // Check if name is in reserved words
            if (SQLiteDatabase.isReserved(name)) {
                fields.push(`_${name}`);
            }
            else {
                fields.push(name);
            }

            // Now get property and init value
            let property = (entity as any)[name];
            let value;

            // Check if property has $operator
            if (property.$operator && typeof property !== 'undefined') {
                // Assign value
                value = property.value;

                // Add operator
                operators.push(property.$operator);
            }
            else {
                // Assign value right away
                value = property;

                // Add operator
                operators.push('=');
            }

            // Add value to list of values
            values.push(this.parseValueToSqLite(name, value));
        });

        // Return result
        return { fields, values, operators };
    }

    /**
     * Make sure value is safe float
     * @param value 
     */
    private safeFloat(value: any): number {
        return isNaN(value) || value === null ? 0 : parseFloat(value);
    }

    /**
     * Make sure value is safe integer
     * @param value 
     */
    private safeInteger(value: any): number {
        return isNaN(value) || value === null ? 0 : parseInt(value);
    }

    /**
     * Parse value FROM sqlite
     * @param name 
     * @param value 
     */
    private parseValueFromSqLite(name: string, value: any): any {
        // Get type
        const type = this.schema[name].type;

        // Parse based on type
        switch (type) {
            // REFERENCE
            case Types.REF:
                return { _id: value };

            // TEXT
            case Types.TEXT:
                return value;

            // DATE
            case Types.DATE:
                return new Date(value);

            // REAL
            case Types.REAL:
                return this.safeFloat(value);

            // INTEGER
            case Types.INTEGER:
                return this.safeInteger(value);

            // MIXED/EMBEDDED
            case Types.MIXED:
            case Types.EMBEDDED:
                return JSON.parse(value);

            // BOOLEAN
            case Types.BOOLEAN:
                return !!value;

            // Default
            default:
                return value;
        }
    }

    /**
     * Parse row
     * @param row 
     */
    private parseRow(row: any): T {
        // Init result
        let result: T = {} as any;

        // Iterate row
        Object.keys(row).forEach((name) => {
            // Check if name starts with underscore
            if (name.startsWith("_")) {
                // Remove underscore from name
                name = name.slice(1);
            }

            // Check if name is in schema
            if (!(name in this.schema)) {
                return;
            }

            // Map value
            (result as any)[name] = this.parseValueFromSqLite(name, row[name]);
        });

        // Return result
        return result;
    }

    /**
     * Get sqlite type
     * @param type 
     */
    private getSqLiteType(type: any) {
        // Check type
        switch (type) {
            case Types.BOOLEAN:
                return 'NUMERIC';
            case Types.DATE:
                return 'NUMERIC';
            case Types.EMBEDDED:
            case Types.MIXED:
            case Types.REF:
                return 'TEXT';
            case Types.INTEGER:
                return 'INTEGER';
            case Types.REAL:
                return 'REAL';

        }
    }

    /**
     * Parse value TO sqlite
     * @param name 
     * @param value 
     */
    private parseValueToSqLite(name: string, value: any): any {
        // Get type
        const type = this.schema[name].type;
        const dflt = this.schema[name].default;

        // Check if value is set
        if (!value && dflt) {
            // Assign default value 
            value = dflt;
        }

        // Parse based on type
        switch (type) {
            // REFERENCE
            case Types.REF:
                // Check if value is set
                if (!value) {
                    return `null`;
                }
                // Check if value is string
                else if (typeof (value) === "string") {
                    return `'${value}'`;
                }
                // We suppose its object
                else {
                    return `'${value._id}'`;
                }

            // TEXT
            case Types.TEXT:
                // Check if value is set
                if (!value) {
                    return `null`;
                }

                // Return value
                return `'${value}'`;

            // DATE
            case Types.DATE:
                // Check if value is instance of date
                if (value instanceof Date) {
                    return value.getTime();
                }

                // Convert to date and return
                return new Date(value).getTime();

            // REAL
            case Types.REAL:
                return this.safeFloat(value);

            // INTEGER
            case Types.INTEGER:
                return this.safeInteger(value);

            // EMBEDED/MIXED
            case Types.MIXED:
            case Types.EMBEDDED:
                // This might be TODO, becasuse we should check
                // that embedded values are valid (number/string etc)
                // Stringify
                return `'${JSON.stringify(value)}'`;

            // BOOLEAN
            case Types.BOOLEAN:
                return !value ? 0 : 1;
        }
    }
}