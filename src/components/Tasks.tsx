import React, { useState, useEffect, useRef } from "react";
import { AiFillAccountBook } from "react-icons/ai";
import Axios from 'axios';
import Item from "./Item";
import { BsFillArrowRightSquareFill } from "react-icons/bs"
import EmojiPicker from 'emoji-picker-react';


const Tasks = ({ head, icons, id }) => {
    const [title, setTitle] = useState("");
    const [task, setTask] = useState("")
    const [user, setUser] = useState("");
    const [itemList, setItemList] = useState([]);
    const [emoji, setEmoji] = useState("");
    const dataFetchedRef = useRef(false);

    Axios.defaults.withCredentials = true;

    useEffect(() => {
        console.log(icons)
    }, [])

    const changeData = () => {
        if (head != title) {
            Axios.put("http://localhost:3002/changehead", {
                title: title,
                id: id,
            }).then(((err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("success")
                    localStorage.setItem("head", title)
                }
            }))
        }
    }

    const getItems = () => {
        Axios.get("http://localhost:3002/getitem", {
            params: {
                owner_id: id,
            }
        }).then((response) => {
            setItemList(response.data.result);
            console.log(response.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        getItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const notCompleted = 0;

    const NewItem = () => {
        Axios.post("http://localhost:3002/newitem", {
            task: task,
            completed: notCompleted,
            owner_id: id
        }).then(() => {
            getItems();
        })
    }

    return (
        <div className="flex flex-col space-y-5 bg-gray-100 w-full h-screen justify-start items-center pt-16">
            <div className="w-1/2 h-[100px] flex flex-row
             bg-transparent bottom mb-5 text-black space-x-3">
                <div className="h-full flex justify-center items-center text-center w-1/6 cursor-pointer">
                    <h1 className="text-7xl ml-0">{icons}</h1>
                </div>
                <input className="border-none px-0 bg-transparent inputbox text-5xl text-black"
                    type="text"
                    placeholder={head}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                />
            </div>
            <div className="flex w-1/2 h-[40px] bg-gray-200 shadow-xl rounded justify-center items-center">
                <input className="border-none w-full bg-transparent ml-3 inputbox text-gray-700"
                    placeholder="New Task"
                    onChange={(e) => {
                        setTask(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            NewItem();
                        }
                    }}
                />
                <div className="h-full w-[40px] flex mr-2 items-center justify-center">
                    <BsFillArrowRightSquareFill className="h-[30px] w-[30px] text-gray-500 hover:text-green-500 ease-in-out duration-100 cursor-pointer" onClick={NewItem} />
                </div>
            </div>
            {itemList !== undefined ? (
                itemList.map(({ task, completed, owner_id, id_items }) => (
                    <Item
                        task={task}
                        completed={completed}
                        key={owner_id}
                        id={id_items}
                    />
                ))
            ) : (
                <div></div>
            )
            }
        </div>
    )
}

export default Tasks;