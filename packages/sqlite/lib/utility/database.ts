// External modules
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

// Data
import { BaseDao } from "../dao/base.dao";

/**
 * Sqlite database
 */
export class SQLiteDatabase {

    // Database connection
    private static connection: SQLiteObject;

    // Init sqlite service
    private static sqLite: SQLite = new SQLite();

    // Daos dictionary
    private static daos: { [key: string]: BaseDao<any> } = {};

    /** 
     * Private constructor, because this class is meant to
     * be used as static only. 
     */
    private constructor() { };

    /**
     * Register dao
     * @param name 
     * @param dao 
     */
    public static register(name: string, dao: BaseDao<any>) {
        // Check if is already
        if (this.isRegistered(name)) {
            return;
        }

        // Assign dao
        this.daos[name] = dao;
    }

    /**
     * Check if dao is registered
     * @param name 
     */
    public static isRegistered(name: string): boolean {
        return name in this.daos;
    }

    /**
     * Get dao
     * @param name 
     */
    public static dao<T>(name: string): BaseDao<T> {
        return this.daos[name];
    }

    /**
     * Connect to database
     * @param name 
     * @param location 
     */
    public static connect(name: string, location: string = 'default'): Promise<SQLiteObject> {
        // Create new promise
        return new Promise((resolve, reject) => {
            // Try to create connection
            this.sqLite.create({
                name: name,
                location: location
            })
                // Process result
                .then((connection: SQLiteObject) => {
                    // Assign object
                    this.connection = connection;

                    // Resolve connection
                    return resolve(this.connection);
                })
                .catch((err) => reject(err));
        });
    }

    /**
     * Execute query
     * @param query 
     * @param params
     */
    public static execute(query: string, params: any = {}): Promise<any> {
        // Check if there is connection to database
        if (!this.connection) {
            return Promise.reject("No database connectio. Did you forget to call 'connect'?");
        }

        // Create new promise
        return this.connection.executeSql(query, params);
    }
}