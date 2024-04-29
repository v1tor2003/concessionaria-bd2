'use server'

import { FormAddFuncSchema } from '@/app/lib/schema'
import { Func, FuncDetails } from '@/app/lib/types'
import database from '@/database/database'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type Inputs = z.infer<typeof FormAddFuncSchema>

export async function addFunc(data: Inputs) {
  const result = FormAddFuncSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }

  const params = Object.values(result.data)
  try{
    const [rows] = await database.execute<Func[]>(`
      SELECT * 
      FROM funcionario
      WHERE usuario_func = ?
    `, [result.data.usuario])

    if(rows.length !== 0) return {sucess: false, error: 'Nome de usuario ja existente'}

    await database.execute(`
      CALL adicionar_funcionario (?, ?, ?, ?, ?, ?, ?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/funcionarios')
  return { success: true, data: result.data }
}

export async function editFunc(data: Inputs){

}

export async function getFuncById(id: string): Promise<FuncDetails | undefined> {
  try {
    const [rows] = await database.execute<FuncDetails[]>(`
      SELECT 
        funcionario.id_func, 
        funcionario.cargo_func,
        funcionario.usuario_func,
        funcionario.senha_func,
        funcionario.salario_func,
        detalhespessoa.nome_pessoa,
        detalhespessoa.nascimento_pessoa,
        detalhespessoa.phone_pessoa
      FROM
        funcionario
      JOIN
        detalhespessoa ON funcionario.id_detalhepessoa_fk = detalhespessoa.id_detalhepessoa
      WHERE
        funcionario.id_func = ?
    `, [id])
    return rows[0]
  } catch (error) {
    console.log(error)
  }
  return undefined
}