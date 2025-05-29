import React from 'react'
import {AiOutlineClose} from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { openModalFunc } from '../redux/generalSlice'
import Button from './Button'

const Modal = ({title, content,onClick,btnName}) => {
    const dispatch = useDispatch()

    const closeModal = () => {
        dispatch(openModalFunc())
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-semibold'>{title}</h2>
                    <AiOutlineClose 
                        className='text-xl cursor-pointer hover:text-red-500' 
                        onClick={closeModal}
                    />
                </div>
                <div className='mt-4'>
                    {content()}
                </div>
                <Button name={btnName} onClick={onClick}/>
            </div>
        </div>
    )
}

export default Modal