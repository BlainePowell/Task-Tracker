import Axios from "axios";
import { useEffect, useState, createContext } from "react";
import Tasks from "../components/Tasks"
import NewTasks from "../components/NewTasks";
import NewTasksBox from "../components/NewTasksBox";
import { FaTrashAlt } from 'react-icons/fa'
import Logout from "../components/Logout";
import EmojiPicker from "emoji-picker-react";

interface sideItem {
  icon: any,
  title: string,
  page: string,
}

export default function Home() {
  const [list, setList] = useState([]);
  const [singleData, setSingleData] = useState([])
  const [newList, setNewList] = useState(true);
  const [user, setUser] = useState("")
  const [hover, setHover] = useState(false);
  const [name, setName] = useState("");

  Axios.defaults.withCredentials = true;

  const getUser = (userId) => {
    Axios.get("http://localhost:3002/list", {
      params: {
        userId: userId
      }
    }).then((response) => {
      setList(response.data.result)
    }).catch(err => {
      console.log(err)
    })
  }

  let random = 0;

  useEffect(() => {
    Axios.get("http://localhost:3002/login").then((response) => {
      if (response.data.loggedIn == true) {
        getUser(response.data.user[0].userId)
        setUser(response.data.user[0].userId)
        setName(response.data.user[0].name)
      } else {
        window.location.href = "/login"
      }
    }
    )
  }, [])

  const SideBarBox = ({ title, page, icon, onClick, isSelected }) => {

    const handleClick = (page) => {
      Axios.get("http://localhost:3002/test", {
        params: {
          id: page
        }
      }).then((response) => {
        setSingleData(response.data.result)
        console.log(singleData)
      }).catch(err => {
        console.log(err)
      })
    }

    const handleDelete = () => {
      Axios.delete("http://localhost:3002/deletelist", {
        params: {
          id: page,
        }
      }).then((response) => {
        if (response) {
          window.location.reload();
        }
      }).catch(err => {
        console.log(err)
      })
    }

    return (

      <div className={isSelected == page ? "h-[45px] w-[275px] hover:h-[55px] hover:w-[285px] shadow-lg bg-platinum rounded-md flex flex-row cursor-pointer" :
        "bg-gray-200 shadow-xl h-[45px] w-[275px] hover:h-[55px] hover:w-[285px] rounded-md ease-in-out duration-300 flex flex-row cursor-pointer mt-[15px]"} onClick={() => {
          setNewList(false)
          handleClick(page)
        }}
      >
        <div className="h-full flex w-full items-center space-x-2 text-gray-700">
          <h1 className="text-2xl ml-3">{icon}</h1>
          <h1 className="ml-[15px]">{title}</h1>
        </div>
        <div className="h-full w-[40px] flex justify-center items-center">
          <FaTrashAlt className="text-gray-300 hover:text-red-500 ease-in-out duration-300
           h-[20px] w-[20px]"
            onClick={handleDelete}
          />
        </div>
      </div>
    )
  }

  const SideBar = ({ list }) => {
    const [isSelected, setIsSelected] = useState(null)

    const handleClick = (id) => {
      setIsSelected(id)
    }

    return (
      <div className="bg-gray-100 w-[300px] h-screen flex flex-col justify-start items-center">
        <div className="bg-slate-100 w-full h-[70px] flex justify-center items-center">
          <h1 className="text-2xl font-bold">Welcome, {name} 👋</h1>
        </div>
        <div onClick={() => {
          setNewList(true)
        }}>
          <NewTasksBox />
        </div>
        {
          list?.map(({ title, icon, id }) => (
            <SideBarBox
              icon={icon}
              title={title}
              page={id}
              key={id}
              onClick={() => handleClick(id)}
              isSelected={isSelected}
            />
          ))
        }
        <Logout />
      </div>
    )
  }

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3002/list").then((response) => {
      if (!response.data) {
        console.log();
      } else {
        setList(response.data.result)
      }
    })
  }, [])

  // get request for when user changes data in Tasks.tsx
  const getData = () => {
    Axios.get("http://localhost:3002/list").then((response) => {
      if (!response.data) {
        console.log();
      } else {
        setList(response.data.result)
      }
    })

    console.log("huh")
  }

  const bignumber = 10000;

  return (
    <div className="w-screen h-screen flex flex-row">
      <div className="w-[300px] h-screen">
        <SideBar list={list} />
      </div>
      <div className="w-5/6 h-screen flex">
        {newList == false ? (
          singleData.map(({ title, icon, id }) => (
            <Tasks
              head={title}
              icons={icon}
              id={id}
              key={id}
            />
          ))
        ) : (
          <NewTasks userId={user} />
        )
        }
      </div>
    </div>
  )
}
