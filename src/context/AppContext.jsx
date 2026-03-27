import { createContext, useContext, useEffect, useState } from 'react'
import {
  CHAT_MODELS,
  DEFAULT_CHAT_MODEL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_VIDEO_MODEL,
  IMAGE_MODELS,
  VIDEO_MODELS,
  normalizeModelId,
} from '../api/cometapi'

const HISTORY_STORAGE_KEY = 'cometapi_history'
const MAX_HISTORY_ITEMS = 50

const DEFAULT_SETTINGS = {
  apiKey: '',
  baseUrl: 'https://api.cometapi.com/v1',
  defaultChatModel: DEFAULT_CHAT_MODEL,
  defaultImageModel: DEFAULT_IMAGE_MODEL,
  defaultVideoModel: DEFAULT_VIDEO_MODEL,
  disabledChatModelIds: [],
  disabledImageModelIds: [],
  disabledImageEditModelIds: [],
  disabledVideoModelIds: [],
  streamChat: true,
  systemPrompt: 'You are a helpful assistant.',
  maxTokens: 4096,
  temperature: 0.7,
}

const DEFAULT_HISTORY = {
  chat: [],
  image: [],
  video: [],
}

function normalizeSettings(candidate = {}) {
  const merged = { ...DEFAULT_SETTINGS, ...candidate }
  const disabledChatModelIds = _uniqueArray(merged.disabledChatModelIds)
  const disabledImageModelIds = _uniqueArray(merged.disabledImageModelIds)
  const disabledImageEditModelIds = _uniqueArray(merged.disabledImageEditModelIds)
  const disabledVideoModelIds = _uniqueArray(merged.disabledVideoModelIds)

  const enabledChatModels = _filterEnabledModels(CHAT_MODELS, disabledChatModelIds)
  const enabledImageModels = _filterEnabledModels(IMAGE_MODELS, disabledImageModelIds)
  const enabledVideoModels = _filterEnabledModels(VIDEO_MODELS, disabledVideoModelIds)

  return {
    ...merged,
    disabledChatModelIds,
    disabledImageModelIds,
    disabledImageEditModelIds,
    disabledVideoModelIds,
    defaultChatModel: normalizeModelId(enabledChatModels, merged.defaultChatModel, DEFAULT_CHAT_MODEL),
    defaultImageModel: normalizeModelId(enabledImageModels, merged.defaultImageModel, DEFAULT_IMAGE_MODEL),
    defaultVideoModel: normalizeModelId(enabledVideoModels, merged.defaultVideoModel, DEFAULT_VIDEO_MODEL),
  }
}

function normalizeHistory(candidate = {}) {
  return {
    chat: _normalizeHistoryList(candidate.chat),
    image: _normalizeHistoryList(candidate.image),
    video: _normalizeHistoryList(candidate.video),
  }
}

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cometapi_settings')
      return saved ? normalizeSettings(JSON.parse(saved)) : DEFAULT_SETTINGS
    } catch { return DEFAULT_SETTINGS }
  })

  useEffect(() => {
    localStorage.setItem('cometapi_settings', JSON.stringify(settings))
  }, [settings])

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY)
      return saved ? normalizeHistory(JSON.parse(saved)) : DEFAULT_HISTORY
    } catch {
      return DEFAULT_HISTORY
    }
  })

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const updateSettings = (patch) =>
    setSettings((prev) => normalizeSettings({ ...prev, ...patch }))

  const addHistoryEntry = (type, entry) => {
    if (!DEFAULT_HISTORY[type] || !entry) return

    const normalizedEntry = {
      id: entry.id || `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: entry.createdAt || new Date().toISOString(),
      ...entry,
    }

    setHistory((prev) => ({
      ...prev,
      [type]: [normalizedEntry, ...prev[type]].slice(0, MAX_HISTORY_ITEMS),
    }))
  }

  const updateHistoryEntry = (type, entryId, patch) => {
    if (!DEFAULT_HISTORY[type] || !entryId) return
    setHistory((prev) => ({
      ...prev,
      [type]: prev[type].map((entry) => (
        entry.id === entryId ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry
      )),
    }))
  }

  const clearHistory = (type) => {
    if (type && DEFAULT_HISTORY[type]) {
      setHistory((prev) => ({ ...prev, [type]: [] }))
      return
    }
    setHistory(DEFAULT_HISTORY)
  }

  return (
    <AppContext.Provider value={{
      settings,
      setSettings,
      updateSettings,
      history,
      addHistoryEntry,
      updateHistoryEntry,
      clearHistory,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

function _uniqueArray(value) {
  return Array.isArray(value) ? [...new Set(value.filter(Boolean))] : []
}

function _filterEnabledModels(models, disabledIds) {
  const enabled = models.filter((model) => !disabledIds.includes(model.id))
  return enabled.length > 0 ? enabled : models
}

function _normalizeHistoryList(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter(Boolean)
    .slice(0, MAX_HISTORY_ITEMS)
}
