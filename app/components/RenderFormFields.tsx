import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod"

interface Props {
  values: any
  placeholders: Map<string, string>
  schema: z.ZodObject<T>
  register: UseFormRegister<any>
  errors: FieldError
}

export default function RenderFormFields<T extends z.ZodRawShape>({values, placeholders, register, errors,schema}: Props) {
  return Object.entries(schema.shape).map(([fieldName, field]) => {
    const type = field._def.typeName.replace('Zod', '').toLocaleLowerCase()
    if(fieldName === 'cargo')
      return(
        <div className="flex flex-col" key={fieldName}>
          <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
          <select 
            {...register('cargo')}
            className='capitalize border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#3a0039]' >
            <option key="adm" value="adm">adm</option>
            <option key="funcionario" value="funcionario">funcionario</option>
          </select>
          {errors[fieldName] && (
            <p className="text-sm text-red-400">{errors[fieldName].message}</p>
          )}
        </div>
      )
    return (
      <div className="flex flex-col" key={fieldName}>
        <label className="capitalize" htmlFor={fieldName}>{fieldName}:</label>
        <input
          type={type}
          placeholder={placeholders.get(fieldName)}
          defaultValue={values[fieldName]}
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
