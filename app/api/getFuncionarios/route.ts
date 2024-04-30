import { FuncInfo } from "@/app/lib/types"
import database from "@/database/database"

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