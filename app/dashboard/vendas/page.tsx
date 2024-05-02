'use client'
import Modal from "@/app/components/Modal"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPencilAlt } from "react-icons/fa"
import { addSell, editSell, getSellById } from "./sellActions"
import { z } from "zod"
import { FormAddVendaSchema } from "@/app/lib/schema"
import RenderFormFields from "@/app/components/RenderFormFields"
import { Func, FuncDetails, Venda, VendaInfo } from "@/app/lib/types"
import { useSession } from "next-auth/react"

export type Inputs = z.infer<typeof FormAddVendaSchema>

function formatDateAsBrazilian(date: Date): String | undefined {
  if(date === undefined) return 
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function Vendas() {
  const {data:session} = useSession()
  const tableLabels = [
    'Id', 'Data', 'Cliente', 'Funcionário','Modelo', 'Cor', 'Versão','Ações'
  ]
  const formPlaceholders = new Map()
  formPlaceholders.set('cliente', 'Joao')
  formPlaceholders.set('funcionario', 'joao123')
  formPlaceholders.set('modelo', '2002 Gol Preto')
  formPlaceholders.set('cor', 'Vermelho')

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [vendas, setVendas] = useState<VendaInfo[]>([])
  const [funcs, setFuncs] = useState<FuncDetails[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [data, setData] = useState<Inputs>()
  const [selectedId, setSelectedId] = useState<string>('')
  const [sell, setSell] = useState<VendaInfo>()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(FormAddVendaSchema)
  })
  
  const processAdd: SubmitHandler<Inputs> = async (data) => {
    await addSell(data)
    reset()
    closeModal()
  }

  const processEdit: SubmitHandler<Inputs> = async (data) => {
    await editSell(selectedId, data)
    reset()
    closeEditModal()
  }

  const showModal = () => {
    const user: string = session?.user?.username ? session?.user?.username : ''
    const name: string = session?.user?.name ? session?.user?.name : ''
    if(user){
      reset({
        funcionario: `${name} (${user})`
      })
    }
    setIsOpen(true)
  }
  const showEditModal = async (id: number) => {
    const sell = await getSellById(id)
    setSell(sell)
    if(sell){
      setSelectedId(sell.id_venda.toString())
      const funcName = funcs.find(f => f.id_func == sell.id_funcionario_fk.toString())
      
      setData({
        data: new Date(sell.data_venda),
        funcionario: funcName ? `${funcName.nome_pessoa} (${funcName.usuario_func})`: '',
        carro: sell.id_carro_fk.toString(),
        cliente: sell.id_cliente_fk.toString(),
      })
    }
    setIsEditOpen(true)
  }
  
  const closeModal = () => setIsOpen(false)
  const closeEditModal = () => setIsEditOpen(false)
 
  useEffect(() => {
    fetch('/api/getVendas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao pegar vendas');
        }
        return response.json();
      })
      .then(({ vendas, funcs  }) => {
        console.log(vendas, funcs)
        setVendas(vendas);
        setFuncs(funcs);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [])

  console.log(data)

  if(loading) return (<h1>Carregando Vendas...</h1>)
  if(error) return (<h1>Error: {error}</h1>)

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} label="Criar Venda">
        <form 
        onSubmit={handleSubmit(processAdd)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields carId='' clienteId='' setValue={setValue} values={data || {}} register={register} errors={errors} placeholders={formPlaceholders} schema={FormAddVendaSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Criar</button>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen} closeModal={closeEditModal} label="Editar Venda">
        <form 
        onSubmit={handleSubmit(processEdit)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields 
            setValue={setValue} 
            carId={sell?.id_carro_fk ? sell?.id_carro_fk.toString() : ''} 
            clienteId={sell?.id_cliente_fk ? sell?.id_cliente_fk.toString() : ''} 
            funcId={sell?.id_funcionario_fk ? sell?.id_funcionario_fk.toString() : ''}
            funcs={funcs} 
            isEdit={true} 
            values={data || {}} 
            register={register} 
            errors={errors} placeholders={formPlaceholders} 
            schema={FormAddVendaSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Editar</button>
        </form>
      </Modal>
      <div className={`${isOpen || isEditOpen ? 'blur-sm': ''} flex flex-col items-center justify-center shadow-xl p-10 mt-10 w-5/6`}>
        <div className="flex w-full text-left justify-between">
          <h1 className="text-2xl font-bold">Vendas:</h1>
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
                  {vendas && vendas.map((venda) => 
                      <tr key={venda.id_venda} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4">{venda.id_venda}</td>
                        <td className="whitespace-nowrap px-6 py-4">{formatDateAsBrazilian(new Date(venda.data_venda))}</td>
                        <td className="whitespace-nowrap px-6 py-4">{venda.nome_cliente}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{venda.usuario_func}</td>
                        <td className="whitespace-nowrap px-6 py-4">{venda.modelo}</td>
                        <td className="whitespace-nowrap px-6 py-4">{venda.nome_cor}</td>
                        <td className="whitespace-nowrap px-6 py-4">{venda.nome_versao}</td>
                        <td className="flex gap-2 items-center justify-center whitespace-nowrap px-6 py-4">
                          <FaPencilAlt onClick={() => showEditModal(venda.id_venda)} className="hover:cursor-pointer" style={{ color: 'blue' }}/>
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
