'use server'

import { FormAddCarSchema } from '@/app/lib/schema'
import { Carro } from '@/app/lib/types'
import database from '@/database/database'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type Inputs = z.infer<typeof FormAddCarSchema>

export async function addCar(data: Inputs) {
  const result = FormAddCarSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }

  const params = Object.values(result.data)
  console.log(params)
 
  try{
    await database.execute(`
      CALL adicionar_carro (?,?,?,?,?,?)
    `, params)
  }catch(error: unknown){
    console.log(error)
  }
  
  revalidatePath('/dashboard/carros')
  return { success: true, data: result.data }
}

export async function editCar(id: string, data: Inputs){
  let params = []
  const result = FormAddCarSchema.safeParse(data)
  
  if(result.error) return { success: false, error: result.error.format() }
  params.push(id)
  Array.prototype.push.apply(params, Object.values(result.data))

  try {
    await database.execute(`
      CALL alterar_carro (?,?,?,?,?,?,?)
    `, params)
  } catch (error) {
    console.log(error)
  }
  
  revalidatePath('/dashboard/carros')
  return { success: true, data: result.data }
}

export async function getCarById(id: string): Promise<Carro | undefined> {
  try {
    const [rows] = await database.execute<Carro[]>(`
      SELECT * FROM mostrar_carros
      WHERE id_carro = ?
    `, [id])

    return rows[0]
  } catch (error) {
    console.log(error)
  }
}

export async function getCarByInfo(value: string) {
  try {
    const params = value.split(' ')
    let sql = 'SELECT * FROM mostrar_carros WHERE '
    params[0] ? sql += `ano_fab LIKE '${params[0]}%' ` : ''
    params[1] ? sql += `AND modelo = '${params[1]}' ` : ''
    params[2] ? sql += `AND nome_cor = '${params[2]}'` : ''

    const [rows] = await database.execute<Carro[]>(sql, [])
    return rows
  } catch (error) {
    console.log(error)
  }
}

export async function deleteCar(id: string) {
  try {
    await database.execute(`DELETE FROM carro WHERE id_carro = ?`, [id])
  } catch (error) {
    console.log(error)
  }
}