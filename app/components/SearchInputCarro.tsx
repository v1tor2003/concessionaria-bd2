import React, { ChangeEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Cliente } from '../lib/types';
import { getCustomerByName } from '../dashboard/clientes/customerActions';
import { UseFormRegister } from 'react-hook-form';

interface Props {
    register: UseFormRegister<any>
}

export default function SearchInputCliente({register}: Props) {
    const [clientes, setClientes] = useState<Cliente[] | undefined>();
    const [name, setName] = useState<string>('');
    const [cliId, setCliId] = useState<number>()

    const [enableSelect, setEnableSelect] = useState(false);

    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
        if(value === '') setClientes(undefined)
    }

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ' ') {
            
            const clientes =await getCustomerByName(name)
            
            if(clientes){
                setClientes(clientes) // Assuming onSearch returns array of Cliente
                if(clientes.length === 1){
                    setName(clientes[0].nome_pessoa)
                    setCliId(clientes[0].id_cliente)
                }
                setEnableSelect(true); // Show select after search
            }
        }
    }

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const id_cliente = event.target.value
        if(clientes){
            const cli = clientes?.find(f => f.id_cliente === Number.parseInt(id_cliente))
            setName(cli?.nome_pessoa ? cli?.nome_pessoa : '')
            setCliId(cli?.id_cliente ? cli?.id_cliente : 0)
        }
    }

    return (
        <div className="relative w-full flex flex-col">
            <div className='relative flex-1'>
                <input
                    type="search"
                    placeholder="Pesquisar cliente..."
                    value={name}
                    className="capitalize border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:border-[#3a0039]"
                    onChange={searchHandler}
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="number"
                    value={cliId}
                    {...register('cliente')}
                    className="disabled hidden"
                    onChange={searchHandler}
                    onKeyDown={handleKeyDown}
                />
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem' }}>
                    <FaSearch />
                </div>
            </div>
            {name !== '' && !clientes && <p className='text-sm text-red-400'>Cliente não encontrado</p>}
            {name !== '' && clientes && clientes.length > 1 && (
                <select
                    defaultValue={name}
                    onChange={handleSelectChange}
                    disabled={!enableSelect}
                    className="capitalize border disabled:bg-gray-200 border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:border-[#3a0039]"
                >
                    {clientes.map((cliente) => (
                        <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nome_pessoa}</option>
                    ))}
                </select>
            )}
                    
        </div>
    )
}
