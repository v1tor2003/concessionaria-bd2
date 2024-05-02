import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Carro } from '../lib/types';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { getCarById, getCarByInfo } from '../dashboard/carros/carActions';

interface Props {
    register: UseFormRegister<any>
    setValue: UseFormSetValue<any>
    carId: string
}

export default function SearchInputCarro({register, setValue, carId}: Props) {
    const [carros, setCarros] = useState<Carro[] | undefined>();
    const [name, setName] = useState<string>('');
    const [carroId, setCarroId] = useState<string>(carId)

    const [enableSelect, setEnableSelect] = useState(false);

    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
        if(value === '') setCarros(undefined)
    }

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ' ') {
            
            const carros = await getCarByInfo(name)
            
            if(carros){
                setCarros(carros) // Assuming onSearch returns array of Cliente
                if(carros.length === 1){
                    setName(`${carros[0].ano_fab} ${carros[0].modelo} ${carros[0].nome_cor}`)
                    setCarroId(carros[0].id_cliente.toString())
                }
                setEnableSelect(true); // Show select after search
            }
        }
    }

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const id_carro = event.target.value
        if(carros){
            const carro = carros?.find(c => c.id_carro == Number.parseInt(id_carro))
            setName(`${carro?.ano_fab} ${carro?.modelo} ${carro?.nome_cor} ${carro?.nome_versao}`)
            setCarroId(carro?.id_carro.toString() ? carro?.id_carro.toString() : '')
        }
    }

    useEffect(() => {
        async function fetchCar() {
            setValue('carro', carroId)
            const carro = await getCarById(carroId)
            if(carro){
                const name = `${carro.ano_fab} ${carro.modelo} ${carro.nome_cor} ${carro.nome_versao}`
                setName(name ? name : '')
            }
        }
    
        fetchCar()
    }, [carroId, setValue, setName])
    
    return (
        <>
            <input
                type="text"
                value={carroId}
                {...register('carro')}
                className="disabled hidden"
                onChange={searchHandler}
                onKeyDown={handleKeyDown}
            />
            <div className="relative w-full flex flex-col">
                <div className='relative flex-1'>
                    <input
                        type="search"
                        placeholder="2002 Gol ..."
                        value={name}
                        className="capitalize border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:border-[#3a0039]"
                        onChange={searchHandler}
                        onKeyDown={handleKeyDown}
                    />
                    
                    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem' }}>
                        <FaSearch />
                    </div>
                </div>
                {name !== '' && !carros && !carroId && <p className='text-sm text-red-400'>Carro não encontrado</p>}
                {name !== '' && carros && carros.length > 1 && (
                    <select
                        defaultValue={`${name}`}
                        onChange={handleSelectChange}
                        disabled={!enableSelect}
                        className="capitalize border disabled:bg-gray-200 border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:border-[#3a0039]"
                    >
                        {carros.map((carro) => (
                            <option key={carro.id_carro} value={carro.id_carro}>{carro.ano_fab} {carro.modelo} {carro.nome_cor} {carro.nome_versao}</option>
                        ))}
                    </select>
                )}
                        
            </div>
        </>
    )
}
