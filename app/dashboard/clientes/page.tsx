'use client'
import Modal from "@/app/components/Modal"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { addCustomer, deleteCustomer, editCustomer, getCustomerById } from "./customerActions"
import { z } from "zod"
import { FormAddClienteSchema } from "@/app/lib/schema"
import RenderFormFields from "@/app/components/RenderFormFields"
import { Cliente } from "@/app/lib/types"

export type Inputs = z.infer<typeof FormAddClienteSchema>

function formatDateAsBrazilian(date: Date): String | undefined {
  if(date === undefined) return 
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function Clientes() {
  const tableLabels = [
    'Id', 'Nome', 'Nascimento', 'Telefone','Ações'
  ]
  const formPlaceholders = new Map()
  formPlaceholders.set('nome', 'Joao')
  formPlaceholders.set('tel', '(xx) xxxx-xxxx')

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [data, setData] = useState<Inputs>()
  const [selectedId, setSelectedId] = useState<string>('')
  const [reqClientes, setReqClientes] = useState<boolean>(true)

  const { register, handleSubmit, reset, setValue,formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(FormAddClienteSchema)
  })
  
  const processAdd: SubmitHandler<Inputs> = async (data) => {
    await addCustomer(data)
    reset()
    closeModal()
    setReqClientes(true)
  }

  const processEdit: SubmitHandler<Inputs> = async (data) => {
    await editCustomer(selectedId, data)
    reset()
    closeEditModal()
    setReqClientes(true)
  }

  const processDelete = async () => {
    await deleteCustomer(selectedId)
    closeDeleteModal()
    setReqClientes(true)
  }

  const showModal = () => {
    reset({
      nome: '',
      tel: ''
    })
    setIsOpen(true)
  }
  const showEditModal = async (id: string) => {
    const cliente = await getCustomerById(id)
    console.log(cliente)
    if(cliente){
      setSelectedId(cliente.id_cliente.toString())
      setData({
        nome: cliente.nome_pessoa,
        nascimeto: new Date(cliente.nascimento_pessoa),
        tel: cliente.phone_pessoa,
      })
      reset({
        nome: cliente.nome_pessoa,
        nascimeto: new Date(cliente.nascimento_pessoa),
        tel: cliente.phone_pessoa,
      })
    }
    setIsEditOpen(true)
  }
  const showDeleteModal = (id: string) => { 
    setSelectedId(id)
    setIsDeleteOpen(true)
  }
  const closeModal = () => setIsOpen(false)
  const closeEditModal = () => setIsEditOpen(false)
  const closeDeleteModal = () => setIsDeleteOpen(false)
  
  useEffect(() => {
    fetch('/api/getClientes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao pegar clientes')
        }
        return response.json()
      })
      .then(({ clientes }) => {
        console.log(clientes)
        setClientes(clientes)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      });

    setReqClientes(false)

  }, [reqClientes])

  if(loading) return (<h1>Carregando Clientes...</h1>)
  if(error) return (<h1>Error: {error}</h1>)

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} label="Criar Cliente">
        <form 
        onSubmit={handleSubmit(processAdd)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields values={data || {}} register={register} errors={errors} placeholders={formPlaceholders} schema={FormAddClienteSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Criar</button>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen}  closeModal={closeEditModal} label="Editar Cliente">
        <form 
        onSubmit={handleSubmit(processEdit)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields isEdit={true} setValue={setValue} values={data || {}} register={register} errors={errors} placeholders={formPlaceholders} schema={FormAddClienteSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Editar</button>
        </form>
      </Modal>
      <Modal isOpen={isDeleteOpen} closeModal={closeDeleteModal} label="Deletar Cliente">
        <div className="flex justify-end">
          <p className="text-sm mb-4">Deseja apagar este cliente?</p>
          <button onClick={() => processDelete()} className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white " >Deletar</button>
        </div>
      </Modal>
      <div className={`${isOpen || isEditOpen ? 'blur-sm': ''} flex flex-col items-center justify-center shadow-xl p-10 mt-10 w-5/6`}>
        <div className="flex w-full text-left justify-between">
          <h1 className="text-2xl font-bold">Clientes:</h1>
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
                  {clientes && clientes.map((cliente) => 
                      <tr key={cliente.id_cliente} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{cliente.id_cliente}</td>
                        <td className="whitespace-nowrap px-6 py-4">{cliente.nome_pessoa}</td>
                        <td className="whitespace-nowrap px-6 py-4">{formatDateAsBrazilian(new Date(cliente.nascimento_pessoa))}</td>
                        <td className="whitespace-nowrap px-6 py-4">{cliente.phone_pessoa}</td>
                        <td className="flex gap-2 items-center justify-center whitespace-nowrap px-6 py-4">
                          <FaPencilAlt onClick={async () => showEditModal(cliente.id_cliente.toString())} className="hover:cursor-pointer" style={{ color: 'blue' }}/>
                          {cliente.deletavel ? (<FaTrashAlt onClick={() => showDeleteModal(cliente.id_cliente.toString())} className="hover:cursor-pointer" style={{ color: 'red' }}/>) : (<></>)}
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
