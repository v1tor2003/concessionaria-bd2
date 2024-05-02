import { Cliente } from "@/app/lib/types"
import database from "@/database/database"

export async function GET() {
  try {
    const [clientes] = await 
    database.execute<Cliente[]>(`
      SELECT * FROM mostrar_clientes ORDER BY nome_pessoa
    `)

    return Response.json({clientes})  
  } catch (error) {
    console.log(error)
  }
}