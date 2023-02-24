import React from 'react';
import Axios from 'axios';

const Logout = () => {

    const out = () => {
        Axios.get("http://localhost:3002/logout").then((response) => {
            window.location.reload();
        }).catch(err => {
            if (err) {
                console.log(err)
            }
        })
    }

    return (
        <div className="bg-gray-200 hover:bg-red-200 shadow-xl h-[45px] w-[275px] hover:h-[55px] hover:w-[285px] rounded-md ease-in-out duration-300 flex flex-row cursor-pointer mt-auto mb-7" onClick={out}>
            <div className="h-full flex w-full items-center justify-center space-x-2 text-gray-700">
                <h1 className="text-md ml-3">Logout</h1>
            </div>
        </div>
    )
}

export default Logout;