"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({setTheme, theme}) {

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

//  if (theme === null) return null; // Avoid hydration mismatch

  return (
    <button
      className="p-2 rounded bg-gray-200 dark:bg-gray-800"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙" : "🌞"}
    </button>
  );
}
