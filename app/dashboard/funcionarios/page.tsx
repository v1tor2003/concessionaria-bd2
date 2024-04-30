'use client'
import Modal from "@/app/components/Modal"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { addFunc, deleteFunc, editFunc, getFuncById } from "./funcActions"
import { z } from "zod"
import { FormAddFuncSchema } from "@/app/lib/schema"
import RenderFormFields from "@/app/components/RenderFormFields"
import { FuncInfo } from "@/app/lib/types"

export type Inputs = z.infer<typeof FormAddFuncSchema>

export default function Funcionarios() {
  const tableLabels = [
    'Id', 'Nome', 'Cargo', 'Salario','Ações'
  ]
  const AddFormPlaceholders = new Map()
  AddFormPlaceholders.set('nome', 'Joao')
  AddFormPlaceholders.set('usuario', 'joao123')
  AddFormPlaceholders.set('senha', '****')
  AddFormPlaceholders.set('salario', '1000.00')
  AddFormPlaceholders.set('tel', '(xx) xxxx-xxxx')

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [funcionarios, setFuncionarios] = useState<FuncInfo[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [data, setData] = useState<Inputs>()
  const [selectedId, setSelectedId] = useState<string>('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(FormAddFuncSchema)
  })
  
  const processAdd: SubmitHandler<Inputs> = async (data) => {
    await addFunc(data)
    reset()
    closeModal()
  }

  const processEdit: SubmitHandler<Inputs> = async (data) => {
    await editFunc(selectedId, data)
    reset()
    closeEditModal()
  }

  const processDelete = async () => {
    await deleteFunc(selectedId)
    closeEditModal()
  }

  const showModal = () => {setIsOpen(true)}
  const showEditModal = async (id: string) => {
    const func = await getFuncById(id)
    
    if(func){
      setSelectedId(func.id_func)
      setData({
        nome: func.nome_pessoa,
        nascimeto: new Date(func.nascimento_pessoa),
        tel: func.phone_pessoa,
        usuario: func.usuario_func,
        senha: func.senha_func,
        salario:  func.salario_func,
        cargo: func.cargo_func
      })
      reset({
        nome: func.nome_pessoa,
        tel: func.phone_pessoa,
        usuario: func.usuario_func,
        senha: func.senha_func,
        salario:  func.salario_func,
        cargo: func.cargo_func
      })
    }
    setIsEditOpen(true)
  }
  const showDeleteModal = (id: string) => { 
    setSelectedId(id)
    setIsDeleteOpen(true)
  }
  const closeDeleteModal = () => setIsDeleteOpen(false)
  const closeModal = () => setIsOpen(false)
  const closeEditModal = () => setIsEditOpen(false)
  
  useEffect(() => {
    fetch('/api/getFuncionarios')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao pegar funcionarios');
        }
        return response.json();
      })
      .then(({ rows }) => {
        console.log(rows)
        setFuncionarios(rows);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [])

  if(loading) return (<h1>Carregando Funcionários...</h1>)
  if(error) return (<h1>Error: {error}</h1>)

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} label="Criar Funcionário">
        <form 
        onSubmit={handleSubmit(processAdd)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields values={data || {}} register={register} errors={errors} placeholders={AddFormPlaceholders} schema={FormAddFuncSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Criar</button>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen} closeModal={closeEditModal} label="Editar Funcionário">
        <form 
        onSubmit={handleSubmit(processEdit)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields values={data || {}} register={register} errors={errors} placeholders={AddFormPlaceholders} schema={FormAddFuncSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Editar</button>
        </form>
      </Modal>
      <Modal isOpen={isDeleteOpen} closeModal={closeDeleteModal} label="Deletar Funcionário">
        <div className="flex justify-end">
          <p className="text-sm mb-4">Deseja apagar este funcionário?</p>
          <button onClick={() => processDelete()} className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white " >Deletar</button>
        </div>
      </Modal>
      <div className={`${isOpen || isEditOpen ? 'blur-sm': ''} flex flex-col items-center justify-center shadow-xl p-10 mt-10 w-5/6`}>
        <div className="flex w-full text-left justify-between">
          <h1 className="text-2xl font-bold">Funcionários:</h1>
          <button onClick={showModal} className="mr-4 bg-[#3a0039] hover:opacity-75 text-white font-bold py-2 px-4 rounded">
            Criar
          </button>
          
        </div>
        <div className="w-full overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block justify-center items-center min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full items-center justify-center text-center text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    {tableLabels.map(label =><th key={label} scope="col" className="px-6 py-4">{label}</th> )}
                  </tr>
                </thead>
                <tbody>
                  {funcionarios && funcionarios.map((func) => 
                      <tr key={func.id_func} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{func.id_func}</td>
                        <td className="whitespace-nowrap px-6 py-4">{func.nome_pessoa}</td>
                        <td className="whitespace-nowrap px-6 py-4">{func.cargo_func}</td>
                        <td className="whitespace-nowrap px-6 py-4">{func.salario_func}</td>
                        <td className="flex gap-2 items-center justify-center whitespace-nowrap px-6 py-4">
                          <FaPencilAlt onClick={async () => showEditModal(func.id_func)} className="hover:cursor-pointer" style={{ color: 'blue' }}/>
                          <FaTrashAlt onClick={() => showDeleteModal(func.id_func)} className="hover:cursor-pointer" style={{ color: 'red' }}/>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
    
}
