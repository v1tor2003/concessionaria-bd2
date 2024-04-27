import database from "@/database/database"
import { RowDataPacket } from "mysql2"
import NextAuth from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

export interface Func extends RowDataPacket {
  id_func: string        
  usuario_func: string
  senha_func: string
  salario_func:number
  cargo_func : string        
  id_detalhepessoa_fk: number
}

export interface FuncDetails extends RowDataPacket {
  id_func: string
  nome_pessoa: string
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