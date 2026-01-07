import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
    status?: number;
    statusCode?: number;
}

export const globalErrorHandler = (
    err: ErrorWithStatus, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const statusCode = err.statusCode || err.status || 500;
    
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    (error as any).status = 404;
    next(error);
};
