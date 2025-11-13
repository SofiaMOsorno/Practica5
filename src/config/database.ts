import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from './environment';

const clientConfig: any = {
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
    }
};

if (config.aws.sessionToken) {
    clientConfig.credentials.sessionToken = config.aws.sessionToken;
}

if (config.aws.endpoint) {
    clientConfig.endpoint = config.aws.endpoint;
}

const client = new DynamoDBClient(clientConfig);

export const dynamoDb = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true
    }
});

export const tableName = config.database.tableName;
