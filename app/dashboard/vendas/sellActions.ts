'use server'

import { FormAddVendaSchema } from '@/app/lib/schema'
import {  Venda, VendaInfo } from '@/app/lib/types'
import database from '@/database/database'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type Inputs = z.infer<typeof FormAddVendaSchema>

function fomartToSQL(data: Date): string {
  const year = data.getFullYear()
  const month = (data.getMonth() + 1).toString().padStart(2, '0')
  const day = data.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${Number.parseInt(day)+1}`
}

export async function addSell(data: Inputs) {
  const result = FormAddVendaSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }
  result.data.funcionario = result.data.funcionario.substring(result.data.funcionario.indexOf('(') + 1, result.data.funcionario.indexOf(')'))
  let params = Object.values(result.data)
  params[0] = fomartToSQL(new Date(params[0]))
  console.log(params)
  try{
    await database.execute(`
      CALL adicionar_venda (?, ?, ?, ?)
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
  result.data.funcionario = result.data.funcionario.substring(result.data.funcionario.indexOf('(') + 1, result.data.funcionario.indexOf(')'))
  params.push(id)
  Array.prototype.push.apply(params, Object.values(result.data))
  params[1] = fomartToSQL(new Date(params[1]))
  
  try{
    await database.execute<Venda[]>(`
      CALL alterar_venda (?,?,?,?,?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/vendas')
  return { success: true, data: result.data }
}

export async function getSellById(id: number): Promise<VendaInfo | undefined> {
  try {
    const [results, fields] = await database.execute<VendaInfo[]>(`
      CALL pegar_venda_id (?)
    `, [id])

    const venda: VendaInfo = results[0][0]

    return venda
  } catch (error) {
    console.log(error)
  }
  return undefined
}
