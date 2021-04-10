import { IRedisSession } from './interface/redis-session.interface'

export const isSessionsEqual = (session1: IRedisSession, session2: IRedisSession) => {
    if (
        session1.userID !== session2.userID ||
        session1.ip !== session2.ip ||
        session1.os !== session2.os ||
        session1.browser !== session2.browser
    ) {
        return false
    }

    return true
}
