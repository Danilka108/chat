import { IBaseResponse } from 'src/common/interface/base-response.interface'
import { ISearchUser } from '../interfaces/search-user.interface'

export type SearchResponse = IBaseResponse<ISearchUser[]>
