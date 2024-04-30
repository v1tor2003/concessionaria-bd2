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

export const FormAddCarSchema = z.object({
  modelo: z.string().min(1, {message: 'Modelo é requerido'}),
  ano: z.coerce.number().positive().min(1, {message: 'Ano é requerido'}),
  preco: z.coerce.number().min(1, {message: 'Preço é requerido'}),
  cor: z.string().min(1, {message: 'Cor é requerido'}),
  versao: z.string().min(1, {message: 'Versão é requerida'}),
  quantidade: z.coerce.number().min(1, {message: 'Quantidade é requerida'})
})

export const FormAddClienteSchema = z.object({
  // detalhes
  nome: z.string().min(1, { message: 'Nome é requerido' }),
  nascimeto: z.coerce.date({message: 'Data é requerida'}),
  tel: z.string().regex(brazilianPhoneRegex, 'Telefone inválido'),
})

export const FormAddVendaSchema = z.object({
  data: z.coerce.date({message: 'Data da venda é requerida'}),
  funcionario: z.string().min(1, {message: 'Funcionário é requerido'}),
  modelo: z.coerce.number().min(1, {message: 'Carro é requerido'}),
  cliente: z.coerce.number().min(1, {message: 'Cliente é requerido'})
})