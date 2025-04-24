import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(app: INestApplication) {
  try {
    const documentBuilder = new DocumentBuilder()
      .setTitle('Finman')
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);
    Object.values(document.paths).forEach((path) => {
      Object.values(path).forEach((method) => {
        if (
          Array.isArray(method.security) &&
          method.security.includes('public')
        ) {
          method.security = [];
        }
      });
    });

    SwaggerModule.setup('docs', app, document);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
