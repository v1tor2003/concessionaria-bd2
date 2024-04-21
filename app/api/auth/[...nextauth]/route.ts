import database from "@/database/database"
import NextAuth from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

type Func = {
  id_func: string
  usuario_func: string
  cargo_func: string
}

const handler = NextAuth({
  pages: {
    signIn: '/login'
  },
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

        let [results, fields] = await database.execute('SELECT * FROM funcionario WHERE usuario_func = ? AND senha_func = ?', [username, password])
        // @ts-expect-error
        if(results.length === 0) return null
        // @ts-expect-error
        const id_func = results[0].id_func
        const [func] = await database
              .execute(`SELECT 
                  funcionario.id_func, 
                  funcionario.cargo_func,
                  detalhespessoa.nome_pessoa
                FROM
                  funcionario
                JOIN
                  detalhespessoa ON funcionario.id_detalhepessoa_fk = detalhespessoa.id_detalhepessoa
                WHERE
                  funcionario.id_func = ?`, [id_func])
      
        // fazer join entre func e detalhepessoa

        const user = {
          // @ts-expect-error
          id: (func[0].id_func).toString(),
          // @ts-expect-error
          name: func[0].usuario_func,
          // @ts-expect-error
          role: func[0].cargo_func
        }
        return {...user}
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