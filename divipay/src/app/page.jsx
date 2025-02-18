'use client'

import ThemeToggle from "@/utils/ThemeToggle";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import currencyList from "@/utils/currency.js";

export default function Home() {

  const [nameInput, setNameInput] = useState("")
  const [names, setNames] = useState([])
  const [theme, setTheme] = useState(null);

  const [itemInput, setItemInput] = useState("")
  const [items, setItems] = useState([])
  const [costInput, setCostInput] = useState("")
  const [portions, setPortions] = useState({})
  const [selectedNames, setSelectedNames] = useState([])
  const [quantityInput, setQuantityInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [discountSymbol, setDiscountSymbol] = useState("%");
  const [discounts, setDiscounts] = useState([]);
  const [taxInput, setTaxInput] = useState("");
  const [taxSymbol, setTaxSymbol] = useState("%");
  const [taxes, setTaxes] = useState([]);
  const [taxName, setTaxName] = useState("");

  const [currencyInput, setCurrencyInput] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencyList);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({ name: "Indian Rupee", symbol: "₹" });
  const dropdownRef = useRef(null);


  const handleCalculation = () => {

    // Here's an updated handleSubmit function that calculates:

    // Total Cost (Before Discounts & Taxes)
    // Total Discount Amount
    // Total After Discount
    // Total Tax Amount
    // Final Total (After Discounts & Taxes)
    // Per Person Contribution

    if (items.length === 0) {
      toast.error("Please add at least one item to calculate", {
        toastId: "noItemsWarning",
      });
      return;
    }

    let totalCost = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    items.forEach(item => {
      totalCost += item.cost;
    })

    discounts.forEach(discount => {
      if (discount.symbol === "%") {
        discountAmount += (discount.value / 100) * totalCost;
      } else {
        discountAmount += discount.value;
      }
    }
    )

    const totalAfterDiscount = totalCost - discountAmount;

    taxes.forEach(tax => {
      if (tax.symbol === "%") {
        taxAmount += (tax.value / 100) * totalAfterDiscount;
      } else {
        taxAmount += tax.value;
      }
    }
    )

    const finalTotal = totalAfterDiscount + taxAmount;

    console.log("Total Cost: ", totalCost);
    console.log("Total Discount: ", discountAmount);
    console.log("Total After Discount: ", totalAfterDiscount);
    console.log("Total Tax: ", taxAmount);
    console.log("Final Total: ", finalTotal);

    if (selectedCurrency.rounding === true) {
      const newTotal = Math.round(finalTotal);
      const roundingDifference = newTotal - finalTotal;
      console.log("Rounding Difference: ", roundingDifference);
      console.log("New Total: ", newTotal);
    }

    // calculating per person cost. Cant directly divide by the number of people because of the portions as well as only some dishes being shared by some people while some dishes are shared by all, and some are not shared at all.
    // So, we need to calculate the total cost of the items shared by each person and then divide by the number of people.
    // We can do this by creating a new object with the name of the person as the key and the total cost of the items shared by that person as the value.
    // Then we can divide each value by the number of people to get the per person cost.


    const sharedCosts = {};

    console.log("Items: ", items);

    items.forEach(item => {
      let discountTotal = 0;
      discounts.forEach(discount => {
        if (discount.symbol === '%') {
          discountTotal += discount.value;
        } else {
          discountTotal += (discount.value / totalCost) * 100;
        }
      })

      let itemCost = item.cost - (item.cost * (discountTotal / 100));


      let totalPortion = 0;
      item.sharedBy.forEach(({ portion }) => {
        totalPortion += parseInt(portion, 10);
      });

      console.log("Total Portion: ", totalPortion);

      item.sharedBy.forEach(({ name, portion }) => {
        if (sharedCosts[name]) {
          sharedCosts[name] += itemCost * (portion / totalPortion);
        } else {
          sharedCosts[name] = itemCost * (portion / totalPortion);
        }
      });
    });

    let totalPeople = Object.keys(sharedCosts).length;

    let individualTax = taxAmount / totalPeople;

    Object.keys(sharedCosts).forEach(name => {
      sharedCosts[name] += individualTax;
    });

    console.log("Shared Costs: ", sharedCosts);

    if (selectedCurrency.rounding === true) {
      Object.keys(sharedCosts).forEach(name => {
        sharedCosts[name] = Math.round(sharedCosts[name]);
      });
    }

    console.log("Shared Costs After Rounding: ", sharedCosts);

    // const sharedCosts = {};

    // console.log("Items: ", items);

    // items.forEach(item => {
    //   let totalPortion = 0;
    //   item.sharedBy.forEach(({ portion }) => {
    //     totalPortion += portion;
    //   });

    //   item.sharedBy.forEach(({ name, portion }) => {
    //     if (sharedCosts[name]) {
    //       sharedCosts[name] += item.cost * (portion / totalPortion);
    //     } else {
    //       sharedCosts[name] = item.cost * (portion / totalPortion);
    //     }
    //   });
    // }
    // )

    // console.log("Shared Costs: ", sharedCosts);

    // const numberOfPeople = names.length;
    // const perPersonCost = {};

    // names.forEach(name => {
    //   perPersonCost[name] = sharedCosts[name] / numberOfPeople;
    // }
    // )

    // console.log("Per Person Cost: ", perPersonCost);

  }


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
    if (portion === "" || /^[0-9]*$/.test(portion)) {
      setPortions({ ...portions, [name]: portion });
    }
  };

  const addItem = () => {
    if (itemInput.trim() && costInput.trim() && selectedNames.length > 0) {

      const quantity = parseInt(quantityInput, 10) || 1;
      const costPerUnit = parseFloat(costInput);
      const totalCost = quantity * costPerUnit;

      setItems([
        ...items,
        { name: itemInput, cost: totalCost, quantity, costPerUnit, sharedBy: selectedNames.map((name) => ({name, portion: portions[name] || '1'})) },
      ]);
      setItemInput("");
      setCostInput("");
      setQuantityInput("");
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
    } else if (!quantityInput.trim()) {
      toast.error("Quantity cannot be empty", {
        toastId: "quantityEmptyWarning",
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

  const addDiscount = () => {
    if (discountInput.trim()) {
      setDiscounts([...discounts, { value: parseFloat(discountInput), symbol: discountSymbol }]);
      setDiscountInput("");
    } else {
      toast.error("Discount value cannot be empty", {
        toastId: "discountEmptyWarning",
      });
    }
  }

  const removeDiscount = (index) => {
    setDiscounts(discounts.filter((_, i) => i !== index));
  }

  const addTax = () => {
    if (taxInput.trim() && taxName.trim()) {
      setTaxes([...taxes, { name: taxName, value: parseFloat(taxInput), symbol: taxSymbol }]);
      setTaxInput("");
      setTaxName("");
    } else if (!taxName.trim()) {
      toast.error("Tax name cannot be empty", {
        toastId: "taxNameEmptyWarning",
      });
    } else if (!taxInput.trim()) {
      toast.error("Tax value cannot be empty", {
        toastId: "taxEmptyWarning",
      });
    }
  }

  const removeTax = (index) => {
    setTaxes(taxes.filter((_, i) => i !== index));
  }

  const handleCurrencyInputChange = (e) => {
    const value = e.target.value;
    setCurrencyInput(value);

    if (value === "") {
      setFilteredCurrencies(currencyList);
    } else {
      setFilteredCurrencies(
        currencyList.filter(
          (currency) =>
            currency.name.toLowerCase().includes(value.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setCurrencyInput(`${currency.name} (${currency.symbol})`);
    setShowDropdown(false);
  };


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

      <h2 className="text-2xl poppins-bold text-[#1f1f1f] dark:text-white mb-10 underline">Split Expenses</h2>

      <form onSubmit={handleSubmit} className="w-[400px] flex flex-col">

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


        {/* Currency Input */}
        <div className="w-full">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Select Currency
          </label>

          <input 
            type="text" 
            value={currencyInput}
            onChange={handleCurrencyInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder="Type or select a currency"
            className="w-full p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular"
          />

          {showDropdown && (
            <ul className="absolute w-[400px] mt-1 max-h-40 overflow-auto bg-[#e5e5e5] dark:bg-[#2f2f2f] rounded shadow-lg">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((currency, index) => (
                  <li
                    key={index}
                    onClick={() => handleCurrencySelect(currency)}
                    className="p-2 cursor-pointer hover:bg-blue-400 dark:hover:bg-blue-400 text-[#1f1f1f] dark:text-white transition-colors"
                  >
                    {currency.name} ({currency.symbol})
                  </li>
                ))
              ) : (
                <li className="p-2 text-[#1f1f1f] dark:text-white">No currencies found</li>
              )}
            </ul>
          )}
        </div>


        {/* Purchased Items */}
        <div className="mb-8 mt-10">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Purchased Items
          </label>
          <div className="w-full flex gap-[6px]">
            <input 
              type="text"
              value={itemInput}
              onChange={(e) => setItemInput(e.target.value)}
              placeholder="Item Name"
              className="w-full p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular" 
            />
            <input 
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              placeholder="Quantity"
              min="1"
              className="w-2/6 p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular"
            />
          </div>
          <input 
            type="number"
            value={costInput}
            onChange={(e) => setCostInput(e.target.value)}
            placeholder="Cost"
            className="w-full p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular no-arrows"
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
                  <input type="number" placeholder="Portion" min="1" value={portions[name] ?? ""} onChange={(e) => handlePortionChange(name, e.target.value)} className="w-16 p-1 rounded bg-[#d9d9d9] dark:bg-[#374151] text-[#1f1f1f] dark:text-white placeholder:text-sm placeholder:ml-[2px]" />
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
        <div className="mt-0">
          {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[#d9d9d9] dark:bg-gray-700 rounded mb-2">
            <div>
              <p className="text-[#1f1f1f] dark:text-white">
              <b>{item.name}</b> -- {item.quantity} × {selectedCurrency.symbol}{item.costPerUnit} = <b>{selectedCurrency.symbol}{item.cost}</b>
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


        {/* Discounts */}
        <div className="w-full mt-10">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Discounts
          </label>
          <div className="w-full flex gap-[6px]">
            <input 
              type="number"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="Discount"
              className="w-full p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular no-arrows"
            />
            <select
              value={discountSymbol}
              onChange={(e) => setDiscountSymbol(e.target.value)}
              className="w-1/3 p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular appearance-none"
            >
              <option value="%">%</option>
              <option value={selectedCurrency.symbol}>{selectedCurrency.symbol}</option>
            </select>
          </div>
          <button
            type="button"
            onClick={addDiscount}
            className="mt-2 p-2 w-full bg-[#e5e5e5] dark:bg-[#2f2f2f] dark:hover:bg-[#1f1f1f] text-white rounded"
          >
            Add Discount
          </button>
        </div>

        {/* Displaying the added discounts */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {discounts.map((discount, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#d9d9d9] dark:bg-gray-700 rounded mb-2 gap-4">
              <p className="text-[#1f1f1f] dark:text-white">
                {discount.value}{discount.symbol} Discount
              </p>
              <button
                type="button"
                onClick={() => removeDiscount(index)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Taxes Input */}
        <div className="w-full mt-10">
          <label className="block text-[#1f1f1f] dark:text-white mb-1 poppins-regular">
            Add Taxes
          </label>

          <div className="w-full flex gap-[6px]">
            <input 
              type="text" 
              value={taxName}
              onChange={(e) => setTaxName(e.target.value)}
              placeholder="Tax Name"
              className="w-full p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular"
            />
            <input 
              type="number"
              value={taxInput}
              onChange={(e) => setTaxInput(e.target.value)}
              placeholder="Tax"
              className="w-2/6 p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular no-arrows"
            />
            <select
              value={taxSymbol}
              onChange={(e) => setTaxSymbol(e.target.value)}
              className="w-1/3 p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular appearance-none"
            >
              <option value="%">%</option>
              <option value={selectedCurrency.symbol}>{selectedCurrency.symbol}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={addTax}
            className="mt-2 p-2 w-full bg-[#e5e5e5] dark:bg-[#2f2f2f] dark:hover:bg-[#1f1f1f] text-white rounded"
          >
            Add Tax
          </button>
        </div>

        {/* Displaying the added taxes */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {taxes.map((tax, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#d9d9d9] dark:bg-gray-700 rounded mb-2 gap-4">
              <p className="text-[#1f1f1f] dark:text-white">
                {tax.name} - {tax.value}{tax.symbol} Tax
              </p>
              <button
                type="button"
                onClick={() => removeTax(index)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-10 p-2 bg-green-500 text-white rounded"
          onClick={handleCalculation}
        >
          Calculate
        </button>

      </form>

    </div>
  );
}
