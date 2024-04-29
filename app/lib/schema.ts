import { z } from 'zod'

const brazilianPhoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/

export const FormAddFuncSchema = z.object({
  // detalhes
  nome: z.string().min(1, { message: 'Nome é requerido' }),
  nascimeto: z.coerce.date({message: 'Data é requerida'}),
  tel: z.string().regex(brazilianPhoneRegex, 'Telefone inválido'),
  // funcionario
  usuario: z.string().min(1, {message: 'Usuario é requerido'}),
  senha: z.string().min(4, 'Senha deve conter pelo menos 4 caracteres'),
  salario: z.coerce.number().positive().min(1, {message: 'Salário é requerido'}),
  cargo: z.string().min(1, { message: 'Cargo é requerido' })
})