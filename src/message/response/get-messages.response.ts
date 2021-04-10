import { IBaseResponse } from 'src/common/interface/base-response.interface'
import { IParsedMessage } from '../interface/parsed-message.interface'

export type IGetMessagesResponse = IBaseResponse<IParsedMessage[]>
