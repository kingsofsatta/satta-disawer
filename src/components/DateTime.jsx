"use client";
import { useEffect, useState } from "react";

const DateTime = () => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Date format: Day Month Year
      const datePart = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Time format: hh:mm AM/PM
      const timePart = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setDateTime(`${datePart} | ${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-lg font-semibold text-slate-400">{dateTime}</p>
  );
};

export default DateTime;
