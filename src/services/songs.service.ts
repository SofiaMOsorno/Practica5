import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDb, tableName } from '../config/database';
import { Song, CreateSongDto, UpdateSongDto } from '../models/song.model';

export class SongsService {
    async create(songData: CreateSongDto): Promise<Song> {
        const now = new Date().toISOString();
        const song: Song = {
            id: uuidv4(),
            ...songData,
            createdAt: now,
            updatedAt: now
        };

        const command = new PutCommand({
            TableName: tableName,
            Item: song
        });

        await dynamoDb.send(command);
        return song;
    }

    async findAll(): Promise<Song[]> {
            const command = new ScanCommand({
            TableName: tableName
        });

        const result = await dynamoDb.send(command);
        return (result.Items || []) as Song[];
    }

    async findById(id: string): Promise<Song | null> {
        const command = new GetCommand({
            TableName: tableName,
            Key: { id }
        });

        const result = await dynamoDb.send(command);
        return result.Item as Song || null;
    }

    async update(id: string, updateData: UpdateSongDto): Promise<Song | null> {
        const existingSong = await this.findById(id);
            if (!existingSong) {
            return null;
        }

        const updateExpression: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, any> = {};

        let index = 0;
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                const placeholder = `#attr${index}`;
                const valuePlaceholder = `:val${index}`;
                updateExpression.push(`${placeholder} = ${valuePlaceholder}`);
                expressionAttributeNames[placeholder] = key;
                expressionAttributeValues[valuePlaceholder] = value;
                index++;
            }
        }

        updateExpression.push(`#updatedAt = :updatedAt`);
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        const command = new UpdateCommand({
            TableName: tableName,
            Key: { id },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        });

        const result = await dynamoDb.send(command);
        return result.Attributes as Song;
    }

    async delete(id: string): Promise<boolean> {
        const existingSong = await this.findById(id);
            if (!existingSong) {
            return false;
        }

        const command = new DeleteCommand({
            TableName: tableName,
            Key: { id }
        });

        await dynamoDb.send(command);
        return true;
    }
}

export const songsService = new SongsService();