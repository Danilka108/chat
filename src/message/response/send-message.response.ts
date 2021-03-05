import { IBaseResponse } from 'src/common/interface/base-response.interface'

export interface ISendMessageResponse extends IBaseResponse<{ messageID: number }> {}
