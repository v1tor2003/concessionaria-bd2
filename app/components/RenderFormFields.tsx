import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod"
import { Cor } from "../lib/types";

interface Props {
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


export default function RenderFormFields<T extends z.ZodRawShape>({ colors, values, placeholders, register, errors, schema }: Props) {
  return Object.entries(schema.shape).map(([fieldName, field]) => {
    const type = field._def.typeName.replace('Zod', '').toLowerCase();

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

