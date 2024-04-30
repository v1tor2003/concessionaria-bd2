'use server'

import { FormAddClienteSchema } from '@/app/lib/schema'
import { Cliente } from '@/app/lib/types'
import database from '@/database/database'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type Inputs = z.infer<typeof FormAddClienteSchema>

export async function addCustomer(data: Inputs) {
  const result = FormAddClienteSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }

  const params = Object.values(result.data)
  try{
    await database.execute(`
      CALL adicionar_cliente (?, ?, ?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/clientes')
  return { success: true, data: result.data }
}

export async function editCustomer(id: string, data: Inputs){
  let params = []
  const result = FormAddClienteSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }
  params.push(id)
  Array.prototype.push.apply(params, Object.values(result.data))

  try{
    await database.execute<Cliente[]>(`
      CALL alterar_cliente (?, ?, ?, ?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/clientes')
  return { success: true, data: result.data }
}

export async function getCustomerById(id: string): Promise<Cliente | undefined> {
  try {
    const [rows] = await database.execute<Cliente[]>(`
      SELECT * FROM clientes 
      WHERE id_cliente = ?
    `, [id])
    return rows[0]
  } catch (error) {
    console.log(error)
  }
  return undefined
}

export async function getCustomerByName(name: string): Promise<Cliente[] | undefined> {
  try {
    const [rows] = await database.execute<Cliente[]>(`
      SELECT * FROM clientes 
      WHERE nome_pessoa LIKE ?
    `, [`%${name}%`])
    return rows.length !== 0 ? rows : undefined
  } catch (error) {
    console.log(error)
  }
  return undefined
}


export async function deleteCustomer(id: string) {
  try {
    await database.execute(`DELETE FROM cliente WHERE id_cliente = ?`, [id])
  } catch (error) {
    console.log(error)
  }
}