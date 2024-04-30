'use client'
import Modal from "@/app/components/Modal"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"
import { z } from "zod"
import { FormAddCarSchema } from "@/app/lib/schema"
import RenderFormFields from "@/app/components/RenderFormFields"
import { addCar, editCar, getCarById, deleteCar } from "./carActions"
import { Carro, Cor } from "@/app/lib/types"

export type Inputs = z.infer<typeof FormAddCarSchema>

export default function Carros() {
  const tableLabels = [
    'Id', 'Modelo', 'Ano','Preco', 'Cor','Versão', 'Quantidade', 'Ações'
  ]
  const formPlaceholders = new Map()
  formPlaceholders.set('modelo', 'Gol')
  formPlaceholders.set('ano', '2024')
  formPlaceholders.set('preco', '10000')
  formPlaceholders.set('cor', 'Azul')
  formPlaceholders.set('versao', 'gold')
  formPlaceholders.set('quantidade', '10')

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [carros, setCarros] = useState<Carro[]>([])
  const [cores, setCores] = useState<Cor[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [data, setData] = useState<Inputs>()
  const [toUpdateId, setTuUpdateId] = useState<string>('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(FormAddCarSchema)
  })
  
  const processAdd: SubmitHandler<Inputs> = async (data) => {
    await addCar(data)
    reset()
    closeModal()
  }

  const processEdit: SubmitHandler<Inputs> = async (data) => {
    await editCar(toUpdateId, data)
    reset()
    closeEditModal()
  }

  const showModal = () => setIsOpen(true)
  const showEditModal = async (id: string) => {
    const car = await getCarById(id)
    console.log(car)
    if(car){
      setTuUpdateId(car.id_carro.toString())
      setData({
        modelo: car.modelo,
        ano: car.ano_fab,
        preco: Number.parseFloat(car.preco.toFixed(2)),
        cor: car.nome_cor,
        versao: car.nome_versao,
        quantidade: car.quantidade,
      })
      reset({
        modelo: car.modelo,
        ano: car.ano_fab,
        preco: Number.parseFloat(car.preco.toFixed(2)),
        cor: car.nome_cor,
        versao: car.nome_versao,
        quantidade: car.quantidade,
      })
    }
    setIsEditOpen(true)
  }
  const closeModal = () => setIsOpen(false)
  const closeEditModal = () => setIsEditOpen(false)

  useEffect(() => {
    fetch('/api/getCarros')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao pegar carros')
        }
        return response.json();
      })
      .then(({ carros, cores }) => {
        console.log(carros, cores)
        setCarros(carros)
        setCores(cores)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if(loading) return (<h1>Carregando Carros...</h1>)
  if(error) return (<h1>Error: {error}</h1>)

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} label="Criar Carro">
        <form 
        onSubmit={handleSubmit(processAdd)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields colors={cores} values={data || {}} register={register} errors={errors} placeholders={formPlaceholders} schema={FormAddCarSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Criar</button>
        </form>
      </Modal>
      <Modal isOpen={isEditOpen} closeModal={closeEditModal} label="Editar Carro">
        <form 
        onSubmit={handleSubmit(processEdit)}
        className="grid grid-cols-2 gap-2">
          <RenderFormFields colors={cores} values={data || {}} register={register} errors={errors} placeholders={formPlaceholders} schema={FormAddCarSchema}/>    
          <button className="bg-[#3a0039] hover:opacity-75 rounded-md mt-6 px-4 py-2 text-white">Editar</button>
        </form>
      </Modal>
      <div className={`${isOpen || isEditOpen ? 'blur-sm': ''} flex flex-col items-center justify-center shadow-xl p-10 mt-10 w-5/6`}>
        <div className="flex w-full text-left justify-between">
          <h1 className="text-2xl font-bold">Carros:</h1>
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
                  {carros && carros.map((car) => 
                      <tr key={car.id_carro} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{car.id_carro}</td>
                        <td className="whitespace-nowrap px-6 py-4">{car.modelo}</td>
                        <td className="whitespace-nowrap px-6 py-4">{car.ano_fab}</td>
                        <td className="whitespace-nowrap px-6 py-4">R$: {car.preco.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-6 py-4">{car.nome_cor}</td>
                        <td className="whitespace-nowrap px-6 py-4">{car.nome_versao}</td>
                        <td className="whitespace-nowrap px-6 py-4">{car.quantidade}</td>

                        <td className="flex gap-2 items-center justify-center whitespace-nowrap px-6 py-4">
                          <FaPencilAlt onClick={async () => showEditModal(car.id_carro.toString())} className="hover:cursor-pointer" style={{ color: 'blue' }}/>
                          <FaTrashAlt className="hover:cursor-pointer" style={{ color: 'red' }}/>
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

