'use server'
import database from "@/database/database"
import { Func } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const body = await req.json()
  const {username, password} = body

  const [rows] = await 
  database.execute<Func[]>(`
    SELECT * 
    FROM funcionario 
    WHERE usuario_func = ? AND senha_func = ?`
  , [username, password])
  
  if(rows.length === 0) return Response.json({error: 'User not found'})

  return Response.json({func: rows[0]})
}