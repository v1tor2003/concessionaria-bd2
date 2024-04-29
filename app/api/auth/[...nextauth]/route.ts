import { Func, FuncDetails } from "@/app/lib/types"
import database from "@/database/database"
import NextAuth from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

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

        let [rows] = await 
        database.execute<Func[]>(`
            SELECT * 
            FROM funcionario 
            WHERE usuario_func = ? AND senha_func = ?`
        , [username, password])

        if(rows.length === 0) return null
        
        const id_func = rows[0].id_func
        let [func] = await 
        database.execute<FuncDetails[]>(`
            SELECT 
              funcionario.id_func, 
              funcionario.cargo_func,
              detalhespessoa.nome_pessoa
            FROM
              funcionario
            JOIN
              detalhespessoa ON funcionario.id_detalhepessoa_fk = detalhespessoa.id_detalhepessoa
            WHERE
              funcionario.id_func = ?`
        , [id_func])
        
        const user = {
          id: (func[0].id_func).toString(),
          name: func[0].nome_pessoa,
          role: func[0].cargo_func
        }

        console.log('func', user)
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