import { ICommonService, IQuery } from '@geph/common';
import { Router, NextFunction, Request, Response } from 'express';

/**
 * Common route
 */
export abstract class CommonRoute {

    // Service
    protected static service: ICommonService<any>;

    // Prefix
    protected static prefix: string;

    /**
     * Create save route
     * @param router
     */
    protected static createSaveRoute(router: Router) {
        router.post(`${this.prefix}/save`, this.saveMiddleware(), (req: Request, res: Response, next: NextFunction) => {
            this.service.save(req.body as any, this.extractSaveRequestData(req, res))
                .then((validation) => res.json(validation))
                .catch((validation) => res.json(validation));
        });
    }

    /**
     * Create get route
     * @param router 
     */
    protected static createGetRoute(router: Router) {
        router.post(`${this.prefix}/get`, this.getMiddleware(), (req: Request, res: Response, next: NextFunction) => {
            this.service.get(req.body as any, undefined, this.extractGetRequestData(req, res))
                .then((validation) => res.json(validation))
                .catch((validation) => res.json(validation));
        });
    }

    /**
     * Create get list route
     * @param router 
     */
    protected static createGetListRoute(router: Router) {
        router.post(`${this.prefix}/list`, this.getListMiddleware(), (req: Request, res: Response, next: NextFunction) => {
            this.service.getList(req.body as IQuery, this.extractGetListRequestData(req, res))
                .then((validation) => res.json(validation))
                .catch((validation) => res.json(validation));
        });
    }

    /**
     * Create remove routes
     * @param router 
     */
    protected static createRemoveRoute(router: Router) {
        router.post(`${this.prefix}/remove`, this.removeMiddleware(), (req: Request, res: Response, next: NextFunction) => {
            this.service.remove(req.body as any, this.extractRemoveRequestData(req, res))
                .then((validation) => res.json(validation))
                .catch((validation) => res.json(validation));
        });
    }

    /**
     * Create remove list route
     * @param router 
     */
    protected static createRemoveListRoute(router: Router) {
        router.post(`${this.prefix}/remove-list`, this.removeListMiddleware(), (req: Request, res: Response, next: NextFunction) => {
            this.service.removeList(req.body as any, this.extractRemoveListRequestData(req, res))
                .then((validation) => res.json(validation))
                .catch((validation) => res.json(validation));
        });
    }

    /**
     * Middleware function
     * @param req 
     * @param res 
     * @param next 
     */
    protected static middleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return (req: Request, res: Response, next: NextFunction): Response | void => {
            // Go to next middleware
            return next();
        }
    }

    /**
     * Save middleware
     */
    protected static saveMiddleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return this.middleware();
    }

    /**
     * Get middleware
     */
    protected static getMiddleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return this.middleware();
    }

    /**
     * Get middleware
     */
    protected static singleMiddleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return this.middleware();
    }

    /**
     * Get list middleware
     */
    protected static getListMiddleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return this.middleware();
    }

    /**
     * Remove middleware
     */
    protected static removeMiddleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return this.middleware();
    }

    /**
     * Remove list middleware
     */
    protected static removeListMiddleware(): (req: Request, res: Response, next: NextFunction) => Response | void {
        return this.middleware();
    }

    /**
     * Extract request data
     */
    protected static extractRequestData(req: Request, res?: Response): any {
        return null;
    }

    /**
     * Extract GET request data
     */
    protected static extractGetRequestData(req: Request, res?: Response): any {
        return this.extractRequestData(req, res);
    }

    /**
     * Extract GET LIST request data
     */
    protected static extractGetListRequestData(req: Request, res?: Response): any {
        return this.extractRequestData(req, res);
    }

    /**
     * Extract SAVE request data
     */
    protected static extractSaveRequestData(req: Request, res?: Response): any {
        return this.extractRequestData(req, res);
    }

    /**
     * Extract REMOVE request data
     */
    protected static extractRemoveRequestData(req: Request, res?: Response): any {
        return this.extractRequestData(req, res);
    }

    /**
     * Extract REMOVE LIST request data
     * @param req 
     * @param res 
     */
    protected static extractRemoveListRequestData(req: Request, res?: Response): any {
        return this.extractRequestData(req, res);
    }

    /**
     * Create routes
     * @param router
     * @param prefix 
     */
    public static create(router: Router) {
        // Create routes
        this.createSaveRoute(router);
        this.createGetRoute(router);
        this.createRemoveRoute(router);
        this.createGetListRoute(router);
    }
} 