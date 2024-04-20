'use server'
import database from "@/database/database"

export async function POST(req: Request) {
  const body = await req.json()
  const {username, password} = body

  const [results, fields] = await database.execute('SELECT * FROM funcionario WHERE usuario_func = ? AND senha_func = ?', [username, password])
  // @ts-expect-error
  if(results.length === 0) return Response.json({error: 'User not found'})
  // @ts-expect-error
  const func = await results[0]

  return Response.json({func})
}