import * as dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
    nodeEnv: 'local' | 'prod' | 'test';
    port: number;
    aws: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
        endpoint?: string;
    };
    database: {
        tableName: string;
    };
}

function validateEnvironment(): EnvironmentConfig {
    const requiredVars = [
        'NODE_ENV',
        'PORT',
        'AWS_REGION',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    const nodeEnv = process.env.NODE_ENV as 'local' | 'prod' | 'test';
    
    if (!['local', 'prod', 'test'].includes(nodeEnv)) {
        throw new Error('NODE_ENV must be one of: local, prod, test');
    }

    if (nodeEnv !== 'test' && missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file against .env.example'
        );
    }

    if (nodeEnv === 'test') {
        return {
            nodeEnv,
            port: 3000,
            aws: {
                region: 'us-east-1',
                accessKeyId: 'test',
                secretAccessKey: 'test'
            },
            database: {
                tableName: 'canciones_test'
            }
        };
    }

    return {
        nodeEnv,
        port: parseInt(process.env.PORT || '3000', 10),
        aws: {
            region: process.env.AWS_REGION || '',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            sessionToken: process.env.AWS_SESSION_TOKEN,
            endpoint: process.env.AWS_ENDPOINT
        },
        database: {
            tableName: `canciones_${nodeEnv}`
        }
    };
}

export const config = validateEnvironment();

console.log(`Environment: ${config.nodeEnv}`);
console.log(`DynamoDB Table: ${config.database.tableName}`);
console.log(`AWS Region: ${config.aws.region}`);
console.log(`Session Token: ${config.aws.sessionToken ? 'Configured' : 'Not configured'}`);
