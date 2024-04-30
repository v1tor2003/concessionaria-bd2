'use client'
import { FieldError, UseFormRegister } from "react-hook-form"
import { z } from "zod"
import { Cliente, Cor, Func } from "../lib/types"
import { useSession } from "next-auth/react"
import SearchInput from "./SearchInputCliente"
import { useState } from "react"
import { getCustomerByName } from "../dashboard/clientes/customerActions"

interface Props {
  funcs?: Func[]
  colors?: Cor[]
  values: any
  placeholders: Map<string, string>
  schema: z.ZodObject<T>
  register: UseFormRegister<any>
  errors: FieldError
}

function formatDate(date: Date): String | undefined {
  if(date === undefined) return 
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}


export default function RenderFormFields<T extends z.ZodRawShape>({ funcs,colors, values, placeholders, register, errors, schema }: Props) {
  const {data:session} = useSession()

  return Object.entries(schema.shape).map(([fieldName, field]) => {
    const type = field._def.typeName.replace('Zod', '').toLowerCase();

    if (fieldName === 'cliente') {
      return (
        <div className="flex flex-col" key={fieldName}>
          <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
          <SearchInput />
          {errors[fieldName] && (
            <p className="text-sm text-red-400">{errors[fieldName].message}</p>
          )}
        </div>
      )  
    }

    if (fieldName === 'cargo') {
      return (
        <div className="flex flex-col" key={fieldName}>
          <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
          <select 
            {...register(fieldName, { value: values[fieldName]})}
            className="capitalize border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]"
          >
            <option key="adm" value="adm">adm</option>
            <option key="funcionario" value="funcionario">funcionario</option>
          </select>
          {errors[fieldName] && (
            <p className="text-sm text-red-400">{errors[fieldName].message}</p>
          )}
        </div>
      )  
    }

    if (fieldName === 'versao') {
      return (
        <div className="flex flex-col" key={fieldName}>
          <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
          <select 
            {...register(fieldName, { value: values[fieldName]})}
            className="capitalize border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]"
          >
            <option key="gold" value="gold">gold</option>
            <option key="plus" value="plus">plus</option>
            <option key="premium" value="premium">premium</option>
          </select>
          {errors[fieldName] && (
            <p className="text-sm text-red-400">{errors[fieldName].message}</p>
          )}
        </div>
      ) 
    }

    if (fieldName === 'cor') {
      return (
        <div className="flex flex-col" key={fieldName}>
          <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
          <select 
            {...register(fieldName, { value: values[fieldName]})}
            className="capitalize border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]"
          >
            {colors && colors.map((color) => <option key={color.nome_cor} value={color.nome_cor}>{color.nome_cor}</option>)}
          </select>
          {errors[fieldName] && (
            <p className="text-sm text-red-400">{errors[fieldName].message}</p>
          )}
        </div>
      ) 
    }

    if (fieldName === 'funcionario') {
      if(funcs && !session?.user?.name)
        return (
          <div className="flex flex-col" key={fieldName}>
            <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
            <select 
              {...register(fieldName, { value: values[fieldName]})}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]"
            >
              {funcs && funcs.map((func) => <option key={func.usuario_func} value={func.usuario_func}>{func.nome_pessoa} ({func.usuario_func})</option>)}
            </select>
            {errors[fieldName] && (
              <p className="text-sm text-red-400">{errors[fieldName].message}</p>
            )}
          </div>
        ) 
      else if (session?.user?.name)
      return (
        <div className="flex flex-col" key={fieldName}>
          <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
          <input
            type={type}
            disabled={true}
            defaultValue={session?.user?.name} 
            className="border disabled:bg-gray-200 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]"
            {...register(fieldName)}
            />
          {errors[fieldName] && (
            <p className="text-sm text-red-400">{errors[fieldName].message}</p>
          )}
        </div>
      ) 
    }

    return (
      <div className="flex flex-col" key={fieldName}>
        <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
        <input
          type={type}
          placeholder={placeholders.get(fieldName)}
          defaultValue={type === 'date' ? formatDate(values[fieldName]) : values[fieldName]} 
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]"
          {...register(fieldName)}
        />
        {errors[fieldName] && (
          <p className="text-sm text-red-400">{errors[fieldName].message}</p>
        )}
      </div>
    );
  });
}

