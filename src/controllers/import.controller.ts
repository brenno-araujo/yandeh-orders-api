import importService from '../services/import-service';

export default class ImportController {
    async execute(event: any) {
        try {
            const result = await importService.execute(event);
            return { statusCode: 200, body: result };
        } catch (error) {
            console.error(error);
            return { statusCode: 500, body: { error: 'Internal Server Error' } };
        }
    }
}
