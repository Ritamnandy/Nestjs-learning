/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import halmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
async function bootstrap ()
{

  const app = await NestFactory.create( AppModule );
  app.enableCors()
  app.useGlobalPipes( new ValidationPipe() );
  app.use( halmet() )
  app.use( cookieParser() )
  app.enableVersioning( {
    type: VersioningType.URI,
  } );
  await app.listen( process.env.PORT ?? 3000 );
}
void bootstrap();
