'use client'

import ThemeToggle from "@/utils/ThemeToggle";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {

  const [nameInput, setNameInput] = useState("")
  const [names, setNames] = useState([])
  const [itemInput, setItemInput] = useState({ name: '', cost: '', distributed: '', portion: '' })
  const [items, setItems] = useState([])
  const [discounts, setDiscounts] = useState([{ type: 'percentage', value: '' }])
  const [taxes, setTaxes] = useState([{ type: 'percentage', value: '' }])
  const [currency, setCurrency] = useState('INR')
  const [theme, setTheme] = useState(null);

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
        toastId: "nameExistsWarning",
      });
    }
  }

  const removeName = (name) => {
    setNames(names.filter((n) => n !== name))
  }

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemInput(prev => ({ ...prev, [name]: value }))
  }

  const addItem = () => {
    if (itemInput.name && itemInput.cost) {
      setItems([...items, itemInput]);
      setItemInput({ name: '', cost: '', distributed: '', portion: '' });
    } else {
      toast.error("Item name and cost are required");
    }
  }

  const removeItem = (item) => {
    setItems(items.filter(i => i !== item));
  }

  const handleDiscountChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index][name] = value;
    setDiscounts(updatedDiscounts);
  }

  const addDiscount = () => {
    setDiscounts([...discounts, { type: 'percentage', value: '' }]);
  }

  const removeDiscount = (index) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  }

  const handleTaxChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTaxes = [...taxes];
    updatedTaxes[index][name] = value;
    setTaxes(updatedTaxes);
  }

  const addTax = () => {
    setTaxes([...taxes, { type: 'percentage', value: '' }]);
  }

  const removeTax = (index) => {
    setTaxes(taxes.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form Submitted", { names, items, discounts, taxes, currency });
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
              className="flex-1 p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
            />
            <button
              type="button"
              onClick={addName}
              className="p-[11px] rounded bg-[#d9d9d9] dark:bg-[#374151] hover:bg-blue-400 transition-colors"
            >
              <Image src={theme === "dark" ? '/plus-light.svg' : '/plus-dark.svg'} alt="Add" width={16} height={16} />
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

        {/* Item Inputs */}
        <div className="mb-4">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Items
          </label>
          <div className="flex flex-col gap-3">
            <input 
              type="text"
              name="name"
              value={itemInput.name}
              onChange={handleItemChange}
              placeholder="Item name"
              className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
            />
            <input 
              type="number"
              name="cost"
              value={itemInput.cost}
              onChange={handleItemChange}
              placeholder="Item cost"
              className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
            />
            <input 
              type="text"
              name="distributed"
              value={itemInput.distributed}
              onChange={handleItemChange}
              placeholder="Distributed among"
              className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
            />
            <input 
              type="number"
              name="portion"
              value={itemInput.portion}
              onChange={handleItemChange}
              placeholder="Portion size"
              className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
            />
            <button
              type="button"
              onClick={addItem}
              className="w-full mt-2 p-2 rounded bg-[#d9d9d9] dark:bg-[#374151] hover:bg-blue-400 transition-colors"
            >
              Add Item
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-[#d9d9d9] dark:bg-gray-700 rounded"
              >
                <span className="text-[#1f1f1f] dark:text-white poppins-medium">{item.name}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="ml-2 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Inputs */}
        <div className="mb-4">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Discounts
          </label>
          {discounts.map((discount, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input 
                type="text"
                name="value"
                value={discount.value}
                onChange={(e) => handleDiscountChange(index, e)}
                placeholder="Discount amount/percentage"
                className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
              />
              <select 
                name="type"
                value={discount.type}
                onChange={(e) => handleDiscountChange(index, e)}
                className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
              >
                <option value="percentage">%</option>
                <option value="amount">Amount</option>
              </select>
              <button
                type="button"
                onClick={() => removeDiscount(index)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDiscount}
            className="w-full p-2 rounded bg-[#d9d9d9] dark:bg-[#374151] hover:bg-blue-400 transition-colors"
          >
            Add Discount
          </button>
        </div>

        {/* Tax Inputs */}
        <div className="mb-4">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Taxes
          </label>
          {taxes.map((tax, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input 
                type="text"
                name="value"
                value={tax.value}
                onChange={(e) => handleTaxChange(index, e)}
                placeholder="Tax amount/percentage"
                className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
              />
              <select 
                name="type"
                value={tax.type}
                onChange={(e) => handleTaxChange(index, e)}
                className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
              >
                <option value="percentage">%</option>
                <option value="amount">Amount</option>
              </select>
              <button
                type="button"
                onClick={() => removeTax(index)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTax}
            className="w-full p-2 rounded bg-[#d9d9d9] dark:bg-[#374151] hover:bg-blue-400 transition-colors"
          >
            Add Tax
          </button>
        </div>

        {/* Currency Selection */}
        <div className="mb-4">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white"
          >
            <option value="INR">₹ Rupees (INR)</option>
            <option value="USD">USD ($)</option>
            {/* Add more currencies here */}
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 rounded bg-[#4CAF50] dark:bg-[#2f6b3d] hover:bg-[#45a049] transition-colors"
        >
          Submit
        </button>

      </form>
    </div>
  );
}
