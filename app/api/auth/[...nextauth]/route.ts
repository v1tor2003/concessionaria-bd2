import database from "@/database/database"
import NextAuth from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const {username, password} = credentials as {
          username: string,
          password: string
        }

        const [results, fields] = await database.execute('SELECT * FROM funcionario WHERE usuario_func = ? AND senha_func = ?', [username, password])
        // @ts-expect-error
        if(results.length === 0) return null
        // @ts-expect-error
        const func = await results[0]

        const user = {
          id: (func.id_func).toString(),
          name: (func.usuario_func),
        }
        return {...user, role: 'adm'}
      }
    })
  ],
  callbacks: {
    // we can add properties from the user to the token
    async jwt({token, user}){
      // @ts-expect-error
      if(user) token.role = user.role
      return token
    },
    // we can add properties from the token to the session
    async session({session, token}){
      // @ts-expect-error
      if(session?.user) session.user.role = token.role
      return session
    },
  }
})

export {handler as GET, handler as POST}