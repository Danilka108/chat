export interface IBaseResponse<D = undefined> {
    statusCode: number
    message: string
    data?: D
}
