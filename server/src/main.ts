import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for specific origins (adjust to your needs)
  app.enableCors({
    origin: 'http://localhost:5173', // Allow only your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies or authorization headers
  });

  // Apply the global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Start the server on the specified port or default to 3000
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
