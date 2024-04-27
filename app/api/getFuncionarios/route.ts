import database from "@/database/database"
import { RowDataPacket } from "mysql2"
export interface FuncInfo extends RowDataPacket {
  id_func: string
  cargo_func: string
  nome_pessoa: string
  salario_func: number
}

export async function GET() {
  const [rows] = await 
  database.execute<FuncInfo[]>(`
    SELECT 
      funcionario.id_func, 
      funcionario.cargo_func,
      funcionario.salario_func,
      detalhespessoa.nome_pessoa
    FROM
      funcionario
    JOIN
      detalhespessoa ON funcionario.id_detalhepessoa_fk = detalhespessoa.id_detalhepessoa`)

  return Response.json({rows})
}