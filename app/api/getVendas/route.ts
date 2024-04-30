import { Func, Venda } from "@/app/lib/types"
import database from "@/database/database"

export async function GET() {
  try {
    const [vendas] = await 
    database.execute<Venda[]>(`
      SELECT * FROM mostrar_vendas
    `)

    const [funcs] = await 
    database.execute<Func[]>(`
      SELECT 
        funcionario.id_func, 
        funcionario.cargo_func,
        funcionario.salario_func,
        funcionario.usuario_func,
        detalhespessoa.nome_pessoa
      FROM
        funcionario
      JOIN
        detalhespessoa ON funcionario.id_detalhepessoa_fk = detalhespessoa.id_detalhepessoa`
    )
    console.log(funcs)
    return Response.json({vendas, funcs})  
  } catch (error) {
    console.log(error)
  }
}