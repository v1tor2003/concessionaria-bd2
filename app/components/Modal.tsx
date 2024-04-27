import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

interface IModal{
  label: string
  isOpen: boolean
  children: React.ReactNode
  closeModal: () => void
}

const Modal = ({label, isOpen, children, closeModal}: IModal) => {
  return (
    <>
      {isOpen ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">{label}</h3>
                  <FaXmark className='hover:cursor-pointer' onClick={() => closeModal()}/>
                </div>
                <div className="relative p-6 flex-auto">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
