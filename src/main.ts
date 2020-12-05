import { ValidationPipe } from './common/pipe/validation.pipe'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
// import * as csurf from 'csurf'
// import * as rateLimit from 'express-rate-limit'
import { config } from './config'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter())
    app.use(helmet())
    // app.use(csurf);
    // app.use(rateLimit);

    app.useGlobalPipes(new ValidationPipe())

    await app.listen(config.app.port)
}
bootstrap()
