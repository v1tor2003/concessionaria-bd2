import { Carro, Cor } from "@/app/lib/types"
import database from "@/database/database"

export async function GET() {
  try {
    const [carros] = await 
    database.execute<Carro[]>(`
      SELECT * FROM mostrar_carros
    `)

    const [cores] = await 
    database.execute<Cor[]>(`
      SELECT * FROM cor
    `)
    
    return Response.json({carros, cores})  
  } catch (error) {
    console.log(error)
  }
}