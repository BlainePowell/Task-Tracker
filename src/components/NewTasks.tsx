import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { AiFillAccountBook } from "react-icons/ai";
import dynamic from 'next/dynamic';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });


const NewTasks = ({ userId }) => {
    const [title, setTitle] = useState("");
    const [newTask, setNewTask] = useState("")
    const [icons, setIcons] = useState(null);
    const [emojis, setEmoji] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState('🚀');

    const handleSubmit = () => {
        Axios.post("http://localhost:3002/list", {
            title: title,
            icon: chosenEmoji,
            userId: userId,
        }).then((response) => {
            if (response) {
                setNewTask("true")
                localStorage.setItem("newtask", newTask);
                window.location.reload();
            }
        }).catch(err => {
            if (err) {
                console.log(err)
            }
        })
    }

    useEffect(() => {
        console.log(chosenEmoji)
    }, [chosenEmoji])

    const onEmojiClick = (emojiObject) => {
        setChosenEmoji(emojiObject.emoji);
        setEmoji(false)
    }

    return (
        <div className="flex flex-col space-y-5 bg-gray-100 w-full h-screen justify-start items-center pt-16">
            <div className="w-1/2 h-[100px] flex flex-row
             bg-transparent bottom mb-5 text-black space-x-3">
                <div className="h-full flex justify-center items-center text-center w-1/6 cursor-pointer" onClick={() => {
                    setEmoji(true);
                }}>
                    <h1 className="text-7xl ml-0">{chosenEmoji}</h1>
                </div>
                <input className="border-none px-0 bg-transparent inputbox text-5xl text-black"
                    type="text"
                    placeholder="New Title"
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                />
            </div>
            <button className="h-[50px] w-1/2 bg-transparent text-gray-700 hover:bg-gray-700 hover:text-gray-100
             hover:border-transparent ease-in-out duration-300
             text-xl rounded border-2 border-gray-700" onClick={handleSubmit}>Create</button>
            {emojis ? (
                <Picker onEmojiClick={onEmojiClick} />
            ) : (
                <div></div>
            )
            }
        </div>
    )
}

export default NewTasks;