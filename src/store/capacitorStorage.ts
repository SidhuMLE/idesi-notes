import { Preferences } from '@capacitor/preferences'

// Migrates any existing localStorage data to Capacitor Preferences on first access
const capacitorStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const { value } = await Preferences.get({ key: name })
    if (value !== null) return value

    // One-time migration from localStorage
    const legacy = localStorage.getItem(name)
    if (legacy) {
      await Preferences.set({ key: name, value: legacy })
      localStorage.removeItem(name)
      return legacy
    }
    return null
  },

  setItem: async (name: string, value: string): Promise<void> => {
    await Preferences.set({ key: name, value })
  },

  removeItem: async (name: string): Promise<void> => {
    await Preferences.remove({ key: name })
  },
}

export default capacitorStorage
