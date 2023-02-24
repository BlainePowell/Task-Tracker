import React, { useState, useEffect } from "react";
import Axios from 'axios'

const Login = () => {
    const [log, setLog] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    Axios.defaults.withCredentials = true;


    const tryLogin = () => {
        Axios.post("http://localhost:3002/login", {
            username: username,
            password: password
        }).then((response) => {
            if (!response.data.auth) {
                setLog(false)
                setNotFound(true)
            } else {
                localStorage.setItem("token", response.data.token)
                setLog(true)
                setNotFound(false)
            }
        })
    }

    useEffect(() => {
        if (log == true) {
            window.location.href = "/";
        }
    }, [log])


    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-200 space-y-5">
            {notFound ? (
                <h1 className="text-red-500">Password incorrect</h1>
            ) : (
                <h1></h1>
            )
            }
            <input className="w-[300px] h-[50px] inputboxx pl-3 rounded-xl bg-gray-50 shadow-xl"
                placeholder="Username"
                onChange={(e) => {
                    setUsername(e.target.value)
                }}
            />
            <input className="w-[300px] h-[50px] inputboxx pl-3 rounded-xl bg-gray-50 shadow-xl"
                placeholder="Password"
                type="password"
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
            />
            <button className="w-[300px] h-[50px] rounded-xl bg-slate-300 text-gray-700 shadow-xl" onClick={tryLogin}>Login</button>
            <div className="flex flex-row space-x-2 text-gray-700">
                <p>Dont have an account?</p>
                <p
                    className="underline cursor-pointer" onClick={() => {
                        window.location.href = "/SignUp"
                    }}>Sign Up.</p>
            </div>
        </div>
    )
}


export default Login;