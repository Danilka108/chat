import { IBaseResponse } from 'src/common/interface/base-response.interface'
import { IParsedDialog } from '../interface/parsed-dialog.interface'

export type IGetDialogsResponse = IBaseResponse<IParsedDialog[]>
