'use client'

import ThemeToggle from "@/utils/ThemeToggle";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {

  const [nameInput, setNameInput] = useState("")
  const [names, setNames] = useState([])
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const addName = () => {
    if (nameInput.trim() && !names.includes(nameInput)) {
      setNames([...names, nameInput])
      setNameInput("")
    } else if (names.includes(nameInput)) {
      toast.error("Name already exists")
    }
  }

  const removeName = (name) => {
    setNames(names.filter((n) => n !== name))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitted")
  }

  if (theme === null) return null;

  return (
    <div className="bg-[#ffffff] dark:bg-[#0f0f0f] flex flex-col items-center justify-center min-h-screen py-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="DiviPay" width={30} height={30} />
          <h1 className="text-2xl poppins-bold text-[#1f1f1f] dark:text-white">DiviPay</h1>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-[400px]">

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Names
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter name"
              className="flex-1 p-2 rounded g-[#d9d9d9] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
            />
            <button>
              <Image src={theme === dark ? '/plus-light.svg' : '/plus-dark.svg'} alt="Add" width={20} height={20} onClick={addName} />
            </button>
          </div>
        </div>

        
      </form>

    </div>
  );
}
