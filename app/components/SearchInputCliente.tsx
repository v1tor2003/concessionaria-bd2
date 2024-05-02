import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Cliente } from '../lib/types';
import { getCustomerById, getCustomerByName } from '../dashboard/clientes/customerActions';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface Props {
    register: UseFormRegister<any>
    setValue: UseFormSetValue<any>
    clienteId: string
}

export default function SearchInputCliente({register, setValue, clienteId}: Props) {
    const [clientes, setClientes] = useState<Cliente[] | undefined>();
    const [name, setName] = useState<string>('');
    const [cliId, setCliId] = useState<string>(clienteId)

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
                    setCliId(clientes[0].id_cliente.toString())
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
            setCliId(cli?.id_cliente.toString() ? cli?.id_cliente.toString() : '')
        }
    }

    useEffect(() => {
        async function fetchCustomer() {
            setValue('cliente', cliId)
            const customer = await getCustomerById(cliId)
            setName(customer?.nome_pessoa ? customer?.nome_pessoa : '')
        }
    
        fetchCustomer()
    }, [cliId, setValue, setName])

    return (
        <>
            <input
                type="text"
                value={cliId}
                {...register('cliente')}
                className="hidden"
                onChange={searchHandler}
                onKeyDown={handleKeyDown}
            />
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
                    
                    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem' }}>
                        <FaSearch />
                    </div>
                </div>
                {name !== '' && !clientes && !cliId && <p className='text-sm text-red-400'>Cliente não encontrado</p>}
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
        </>
    )
}
