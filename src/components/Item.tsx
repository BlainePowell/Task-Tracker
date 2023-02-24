import React, { useState, useEffect } from 'react';
import { BsCheckLg } from "react-icons/bs"
import Axios from 'axios';

const Item = ({ task, completed, id }) => {
    const [checked, setChecked] = useState(false);

    const boxChecked = (complete) => {
        Axios.put("http://localhost:3002/updateitem", {
            completed: complete,
            id: id,
        }).then(err => {
            if (err) {
                console.log(err)
            }
        })
    }

    useEffect(() => {
        if (completed == 1) {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }, [])

    return (
        <div className='flex w-1/2'>
            <div className="flex w-full h-[40px] flex-row bg-gray-200 shadow-xl rounded text-gray-700 justify-start items-center">
                <div className='w-[35px] h-full items-center justify-center flex'>
                    {checked ? (
                        <div className='rounded-full flex justify-center items-center w-[25px] h-[25px] bg-green-500 border-[1px] border-gray-700' onClick={() => {
                            setChecked(false)
                            boxChecked(0);
                        }}>
                            <BsCheckLg className='h-[10px] w-[10px] mt-[2px] text-white' />
                        </div>
                    ) : (
                        <div className='rounded-full w-[25px] h-[25px] bg-transparent border-[1px] border-gray-700' onClick={() => {
                            setChecked(true)
                            boxChecked(1);
                        }} />
                    )}
                </div>
                {checked ? (
                    <h1 className='ml-1 line-through text-gray-500'>{task}</h1>
                ) : (
                    <h1 className='ml-1'>{task}</h1>
                )}
            </div>
        </div>
    )
}

export default Item;