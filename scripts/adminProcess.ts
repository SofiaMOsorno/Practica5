import { ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, tableName } from '../src/config/database';

const DAYS_THRESHOLD = 30;

async function purgeOldRecords() {
    console.log('Admin Process - Factor 12');
    console.log('Starting purge process...');
    console.log(`Table: ${tableName}`);
    console.log(`Threshold: ${DAYS_THRESHOLD} days`);
    
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - (DAYS_THRESHOLD * 24 * 60 * 60 * 1000));
    
    console.log(`Current date: ${now.toISOString()}`);
    console.log(`Threshold date: ${thresholdDate.toISOString()}`);

    try {
        const scanCommand = new ScanCommand({
        TableName: tableName
        });
        
        const result = await dynamoDb.send(scanCommand);
        const items = result.Items || [];
        
        console.log(`Total records found: ${items.length}`);
        
        if (items.length === 0) {
        console.log('No records to process');
        return;
        }

        let deletedCount = 0;
        let keptCount = 0;

        for (const item of items) {
        const createdAt = new Date(item.createdAt);
        
        if (createdAt < thresholdDate) {
            const deleteCommand = new DeleteCommand({
            TableName: tableName,
            Key: { id: item.id }
            });
            
            await dynamoDb.send(deleteCommand);
            console.log(`Deleted: "${item.title}" by ${item.artist} (created: ${createdAt.toISOString()})`);
            deletedCount++;
        } else {
            keptCount++;
        }
        }

        console.log('Purge Summary:');
        console.log(`Kept: ${keptCount} records`);
        console.log(`Deleted: ${deletedCount} records`);
        console.log('Purge process completed successfully');
        console.log('');

    } catch (error) {
        console.error('Error during purge process:', error);
        throw error;
    }
}

purgeOldRecords()
.then(() => {
    console.log('Admin process finished');
    process.exit(0);
})
.catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});