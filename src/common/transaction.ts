import { EntityManager, getConnection } from 'typeorm'

export const transaction = async <T>(
    tryCallback: (manager: EntityManager) => Promise<T> | T,
    catchCallback: (errorMessage: string) => Promise<T> | T
): Promise<T> => {
    const qeuryRunner = getConnection().createQueryRunner()
    const manager = qeuryRunner.manager

    await qeuryRunner.connect()
    await qeuryRunner.startTransaction()

    try {
        const result = await tryCallback(manager)
        await qeuryRunner.commitTransaction()

        return result
    } catch (error) {
        await qeuryRunner.rollbackTransaction()
        const result = await catchCallback(error)

        return result
    } finally {
        await qeuryRunner.release()
    }
}
