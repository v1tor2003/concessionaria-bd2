import { Cliente } from "@/app/lib/types"
import database from "@/database/database"

export async function GET() {
  try {
    const [clientes] = await 
    database.execute<Cliente[]>(`
      SELECT * FROM clientes
    `)

    return Response.json({clientes})  
  } catch (error) {
    console.log(error)
  }
}