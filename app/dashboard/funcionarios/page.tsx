'use client'
import { FuncInfo } from "@/app/api/getFuncionarios/route"
import Modal from "@/app/components/Modal"
import { useEffect, useState } from "react"
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa"

export default function Funcionarios() {
  const tableLabels = [
    'Id', 'Nome', 'Cargo', 'Salario','Ações'
  ]
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [funcionarios, setFuncionarios] = useState<FuncInfo[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const showModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

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

  if(loading) return (<h1>Carregando...</h1>)
  if(error) return (<h1>Error: {error}</h1>)

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} label="Criar Funcionário">
        <h1>penis</h1>
      </Modal>
      <div className={`${isOpen ? 'blur-sm': ''} flex flex-col items-center justify-center shadow-xl p-10 mt-10 w-5/6`}>
        <div className="flex w-full text-left justify-between">
          <h1 className="text-2xl font-bold">Funcionários:</h1>
          <button onClick={showModal} className="mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Criar
          </button>
          
        </div>
        <div className="w-full overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block justify-center items-center min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full items-center justify-center text-center text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    {tableLabels.map(label =><th scope="col" className="px-6 py-4">{label}</th> )}
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((func) => 
                      <tr className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{func.id_func}</td>
                        <td className="whitespace-nowrap px-6 py-4">{func.nome_pessoa}</td>
                        <td className="whitespace-nowrap px-6 py-4">{func.cargo_func}</td>
                        <td className="whitespace-nowrap px-6 py-4">{func.salario_func}</td>
                        <td className="flex gap-2 items-center justify-center whitespace-nowrap px-6 py-4">
                          <FaPencilAlt onClick={showModal} className="hover:cursor-pointer" style={{ color: 'blue' }}/>
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
