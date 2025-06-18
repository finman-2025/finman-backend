import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import * as vision from '@google-cloud/vision';

import * as fs from 'fs';
import { promisify } from 'util';

import { responseMessage } from 'src/common/text';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class ReceiptService {
  private client: vision.ImageAnnotatorClient;

  constructor() {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename:
        process.env.GOOGLE_JSON_KEY_PATH || './certs/google-cloud-api-key.json',
    });
  }

  async processReceipt(filePath: string) {
    try {
      const [result] = await this.client.textDetection(filePath);
      const text = result.textAnnotations[0]?.description || '';

      await unlinkAsync(filePath);

      const totalAmount = this.parseTotalAmount(text);
      const paymentTime = this.parsePaymentTime(text);
      const seller = this.parseSeller(text);

      // console.log('Raw text from receipt:', text);
      return {
        seller: seller,
        value: totalAmount,
        date: paymentTime,
      };
    } catch (error) {
      console.error('Error processing receipt:', error);
      throw new ServiceUnavailableException(
        responseMessage.internalServerError,
      );
    }
  }

  private parseTotalAmount(text: string): number | null {
    const totalRegex =
      /(TOTAL|Total|total|AMOUNT|Amount|amount|Tổng cộng|Tổng Cộng|TỔNG CỘNG|Thành tiền|Thành Tiền|THÀNH TIỀN)\s*[:\-\s]*([\d,.]+)/gi;
    const matches = [...text.matchAll(totalRegex)];

    if (!matches.length) return null;

    const amounts = matches.map((match) => {
      const amountStr = match[2].replace(/[^\d]/g, '');
      return parseInt(amountStr, 10);
    });

    return Math.max(...amounts) || null;
  }

  private parsePaymentTime(text: string): string | null {
    const timeRegex =
      /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}([| ]\d{1,2}:\d{2}(:\d{2})?)?)/i;
    const match = text.match(timeRegex);

    if (!match) return null;

    const dateStr = match[0];
    if (!dateStr) return null;

    let datePart = '',
      monthPart = '',
      yearPart = '',
      hourPart = '',
      dateSeparator: string;

    if (dateStr.includes('/')) {
      dateSeparator = '/';
    } else if (dateStr.includes('-')) {
      dateSeparator = '-';
    } else if (dateStr.includes('.')) {
      dateSeparator = '.';
    }

    datePart = dateStr.split(dateSeparator)[0];
    monthPart = dateStr.split(dateSeparator)[1];
    yearPart = dateStr.split(dateSeparator)[2];

    if (yearPart) {
      if (yearPart.includes(' ')) {
        hourPart = yearPart.split(' ')[1];
        yearPart = yearPart.split(' ')[0];
      } else if (yearPart.includes('-')) {
        hourPart = yearPart.split('-')[1];
        yearPart = yearPart.split('-')[0];
      }
    } else {
      yearPart = new Date().getFullYear().toString();
    }

    if (hourPart && hourPart !== '') {
      if (hourPart.includes(':') && hourPart.split(':').length === 2) {
        hourPart = `${hourPart}:00`;
      }
    }

    const dateString = `${yearPart}-${monthPart}-${datePart}T${hourPart || '00:00:00'}`;
    const isoDate = new Date(dateString);
    return isoDate.toISOString();
  }

  private parseSeller(text: string): string | null {
    const sellerKeywords = [
      'Seller',
      'Vendor',
      'Merchant',
      'Người bán',
      'Cửa hàng',
    ];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      for (const keyword of sellerKeywords) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          const sellerMatch = line.match(
            new RegExp(`${keyword}\\s*[:\\s]*(.+)`),
          );
          if (sellerMatch) {
            return sellerMatch[1].trim();
          }

          if (i + 1 < lines.length) {
            return lines[i + 1].trim();
          }
        }
      }
    }

    return lines[0]?.trim() || null;
  }
}
