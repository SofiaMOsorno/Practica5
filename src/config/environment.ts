import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
    nodeEnv: 'local' | 'prod';
    port: number;
    aws: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
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

    if (missing.length > 0) {
        throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file against .env.example'
        );
    }

    const nodeEnv = process.env.NODE_ENV as 'local' | 'prod';
    
    if (!['local', 'prod'].includes(nodeEnv)) {
        throw new Error('NODE_ENV must be either "local" or "prod"');
    }

    return {
        nodeEnv,
        port: parseInt(process.env.PORT || '3000', 10),
        aws: {
        region: process.env.AWS_REGION!,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        endpoint: process.env.AWS_ENDPOINT
        },
        database: {
        tableName: `canciones_${nodeEnv}`
        }
    };
}

export const config = validateEnvironment();

console.log(`🔧 Environment: ${config.nodeEnv}`);
console.log(`🗄️  DynamoDB Table: ${config.database.tableName}`);
console.log(`🌍 AWS Region: ${config.aws.region}`);