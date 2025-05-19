import { Injectable } from '@nestjs/common';
import * as vision from '@google-cloud/vision';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class ReceiptService {
    private client: vision.ImageAnnotatorClient;

    constructor() {
        this.client = new vision.ImageAnnotatorClient({
            keyFilename: 'finman-460309-f63bbb8cc6cb.json',
        });
    }

    async processReceipt(filePath: string) {
        try {
            const [result] = await this.client.textDetection(filePath);
            const text = result.textAnnotations[0]?.description || '';

            const receiptData = this.parseReceiptText(text);

            await unlinkAsync(filePath);

            return receiptData;
        } catch (error) {
            console.error('Error processing receipt:', error);
            throw new Error('Failed to process receipt.');
        }
    }

    private parseReceiptText(text: string) {
        // Simple regex-based parsing (customize based on receipt format)
        const totalRegex = /total\s*[:\\-]?\s*\$?(\d+\.\d{2})/i;
        const dateRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/;
        const merchantRegex = /^(.*?)$/m;
        const categoryRegex = '';

        const totalMatch = text.match(totalRegex);
        const dateMatch = text.match(dateRegex);
        const merchantMatch = text.match(merchantRegex);
        const categoryMatch = text.match(categoryRegex);

        return {
            merchant: merchantMatch ? merchantMatch[1].trim() : 'Unknown',
            category: categoryMatch ? categoryMatch[1].trim() : 'Unknown',
            date: dateMatch ? dateMatch[1] : null,
            total: totalMatch ? parseFloat(totalMatch[1]) : null,
            rawText: text,
        };
    }
}