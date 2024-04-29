import { RowDataPacket } from "mysql2"

export interface Func extends RowDataPacket {
  id_func: string        
  usuario_func: string
  senha_func: string
  salario_func:number
  cargo_func : string        
  id_detalhepessoa_fk: number
}

export interface Details {
  nome_pessoa: string
  nascimento_pessoa: string
  phone_pessoa: string
}

export interface FuncDetails extends Func {}
export interface FuncDetails extends Details {}
