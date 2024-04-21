import database from "@/database/database"


export async function GET() {
  const [results] = await database.query('SELECT * FROM funcionario')
  
  return Response.json({results})
}