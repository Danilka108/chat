import { IBaseResponse } from 'src/common/interface/base-response.interface'
import { IParsedDialog } from '../interface/parsed-dialog.interface'

export interface IGetDialogsResponse extends IBaseResponse<IParsedDialog[]> {}
