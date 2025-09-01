import { ReactNode } from "react";

export function ScannerLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}
