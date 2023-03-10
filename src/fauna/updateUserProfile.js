import { Client, query } from 'faunadb'

import { FAUNA_SECRET } from './faunaKeys'

const updateUserProfile = async (user) => {
    const q = query
    const client = new Client({ secret: FAUNA_SECRET, })
    const userQuery = await client.query(
        q.Update(q.Select('ref', q.Get(q.Match(q.Index('get_user_by_email'), user.email))), {
            data: { ...user }
        })
    )

    if (userQuery) return userQuery.data

}

export default updateUserProfile