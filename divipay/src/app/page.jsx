'use client'

import ThemeToggle from "@/utils/ThemeToggle";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import currencyList from "@/utils/currency.js";
import { format, set } from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

  const [finalTotal, setFinalTotal] = useState(0);
  const [roundingDifference, setRoundingDifference] = useState(0);
  const [roundoffTotal, setRoundoffTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAfterDisc, setTotalAfterDisc] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  const [showBill, setShowBill] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPerPerson, setShowPerPerson] = useState(false);
  const [sharedCost, setSharedCost] = useState({});

  // Temporary states for making the divs for downloading the bill and per person summary
  const [showBillDiv, setShowBillDiv] = useState(false);
  const [showPerPersonDiv, setShowPerPersonDiv] = useState(false);


  const tempFunction = () => {
    console.log(document.getElementById("bill-container"))
  }

  // Functions to handle the downloads
  
  const downloadBillAsPNG = async () => {
    setShowBillDiv(true)
    
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const billElement = document.getElementById("bill-container")

    if (!billElement) {
      toast.error("No bill to download", {
        toastId: "noBillWarning",
      });
      return;
    }

    const canvas = await html2canvas(billElement, { scale: 2 })
    const link = document.createElement("a")
    link.href = canvas.toDataURL('image/png')
    link.download = "DiviPay_Bill.png"
    link.click()

    setShowBillDiv(false)
  }

  const downloadBillAsPDF = async () => {
    setShowBillDiv(true);
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    const billElement = document.getElementById("bill-container");
  
    if (!billElement) {
      toast.error("No bill to download", { toastId: "noBillWarning" });
      return;
    }
  
    const canvas = await html2canvas(billElement, { scale: 2 });
  
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height proportionally
  
    let yPosition = 0;
  
    // If the image height fits in one page, just add it normally
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // Handle multi-page PDF
      let remainingHeight = imgHeight;
      let pageOffset = 0;
  
      while (remainingHeight > 0) {
        const sliceHeight = Math.min(remainingHeight, pageHeight);
  
        const canvasSlice = document.createElement("canvas");
        canvasSlice.width = canvas.width;
        canvasSlice.height = (sliceHeight * canvas.width) / imgWidth;
  
        const ctx = canvasSlice.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          pageOffset * (canvas.height / imgHeight),
          canvas.width,
          canvasSlice.height,
          0,
          0,
          canvasSlice.width,
          canvasSlice.height
        );
  
        const slicedImgData = canvasSlice.toDataURL("image/png");
  
        pdf.addImage(slicedImgData, "PNG", 0, 0, imgWidth, sliceHeight);
  
        remainingHeight -= sliceHeight;
        pageOffset += sliceHeight;
  
        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }
  
    pdf.save("DiviPay_Bill.pdf");
    setShowBillDiv(false);
  };
  
  

  const downloadPerPersonAsPNG = async () => {
    setShowPerPersonDiv(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const perPersonElement = document.getElementById("perPerson-container")

    if (!perPersonElement) {
      toast.error("No per person summary to download", {
        toastId: "noPerPersonWarning",
      });
      return;
    }

    const canvas = await html2canvas(perPersonElement, { scale: 2 })
    const link = document.createElement("a")
    link.href = canvas.toDataURL('image/png')
    link.download = "DiviPay_Per_Person.png"
    link.click()

    setShowPerPersonDiv(false)
  }

  const downloadPerPersonAsPDF = async () => {

    setShowPerPersonDiv(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const perPersonElement = document.getElementById("perPerson-container")

    if (!perPersonElement) {
      toast.error("No per person summary to download", {
        toastId: "noPerPersonWarning",
      });
      return;
    }

    const canvas = await html2canvas(perPersonElement, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let yPosition = 10
    let remainingHeight = imgHeight

    while (remainingHeight > 0) {
      pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight)
      remainingHeight -= 297

      if (remainingHeight > 0) {
        pdf.addPage()
        yPosition = 0
      }
    }

    pdf.save("DiviPay_Per_Person.pdf")

    setShowPerPersonDiv(false)
  }


  const handleCalculation = () => {

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
    })

    setTotalDiscount(discountAmount);

    const totalAfterDiscount = totalCost - discountAmount;
    setTotalAfterDisc(totalAfterDiscount);

    taxes.forEach(tax => {
      if (tax.symbol === "%") {
        taxAmount += (tax.value / 100) * totalAfterDiscount;
      } else {
        taxAmount += tax.value;
      }
    })

    setTotalTax(taxAmount);

    const finalTotall = totalAfterDiscount + taxAmount;
    setFinalTotal(finalTotall);

    console.log("Total Cost: ", totalCost);
    console.log("Total Discount: ", discountAmount);
    console.log("Total After Discount: ", totalAfterDiscount);
    console.log("Total Tax: ", taxAmount);
    console.log("Final Total: ", finalTotall);

    if (selectedCurrency.rounding === true) {
      const newTotal = Math.round(finalTotall);
      setRoundoffTotal(newTotal);
      const roundingDifference = newTotal - finalTotall;
      setRoundingDifference(roundingDifference);
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
    setSharedCost(sharedCosts);

    setShowBill(true);
  }


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);



  const calculateTax = (tax) => {
    if (tax.symbol === "%") {
      return (tax.value / 100) * totalAfterDisc;
    } else {
      return tax.value;
    }
  }

  
  const handlePerPerson = () => {
    setShowPerPerson(true);
    setShowBill(false);
  }

  const handleBillShowCase = () => {
    setShowBill(true);
    setShowPerPerson(false);
  }


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

  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      alert(`Error: ${message}\nSource: ${source}\nLine: ${lineno}:${colno}`);
    };
  }, []);  


  if (theme === null) return null;

  return (
    <div className="bg-[#ffffff] dark:bg-[#0f0f0f] flex flex-col items-center justify-start min-h-screen py-10">
      <ToastContainer />
      <div className="flex justify-between items-center mb-10 w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px]">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="DiviPay" width={30} height={30} />
          <h1 className="text-2xl poppins-bold text-[#1f1f1f] dark:text-white">DiviPay</h1>
        </div>
        <div className="hover:bg-gray-600 transition-colors duration-300 ease-out p-0 rounded-lg">
          <ThemeToggle theme={theme} setTheme={setTheme}/>
        </div>
      </div>

      {showPerPerson && (
        <div className="w-screen h-screen fixed inset-0 bg-gray-400 dark:bg-gray-950 backdrop-blur-[2px] bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50 px-4 sm:px-6 py-10">
          <div className="bg-white dark:bg-[#373c45] rounded-md min-w-[90%] md:min-w-[500px] max-w-[95%] md:max-w-[700px] max-h-[80vh] overflow-auto p-4 sm:p-6 flex flex-col items-center">
            <span className="text-lg sm:text-2xl poppins-bold text-[#1f1f1f] dark:text-white text-center">
              DiviPay - Per Person Summary
            </span>

            {/* Item-wise Cost Breakdown */}
            <div className="w-full mt-6">
              <span className="poppins-semibold text-base sm:text-lg text-[#1f1f1f] dark:text-white">
                Item-wise Breakdown
              </span>
              <div className="overflow-x-auto">
                <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-700 text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-[#1f1f1f] dark:text-white">Item</th>
                      {names.map((name) => (
                        <th key={name} className="text-[#1f1f1f] dark:text-white border border-gray-300 px-2 sm:px-4 py-2">{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border border-gray-300">
                        <td className="border border-gray-300 px-2 sm:px-4 py-2 text-[#1f1f1f] dark:text-white">{item.name}</td>
                        {names.map((name) => {
                          const share = item.sharedBy.find((p) => p.name === name);
                          return (
                            <td key={name} className="text-[#1f1f1f] dark:text-white border border-gray-300 px-2 sm:px-4 py-2">
                              {share ? `${selectedCurrency.symbol}${(share.portion / item.sharedBy.reduce((acc, p) => acc + parseFloat(p.portion), 0) * item.cost).toFixed(2)}` : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final Cost Per Person */}
            <div className="w-full mt-6">
              <span className="poppins-semibold text-base sm:text-lg text-[#1f1f1f] dark:text-white">
                Final Amount Per Person
              </span>
              <div className="overflow-x-auto">
                <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-700 text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-[#1f1f1f] dark:text-white">Person</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-[#1f1f1f] dark:text-white">Amount Owed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sharedCost).map(([name, amount]) => (
                      <tr key={name} className="border border-gray-300">
                        <td className="border border-gray-300 px-2 sm:px-4 py-2 text-[#1f1f1f] dark:text-white">{name}</td>
                        <td className="border border-gray-300 px-2 sm:px-4 py-2 text-[#1f1f1f] dark:text-white">{selectedCurrency.symbol}{amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rounding Off (If Needed) */}
            {selectedCurrency.rounding && (
              <div className="w-full mt-4">
                <span className="poppins-semibold text-base sm:text-lg text-[#1f1f1f] dark:text-white">
                  Rounding Adjustment
                </span>
                <p className="text-sm text-[#1f1f1f] dark:text-white">
                  Total rounding difference: {selectedCurrency.symbol}{roundingDifference.toFixed(2)}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center gap-4 sm:gap-6 w-full mt-6">
              {/* Show Bill Button */}
              <button
                onClick={handleBillShowCase}
                className="bg-blue-500 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Show Bill
              </button>
              {/* Close Button */}
              <button 
                onClick={() => setShowPerPerson(false)} 
                className="px-3 sm:px-4 py-2 bg-red-500 text-white text-sm sm:text-base rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>

            {/* Download Buttons */}
            <div className="flex justify-center gap-4 sm:gap-6 w-full mt-6">
              {/* Download as PNG */}
              <button
                onClick={downloadPerPersonAsPNG}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition text-xs sm:text-base"
              >
                Download as PNG
              </button>

              {/* Download as PDF */}
              <button
                onClick={downloadPerPersonAsPDF}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition text-xs sm:text-base"
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}



      {showBill && (
        <div className="w-screen h-screen fixed inset-0 bg-gray-400 dark:bg-gray-950 backdrop-blur-[2px] bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50 py-10">
          <div className="bg-white dark:bg-[#373c45] rounded-md sm:min-w-[400px] max-w-[90vw] p-6 flex flex-col items-center max-h-[90vh] overflow-auto">
            <span className="text-xl sm:text-3xl poppins-bold text-[#1f1f1f] dark:text-white">DiviPay Bill Summary</span>

            {/* Date */}
            <div className="w-full mt-4 flex justify-center">
              <span className="poppins-regular text-sm text-[#1f1f1f] dark:text-white">
                📅 Date: <span>{format(currentDate, "dd/MM/yyyy")}</span>
              </span>
            </div>

            {/* Divider */}
            <div className="w-full mt-6 flex items-center gap-2">
              <div className="w-full border-t border-[#1f1f1f] dark:border-white border-dashed" />
              <span className="poppins-regular text-nowrap text-[#1f1f1f] dark:text-white">Tax Invoice</span>
              <div className="w-full border-t border-[#1f1f1f] dark:border-white border-dashed" />
            </div>

            {/* Currency */}
            <div className="w-full mt-4 text-center">
              <span className="poppins-medium text-lg text-[#1f1f1f] dark:text-white">
                {selectedCurrency.symbol} {selectedCurrency.name}
              </span>
            </div>

            {/* Bill Items */}
            <div className="w-full mt-4 border-b">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span className="poppins-regular text-[#1f1f1f] dark:text-white truncate">{item.name} (x{item.quantity})</span>
                  <span className="poppins-regular text-[#1f1f1f] dark:text-white text-nowrap">
                    {selectedCurrency.symbol} {item.cost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discounts */}
            {discounts.length > 0 && (
              <div className="w-full mt-4">
                {discounts.map((discount, index) => (
                  <div key={index} className="flex justify-between text-green-500">
                    <span className="poppins-regular">Discount {discount.symbol === "%" ? `(${discount.value}%)` : ""}</span>
                    <span className="poppins-regular">
                      -{selectedCurrency.symbol} {totalDiscount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Taxes */}
            {taxes.length > 0 && (
              <div className="w-full mt-2">
                {taxes.map((tax, index) => (
                  <div key={index} className="flex justify-between text-red-500">
                    <span className="poppins-regular truncate">{tax.name} {tax.symbol === "%" ? `(${tax.value}%)` : ""}</span>
                    <span className="poppins-regular text-nowrap">
                      +{selectedCurrency.symbol} {calculateTax(tax).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Final Amount */}
            <div className={`w-full ${selectedCurrency.rounding ? 'mt-2' : 'mt-4'} flex justify-between text-xl font-bold`}>
              <span className="poppins-bold text-base text-[#1f1f1f] dark:text-white">Total:</span>
              <span className="poppins-bold text-base text-[#1f1f1f] dark:text-white">
                {selectedCurrency.symbol} {finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Rounding */}
            {selectedCurrency.rounding && (
              <div className="w-full flex justify-between text-lg">
                <span className="poppins-regular text-sm text-[#1f1f1f] dark:text-white">Rounding:</span>
                <span className="poppins-regular text-sm text-[#1f1f1f] dark:text-white">
                  {selectedCurrency.symbol} {roundingDifference.toFixed(2)}
                </span>
              </div>
            )}

            {selectedCurrency.rounding && (
              <div className="w-full mt-2 border-t border-[#1f1f1f] dark:border-white border-dashed"/>
            )}

            {/* Roundoff Total */}
            {selectedCurrency.rounding && (
              <div className="w-full mt-2 flex justify-between text-lg sm:text-xl font-bold">
                <span className="poppins-bold text-[#1f1f1f] dark:text-white">Roundoff Total:</span>
                <span className="poppins-bold text-[#1f1f1f] dark:text-white">
                  {selectedCurrency.symbol} {roundoffTotal.toFixed(0)}
                </span>
              </div>
            )}


            <div className="flex justify-center gap-6 w-full mt-6">
              {/* Close Button */}
              <button
                onClick={() => setShowBill(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition text-xs sm:text-base"
              >
                Close
              </button>

              {/* Get Per Person Summary */}
              <button onClick={handlePerPerson} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition text-xs sm:text-base">
                Get Per Person Summary
              </button>
            </div>

            <div className="flex justify-center gap-6 w-full mt-6">
              {/* Download as PNG */}
              <button
                onClick={downloadBillAsPNG}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition text-xs sm:text-base"
              >
                Download as PNG
              </button>
              
              {/* Download as PDF */}
              <button
                onClick={downloadBillAsPDF}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition text-xs sm:text-base"
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}


      <h2 className="text-xl md:text-2xl poppins-bold text-[#1f1f1f] dark:text-white mb-10 underline">Split Expenses</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-[90vw] sm:max-w-[400px] flex flex-col">

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
                <span className="text-[#1f1f1f] dark:text-white poppins-medium truncate">{name}</span>
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
            className="w-full p-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular truncate"
          />

          {showDropdown && (
            <ul className="absolute w-full max-w-[90vw] sm:max-w-[400px] border border-[#1f1f1f] dark:border-white mt-1 max-h-40 overflow-auto bg-[#e5e5e5] dark:bg-[#2f2f2f] rounded shadow-lg">
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
              className="w-[45%] sm:w-2/6 p-2 mb-2 rounded bg-[#e5e5e5] dark:bg-[#2f2f2f] text-[#1f1f1f] dark:text-white poppins-regular"
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
                  className={`px-4 py-2 rounded-md transition-colors duration-300 truncate ${selectedNames.includes(name) ? 'bg-blue-400 text-white' : 'bg-[#d9d9d9] dark:bg-[#374151] text-[#1f1f1f] dark:text-white hover:bg-blue-400 dark:hover:bg-blue-400'}`}
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
            className="mt-2 p-2 w-full bg-[#e5e5e5] dark:bg-[#2f2f2f] dark:hover:bg-[#1f1f1f] text-[#1f1f1f] dark:text-white rounded poppins-regular"
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
            className="mt-2 p-2 w-full bg-[#e5e5e5] dark:bg-[#2f2f2f] dark:hover:bg-[#1f1f1f] text-[#1f1f1f] dark:text-white rounded poppins-regular"
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
      

      {showBillDiv && (
        <div className="w-screen h-screen fixed inset-0 bg-gray-400 dark:bg-gray-950 backdrop-blur-[2px] bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-0 py-10">
          <div id="bill-container" className="bg-white dark:bg-[#373c45] min-w-400px max-w-[1900px] p-6 flex flex-col items-center ">
            <span className="text-3xl poppins-bold text-[#1f1f1f] dark:text-white">DiviPay Bill Summary</span>

            {/* <button onClick={() => setShowBillDiv(false)}>
              Lci
            </button> */}

            {/* Date */}
            <div className="w-full mt-4 flex justify-center">
              <span className="poppins-regular text-sm text-[#1f1f1f] dark:text-white">
                📅 Date: <span>{format(currentDate, "dd/MM/yyyy")}</span>
              </span>
            </div>

            {/* Divider */}
            <div className="w-full mt-6 flex items-center gap-2">
              <div className="w-full border-t border-[#1f1f1f] dark:border-white border-dashed" />
              <span className="poppins-regular text-nowrap text-[#1f1f1f] dark:text-white">Tax Invoice</span>
              <div className="w-full border-t border-[#1f1f1f] dark:border-white border-dashed" />
            </div>

            {/* Currency */}
            <div className="w-full mt-4 text-center">
              <span className="poppins-medium text-lg text-[#1f1f1f] dark:text-white">
                {selectedCurrency.symbol} {selectedCurrency.name}
              </span>
            </div>

            {/* Bill Items */}
            <div className="w-full mt-4 border-b">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span className="poppins-regular text-[#1f1f1f] dark:text-white truncate line-heig">{item.name} (x{item.quantity})</span>
                  <span className="poppins-regular text-[#1f1f1f] dark:text-white text-nowrap">
                    {selectedCurrency.symbol} {item.cost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discounts */}
            {discounts.length > 0 && (
              <div className="w-full mt-4">
                {discounts.map((discount, index) => (
                  <div key={index} className="flex justify-between text-green-500">
                    <span className="poppins-regular">Discount {discount.symbol === "%" ? `(${discount.value}%)` : ""}</span>
                    <span className="poppins-regular">
                      -{selectedCurrency.symbol} {totalDiscount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Taxes */}
            {taxes.length > 0 && (
              <div className="w-full mt-2">
                {taxes.map((tax, index) => (
                  <div key={index} className="flex justify-between text-red-500">
                    <span className="poppins-regular truncate line-heig">{tax.name} {tax.symbol === "%" ? `(${tax.value}%)` : ""}</span>
                    <span className="poppins-regular text-nowrap">
                      +{selectedCurrency.symbol} {calculateTax(tax).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Final Amount */}
            <div className={`w-full ${selectedCurrency.rounding ? 'mt-2' : 'mt-4'} flex justify-between text-xl font-bold`}>
              <span className="poppins-bold text-base text-[#1f1f1f] dark:text-white">Total:</span>
              <span className="poppins-bold text-base text-[#1f1f1f] dark:text-white">
                {selectedCurrency.symbol} {finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Rounding */}
            {selectedCurrency.rounding && (
              <div className="w-full flex justify-between text-lg">
                <span className="poppins-regular text-sm text-[#1f1f1f] dark:text-white">Rounding:</span>
                <span className="poppins-regular text-sm text-[#1f1f1f] dark:text-white">
                  {selectedCurrency.symbol} {roundingDifference.toFixed(2)}
                </span>
              </div>
            )}

            {selectedCurrency.rounding && (
              <div className="w-full mt-2 border-t border-[#1f1f1f] dark:border-white border-dashed"/>
            )}

            {/* Roundoff Total */}
            {selectedCurrency.rounding && (
              <div className="w-full mt-2 flex justify-between text-xl font-bold">
                <span className="poppins-bold text-[#1f1f1f] dark:text-white">Roundoff Total:</span>
                <span className="poppins-bold text-[#1f1f1f] dark:text-white">
                  {selectedCurrency.symbol} {roundoffTotal.toFixed(0)}
                </span>
              </div>
            )}


            <div className="py-2">

            </div>
          </div>
        </div>
      )}


      {showPerPersonDiv && (
        <div className="w-screen h-screen fixed inset-0 bg-gray-400 dark:bg-gray-950 backdrop-blur-[2px] bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-0 px-4 sm:px-6 py-10">
          <div id="perPerson-container" className="bg-white dark:bg-[#373c45] max-w-[1900px] min-w-[700px] overflow-visible p-6 flex flex-col items-center">
            <span className="text-2xl poppins-bold text-[#1f1f1f] dark:text-white text-center">
              DiviPay - Per Person Summary
            </span>

            {/* Item-wise Cost Breakdown */}
            <div className="w-full mt-6">
              <span className="poppins-semibold text-lg text-[#1f1f1f] dark:text-white">
                Item-wise Breakdown
              </span>
              <div className="overflow-x-auto">
                <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 px-4 py-2 text-[#1f1f1f] dark:text-white">Item</th>
                      {names.map((name) => (
                        <th key={name} className="text-[#1f1f1f] dark:text-white border border-gray-300 px-4 py-2">{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border border-gray-300">
                        <td className="border border-gray-300 px-4 py-2 text-[#1f1f1f] dark:text-white">{item.name}</td>
                        {names.map((name) => {
                          const share = item.sharedBy.find((p) => p.name === name);
                          return (
                            <td key={name} className="text-[#1f1f1f] dark:text-white border border-gray-300 px-4 py-2">
                              {share ? `${selectedCurrency.symbol}${(share.portion / item.sharedBy.reduce((acc, p) => acc + parseFloat(p.portion), 0) * item.cost).toFixed(2)}` : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final Cost Per Person */}
            <div className="w-full mt-6">
              <span className="poppins-semibold text-lg text-[#1f1f1f] dark:text-white">
                Final Amount Per Person
              </span>
              <div className="overflow-x-auto">
                <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 px-4 py-2 text-[#1f1f1f] dark:text-white">Person</th>
                      <th className="border border-gray-300 px-4 py-2 text-[#1f1f1f] dark:text-white">Amount Owed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sharedCost).map(([name, amount]) => (
                      <tr key={name} className="border border-gray-300">
                        <td className="border border-gray-300 px-4 py-2 text-[#1f1f1f] dark:text-white">{name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-[#1f1f1f] dark:text-white">{selectedCurrency.symbol}{amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rounding Off (If Needed) */}
            {selectedCurrency.rounding && (
              <div className="w-full mt-4">
                <span className="poppins-semibold text-lg text-[#1f1f1f] dark:text-white">
                  Rounding Adjustment
                </span>
                <p className="text-sm text-[#1f1f1f] dark:text-white">
                  Total rounding difference: {selectedCurrency.symbol}{roundingDifference.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
