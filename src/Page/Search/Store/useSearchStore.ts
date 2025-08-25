import type { BookItemType } from "@/@types/global";
import { create } from "zustand";



interface StoreType {
  searchData:BookItemType[]

  setSearchData:(data:BookItemType[]) => void;
}


export const useSearchStore = create<StoreType>()((set) => ({
  searchData:[],

  setSearchData:(data:BookItemType[]) => set(() => ({searchData:data}))
}));
