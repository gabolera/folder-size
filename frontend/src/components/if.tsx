import { ReactElement } from "react";

interface IfProps {
  children: ReactElement;
  condition: boolean;
}

export function If({ children, condition }: IfProps) {
  return condition ? <>{children}</> : null;
}
