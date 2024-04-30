import React, { ChangeEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Cliente } from '../lib/types';
import { getCustomerByName } from '../dashboard/clientes/customerActions';

export default function SearchInputCliente() {
    const [clientes, setClientes] = useState<Cliente[] | undefined>();
    const [value, setValue] = useState('');
    const [enableSelect, setEnableSelect] = useState(false);

    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(value);
        if(value === '') setClientes(undefined)
    }

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ' ') {
            
            const clientes =await getCustomerByName(value)
            
            if(clientes){
                setClientes(clientes) // Assuming onSearch returns array of Cliente
                setValue(clientes.length === 1 ? clientes[0].nome_pessoa : value)
                setEnableSelect(true); // Show select after search
            }
        }
    }

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const id_cliente = event.target.value
        if(clientes){
            const value = clientes?.find(f => f.id_cliente === Number.parseInt(id_cliente))?.nome_pessoa
            setValue(value ? value : '')
        }
    }

    return (
        <div className="relative w-full flex flex-col">
            <div className='relative flex-1'>
                <input
                    type="search"
                    name="search"
                    placeholder="Pesquisar cliente..."
                    value={value}
                    className="capitalize border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:border-[#3a0039]"
                    onChange={searchHandler}
                    onKeyDown={handleKeyDown}
                />
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem' }}>
                    <FaSearch />
                </div>
            </div>
            {value !== '' && !clientes && <p className='text-sm text-red-400'>Cliente não encontrado</p>}
            {value !== '' && clientes && clientes.length > 1 && (
                <select
                    defaultValue={value}
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
