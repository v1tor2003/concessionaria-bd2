'use client'
import { useEffect, useState } from "react"

type Func = {
  id_func: number,
  usuario_func: string,
  senha_func: string,
  salario_func: number,
  cargo_func: string,
  id_detalhepessoa_fk: number
}

export default function Funcionarios() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [funcionarios, setFuncionarios] = useState<Func[]>([])
  
  useEffect(() => {
    fetch('/api/getFuncionarios')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao pegar funcionarios');
        }
        return response.json();
      })
      .then(({ results }) => {
        console.log(results)
        setFuncionarios(results);
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
      <div className="flex flex-col items-center justify-center shadow-xl p-10 mt-10 w-5/6">
        <div className="w-full text-left">
          <h1 className="text-2xl font-bold">Funcionários:</h1>
        </div>
        <div className="w-full overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block justify-center items-center min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full items-center justify-center text-center text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">First</th>
                    <th scope="col" className="px-6 py-4">Last</th>
                    <th scope="col" className="px-6 py-4">Handle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                    <td className="whitespace-nowrap px-6 py-4">Mark</td>
                    <td className="whitespace-nowrap px-6 py-4">Otto</td>
                    <td className="whitespace-nowrap px-6 py-4">@mdo</td>
                  </tr>
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">2</td>
                    <td className="whitespace-nowrap px-6 py-4">Jacob</td>
                    <td className="whitespace-nowrap px-6 py-4">Thornton</td>
                    <td className="whitespace-nowrap px-6 py-4">@fat</td>
                  </tr>
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">3</td>
                    <td className="whitespace-nowrap px-6 py-4">Larry</td>
                    <td className="whitespace-nowrap px-6 py-4">Wild</td>
                    <td className="whitespace-nowrap px-6 py-4">@twitter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
    
}
