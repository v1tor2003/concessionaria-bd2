import { FuncDetails, Venda } from "@/app/lib/types"
import database from "@/database/database"

export async function GET() {
  try {
    const [vendas] = await 
    database.execute<Venda[]>(`
      SELECT * FROM mostrar_vendas ORDER BY data_venda DESC
    `)

    const [funcs] = await 
    database.execute<FuncDetails[]>(`
      SELECT * FROM mostrar_func
    `)
    
    return Response.json({vendas, funcs})  
  } catch (error) {
    console.log(error)
  }
}