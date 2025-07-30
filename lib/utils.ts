import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe version of Node.contains to avoid 'parameter 1 is not of type Node' errors
export function safeContains(
  parent: Node | null | undefined,
  child: Node | null | undefined
): boolean {
  return (
    !!parent &&
    !!child &&
    parent instanceof Node &&
    child instanceof Node &&
    parent.contains(child)
  );
}
