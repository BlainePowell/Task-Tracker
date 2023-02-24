import React, { useState } from "react"
import { GrAddCircle } from 'react-icons/gr'

const NewTasksBox = () => {
    const [click, setClick] = useState(false)

    return (
        <div onClick={() => {
            setClick(true)
        }} className={click ? "shadow-lg h-[45px] w-[275px] hover:h-[55px] hover:w-[285px] rounded-md ease-in-out duration-300 cursor-pointer" :
            "bg-gray-700 shadow-lg h-[45px] w-[275px] hover:h-[55px] hover:w-[285px] rounded-md ease-in-out duration-300 cursor-pointer mt-[10px]"} >
            <div className="h-full flex items-center space-x-2">
                <h1 className="ml-[15px] text-gray-100">New List</h1>
            </div>
        </div>
    )

}

export default NewTasksBox;