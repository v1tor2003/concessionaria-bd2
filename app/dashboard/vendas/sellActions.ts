'use server'

import { FormAddVendaSchema } from '@/app/lib/schema'
import { Venda } from '@/app/lib/types'
import database from '@/database/database'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type Inputs = z.infer<typeof FormAddVendaSchema>

export async function addSell(data: Inputs) {
  const result = FormAddVendaSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }

  const params = Object.values(result.data)
  try{
    await database.execute(`
      CALL adicionar_venda (?, ?, ?, ?, ?, ?, ?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/vendas')
  return { success: true, data: result.data }
}

export async function editSell(id: string, data: Inputs){
  let params = []
  const result = FormAddVendaSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }
  params.push(id)
  Array.prototype.push.apply(params, Object.values(result.data))

  try{
    await database.execute<Venda[]>(`
      CALL alterar_venda ()
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/vendas')
  return { success: true, data: result.data }
}

export async function getSellById(id: string): Promise<Venda | undefined> {
  try {
    // call venda_por_id
    const [rows] = await database.execute<Venda[]>(`
      CALL pegar_venda_id (?)
    `, [id])
    return rows[0]
  } catch (error) {
    console.log(error)
  }
  return undefined
}
