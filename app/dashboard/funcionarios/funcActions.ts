'use server'

import { FormAddFuncSchema } from '@/app/lib/schema'
import { Func, FuncDetails } from '@/app/lib/types'
import database from '@/database/database'
import { z } from 'zod'

type Inputs = z.infer<typeof FormAddFuncSchema>

function fomartToSQL(data: Date): string {
  const year = data.getFullYear()
  const month = (data.getMonth() + 1).toString().padStart(2, '0')
  const day = data.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${Number.parseInt(day)+1}`
}

export async function addFunc(data: Inputs) {
  const result = FormAddFuncSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }

  let params = Object.values(result.data)
  params[1] = fomartToSQL(new Date(params[1]))

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
  
  return { success: true, data: result.data }
}

export async function editFunc(id: string, data: Inputs){
  let params = []
  const result = FormAddFuncSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }
  params.push(id)
  Array.prototype.push.apply(params, Object.values(result.data))
  params[2] = fomartToSQL(new Date(params[2]))

  try{
    await database.execute<Func[]>(`
      CALL alterar_funcionario (?, ?, ?, ?, ?, ?, ?, ?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  return { success: true, data: result.data }
}

export async function getFuncById(id: string): Promise<FuncDetails | undefined> {
  try {
    // call pegar_func_id
    const [rows] = await database.execute<FuncDetails[]>(`
      SELECT *
      FROM mostrar_funcs
      WHERE id_func = ?
    `, [id])
    
    return rows[0]
  } catch (error) {
    console.log(error)
  }
  return undefined
}


export async function deleteFunc(id: string) {
  try {
    await database.execute(`DELETE FROM funcionario WHERE id_func = ?`, [id])
  } catch (error) {
    console.log(error)
  }
}