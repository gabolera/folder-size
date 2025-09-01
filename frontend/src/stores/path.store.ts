import { create } from "zustand";

type PathStore = {
  path: string;
  definePath: (value: string) => void;
  clearPath: () => void;
  sortBy: string
  sortOrder: string
  setSortBy: (value: "name" | "size" | "date") => void
  setSortOrder: (value: "asc" | "desc") => void
};

const usePathStore = create<PathStore>((set) => ({
  path: "",
  sortBy: "size",
  sortOrder: "desc",
  definePath: (value: string) => set(() => ({ path: value })),
  clearPath: () => set(() => ({ path: "" })),
  setSortBy: (value: "name" | "size" | "date") => set(() => ({ sortBy: value })),
  setSortOrder: (value: "asc" | "desc") => set(() => ({ sortOrder: value })),
}));

export default usePathStore
