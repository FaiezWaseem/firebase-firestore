import { create } from 'zustand'

import { User } from 'firebase/auth'

const useUser = create((set) => ({
  user: null,
  setUser: (user : User) => set({ user }),
}))

export default useUser