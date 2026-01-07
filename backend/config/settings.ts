import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

export interface Config {
    // Server Configuration
    port: number;
    host: string;
    node_env: string;
    frontendUrl: string;
    backendUrl: string;
    
    // MongoDB Configuration
    mongoUri: string;
    mongoDbName: string;
    
    // JWT Authentication
    jwtSecret: string;
    jwtExpiresIn: string;
    https_port?: number;
    
    // Security Settings
    rateLimitWindowMs: number;
    rateLimitMax: number;
    
    // Upload Settings
    uploadLimit: string;
    maxFileSize: number;
    uploadPath: string;
    
    // Mercado Pago Configuration
    mercadoPago: {
        accessToken: string;
        publicKey: string;
        sandbox: boolean;
        webhookSecret?: string;
    };
}

export const config: Config = {
    // Server Configuration
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    node_env: process.env.NODE_ENV || 'production',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
    
    // MongoDB Configuration
    mongoUri: process.env.MONGODB_URI || 'mongodb://admin:adriano123@localhost:27017/livego?authSource=admin',
    mongoDbName: process.env.MONGODB_NAME || 'livego',
    
    // JWT Authentication
    jwtSecret: process.env.JWT_SECRET || '13758fdbfb1787812ba6a4bbc797a61f8f519cd251cf8cae1ce217a5c2014b866c20bc3e0d1b9e62c41f6ce730087d16b37591facdbd4cba4dfb0a1ef4012b9a',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // Security Settings
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
    
    // Upload Settings
    uploadLimit: process.env.UPLOAD_LIMIT || '50mb',
    maxFileSize: Number(process.env.MAX_FILE_SIZE) || 50,
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    
    // Mercado Pago Configuration
    mercadoPago: {
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
        publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || '',
        sandbox: process.env.MERCADO_PAGO_SANDBOX !== 'false',
        webhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET
    }
};

// Validate required configurations
if (!config.jwtSecret) {
    console.warn('WARNING: JWT_SECRET is not set. Authentication will not work properly.');
}

if (!config.mercadoPago.accessToken || !config.mercadoPago.publicKey) {
    console.warn('WARNING: Mercado Pago credentials are not fully configured. Payment processing will not work.');
}