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

  const [itemInput, setItemInput] = useState("")
  const [items, setItems] = useState([])
  const [costInput, setCostInput] = useState("")
  const [portions, setPortions] = useState({})
  const [selectedNames, setSelectedNames] = useState([])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const addName = () => {
    const trimmedName = nameInput.trim();
    if (trimmedName && !names.includes(trimmedName)) {
      setNames([...names, trimmedName])
      setNameInput("")
    } else if (names.includes(trimmedName)) {
      toast.error("Name already exists", {
        toastId: "nameExistsWarning", // This ensures only one warning for the same name
      });
    }
  }

  const removeName = (name) => {
    setNames(names.filter((n) => n !== name))-
    setItems((prevItems) => 
      prevItems.map((item) => ({
        ...item,
        sharedBy: item.sharedBy.filter((n) => n !== name)
      }))
    )
  }

  const handleNameSelect = (name) => {
    setSelectedNames((prevSelectedNames) => 
      prevSelectedNames.includes(name)
        ? prevSelectedNames.filter((n) => n !== name)
        : [...prevSelectedNames, name]
    )
  }

  const handlePortionChange = (name, portion) => {
    setPortions({ ...portions, [name]: portion })
  }

  const addItem = () => {
    if (itemInput.trim() && costInput.trim() && selectedNames.length > 0) {
      setItems([
        ...items,
        { name: itemInput, cost: parseFloat(costInput), sharedBy: selectedNames.map((name) => ({name, portion: portions[name] || '1'})) },
      ]);
      setItemInput("");
      setCostInput("");
      setSelectedNames([]);
      setPortions({});
    } else if (!itemInput.trim()) {
      toast.error("Item name cannot be empty", {
        toastId: "itemNameEmptyWarning",
      });
    } else if (!costInput.trim()) {
      toast.error("Cost cannot be empty", {
        toastId: "costEmptyWarning",
      });
    } else if (selectedNames.length === 0) {
      toast.error("At least one name must be selected", {
        toastId: "noNamesSelectedWarning",
      });
    }
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitted")
  }

  if (theme === null) return null;

  return (
    <div className="bg-[#ffffff] dark:bg-[#0f0f0f] flex flex-col items-center justify-start min-h-screen py-10">
      <ToastContainer />
      <div className="flex justify-between items-center mb-10 w-[500px]">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="DiviPay" width={30} height={30} />
          <h1 className="text-2xl poppins-bold text-[#1f1f1f] dark:text-white">DiviPay</h1>
        </div>
        <div className="hover:bg-gray-600 transition-colors duration-300 ease-out p-0 rounded-lg">
          <ThemeToggle theme={theme} setTheme={setTheme}/>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-[400px]">

        {/* Name Input */}
        <div className="mb-10">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Names
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter name"
              className="flex-1 p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular"
            />
            <button
              type="button"
              onClick={addName}
              className="p-[11px] rounded bg-[#d9d9d9] dark:bg-[#374151] hover:bg-blue-400 dark:hover:bg-blue-400 transition-colors "
            >
              <Image src={theme === "dark" ? '/plus-light.svg' : '/plus-dark.svg'} alt="Add" width={16} height={16 } onClick={addName} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-[#d9d9d9] dark:bg-gray-700 rounded"
              >
                <span className="text-[#1f1f1f] dark:text-white poppins-medium">{name}</span>
                <button
                  type="button"
                  onClick={() => removeName(name)}
                  className="ml-2 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Purchased Items */}
        <div className="mb-4">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Purchased Items
          </label>
          <input 
            type="text"
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
            placeholder="Item Name"
            className="w-full p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular" 
          />
          <input 
            type="number"
            value={costInput}
            onChange={(e) => setCostInput(e.target.value)}
            placeholder="Cost"
            className="w-full p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular"
          />

          <div className="flex flex-wrap gap-2 mb-3 w-full bg-[#e5e5e5] dark:bg-[#2f2f2f] p-2 rounded min-h-[50px]">
            {names.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                  <button
                  type="button"
                  onClick={() => handleNameSelect(name)}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 ${selectedNames.includes(name) ? 'bg-blue-400 text-white' : 'bg-[#d9d9d9] dark:bg-[#374151] text-[#1f1f1f] dark:text-white hover:bg-blue-400 dark:hover:bg-blue-400'}`}
                >
                  {name}
                </button>
                {selectedNames.includes(name) && (
                  <input type="number" min="1" value={portions[name] || "1"} onChange={(e) => handlePortionChange(name, e.target.value)} className="w-16 p-1 rounded bg-gray-300" />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 p-2 w-full bg-green-500 text-white rounded"
          >
            Add Item
          </button>
        </div>

        {/* Displaying Added Items */}
        <div className="mt-10">
          {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[#d9d9d9] dark:bg-gray-700 rounded mb-2">
            <div>
              <p className="text-[#1f1f1f] dark:text-white">
                <b>{item.name}</b> - ${item.cost}
              </p>
              <p className="text-sm text-[#1f1f1f] dark:text-white">
                Shared by: {item.sharedBy.map(({ name, portion }) => `${name} (x${portion})`).join(", ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
          ))}
        </div>
      </form>

    </div>
  );
}
