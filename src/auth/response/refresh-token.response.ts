import { IBaseResponse } from 'src/common/interface/base-response.interface'
import { IAuthResult } from '../interface/auth-result.interface'

export type IRefreshTokenResponse = IBaseResponse<IAuthResult>
