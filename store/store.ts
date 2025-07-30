import { create } from "zustand"

interface AppState {
  selectedCountry: string | null
  selectedCity: string | null
  theme: "light" | "dark"
  language: "es" | "en"
  setSelectedCountry: (country: string | null) => void
  setSelectedCity: (city: string | null) => void
  setTheme: (theme: "light" | "dark") => void
  setLanguage: (language: "es" | "en") => void
}

export const useStore = create<AppState>((set) => ({
  selectedCountry: null,
  selectedCity: null,
  theme: "light",
  language: "es",
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}))
