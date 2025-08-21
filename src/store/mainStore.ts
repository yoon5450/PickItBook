import {create} from 'zustand';

export const useMainStore = create<{id:string, num:number}>()(() => ({
  id:'나',
  num:27
}))