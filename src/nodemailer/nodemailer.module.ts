import { DynamicModule, Global, Module } from '@nestjs/common'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import { createNodemailerProvider } from './nodemailer.provider'

@Global()
@Module({})
export class NodemailerModule {
    static forRoot(options: SmtpOptions): DynamicModule {
        const nodemailerProvider = createNodemailerProvider(options)
        return {
            module: NodemailerModule,
            providers: [nodemailerProvider],
            exports: [nodemailerProvider],
        }
    }
}
