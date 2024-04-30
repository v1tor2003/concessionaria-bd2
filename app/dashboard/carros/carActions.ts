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
      SELECT * FROM mostrar_carro_info
      WHERE id_carro = ?
    `, [id])

    return rows[0]
  } catch (error) {
    console.log(error)
  }
}


export async function deleteCar(id: string) {
  try {
    console.log('todo deletar carro')
  } catch (error) {
    console.log(error)
  }
}