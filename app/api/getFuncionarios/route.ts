import { FuncInfo } from "@/app/lib/types"
import database from "@/database/database"

export async function GET() {
  const [rows] = await 
  database.execute<FuncInfo[]>(`
    SELECT * FROM mostrar_funcs
  `)

  return Response.json({rows})
}