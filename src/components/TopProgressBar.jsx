"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname(); // detect page change
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pathname) return;

    setProgress(30); // start
    const timer = setTimeout(() => setProgress(70), 200); // mid
    const finish = setTimeout(() => setProgress(100), 600); // finish

    const reset = setTimeout(() => setProgress(0), 1000); // hide after complete

    return () => {
      clearTimeout(timer);
      clearTimeout(finish);
      clearTimeout(reset);
    };
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[9999]">
      <div
        className="h-[3px] bg-gradient-to-r from-violet-600 to-amber-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
