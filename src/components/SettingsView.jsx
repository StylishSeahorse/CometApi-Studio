import { useEffect, useState } from 'react'
import {
  Key, Link2, Bot, Image, Video, Thermometer, Hash, MessageSquare,
  Save, RotateCcw, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApp } from '../context/AppContext'
import {
  CometAPIClient,
  CHAT_MODELS,
  DEFAULT_CHAT_MODEL,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_VIDEO_MODEL,
  getAvailableChatModels,
  getAvailableVideoModels,
  IMAGE_MODELS,
  IMAGE_EDIT_MODELS,
  VIDEO_MODELS,
  normalizeModelId,
} from '../api/cometapi'

function Section({ title, icon: Icon, children }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Icon size={16} className="text-indigo-400" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function FieldRow({ label, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
    </div>
  )
}

function groupByProvider(models) {
  return models.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = []
    acc[model.provider].push(model)
    return acc
  }, {})
}

function filterEnabled(models, disabledIds) {
  const filtered = models.filter((model) => !disabledIds.includes(model.id))
  return filtered.length > 0 ? filtered : models
}

function ModelToggleGrid({ title, models, disabledIds, onToggle }) {
  const groups = groupByProvider(models)

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-200">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">Use these toggles to control which models appear in the app.</p>
      </div>
      {Object.entries(groups).map(([provider, providerModels]) => (
        <div key={provider} className="glass rounded-xl overflow-hidden border border-white/10">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 bg-black/20">
            {provider}
          </div>
          <div className="divide-y divide-white/5">
            {providerModels.map((model) => {
              const enabled = !disabledIds.includes(model.id)
              return (
                <div key={model.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-100 truncate">{model.label}</div>
                    <div className="text-xs text-gray-500 truncate">{model.id}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggle(model.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
                    aria-pressed={enabled}
                    title={enabled ? 'Disable model' : 'Enable model'}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SettingsView() {
  const { settings, updateSettings } = useApp()
  const [local, setLocal] = useState({ ...settings })
  const [chatModels, setChatModels] = useState(CHAT_MODELS)
  const [videoModels, setVideoModels] = useState(VIDEO_MODELS)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null) // null | 'ok' | 'fail'
  const [testMsg, setTestMsg] = useState('')

  const patch = (k, v) => setLocal((p) => ({ ...p, [k]: v }))
  const enabledChatModels = filterEnabled(chatModels, local.disabledChatModelIds)
  const enabledImageModels = filterEnabled(IMAGE_MODELS, local.disabledImageModelIds)
  const enabledVideoModels = filterEnabled(videoModels, local.disabledVideoModelIds)

  useEffect(() => {
    let cancelled = false

    if (!local.apiKey) {
      setChatModels(CHAT_MODELS)
      return undefined
    }

    const client = new CometAPIClient(local.apiKey, local.baseUrl)
    client.listModels()
      .then((payload) => {
        if (cancelled) return
        const available = getAvailableChatModels(payload)
        const availableVideos = getAvailableVideoModels(payload)
        const nextModels = available.length > 0 ? available : CHAT_MODELS
        const nextVideoModels = availableVideos.length > 0 ? availableVideos : VIDEO_MODELS
        setChatModels(nextModels)
        setVideoModels(nextVideoModels)
        setLocal((prev) => ({
          ...prev,
          defaultChatModel: normalizeModelId(filterEnabled(nextModels, prev.disabledChatModelIds || []), prev.defaultChatModel, DEFAULT_CHAT_MODEL),
          defaultVideoModel: normalizeModelId(filterEnabled(nextVideoModels, prev.disabledVideoModelIds || []), prev.defaultVideoModel, DEFAULT_VIDEO_MODEL),
        }))
      })
      .catch(() => {
        if (cancelled) return
        setChatModels(CHAT_MODELS)
        setVideoModels(VIDEO_MODELS)
        setLocal((prev) => ({
          ...prev,
          defaultChatModel: normalizeModelId(filterEnabled(CHAT_MODELS, prev.disabledChatModelIds || []), prev.defaultChatModel, DEFAULT_CHAT_MODEL),
          defaultVideoModel: normalizeModelId(filterEnabled(VIDEO_MODELS, prev.disabledVideoModelIds || []), prev.defaultVideoModel, DEFAULT_VIDEO_MODEL),
        }))
      })

    return () => { cancelled = true }
  }, [local.apiKey, local.baseUrl])

  const save = () => {
    updateSettings(local)
    toast.success('Settings saved!')
  }

  const toggleDisabledModel = (settingsKey, modelId, models, defaultKey, fallbackId) => {
    setLocal((prev) => {
      const currentDisabled = Array.isArray(prev[settingsKey]) ? prev[settingsKey] : []
      const currentlyEnabled = models.filter((model) => !currentDisabled.includes(model.id))
      const isDisabled = currentDisabled.includes(modelId)

      if (!isDisabled && currentlyEnabled.length === 1 && currentlyEnabled[0]?.id === modelId) {
        toast.error('Keep at least one model enabled in each section')
        return prev
      }

      const nextDisabled = isDisabled
        ? currentDisabled.filter((id) => id !== modelId)
        : [...currentDisabled, modelId]
      const nextEnabled = filterEnabled(models, nextDisabled)

      return {
        ...prev,
        [settingsKey]: nextDisabled,
        ...(defaultKey ? {
          [defaultKey]: normalizeModelId(nextEnabled, prev[defaultKey], fallbackId),
        } : {}),
      }
    })
  }

  const reset = () => {
    setLocal({ ...settings })
    toast('Changes discarded', { icon: '↩️' })
  }

  const testConnection = async () => {
    if (!local.apiKey) { toast.error('Enter an API key first'); return }
    setTesting(true)
    setTestResult(null)
    try {
      const client = new CometAPIClient(local.apiKey, local.baseUrl)
      // Try a minimal chat call
      let text = ''
      const selectedModel = enabledChatModels.find((entry) => entry.id === local.defaultChatModel)
      for await (const chunk of client.chatStream(
        [{ role: 'user', content: 'Say: OK' }],
        normalizeModelId(enabledChatModels, local.defaultChatModel, DEFAULT_CHAT_MODEL),
        { max_tokens: 10, useResponses: selectedModel?.supportsResponses }
      )) { text += chunk }
      setTestResult('ok')
      setTestMsg(`Connected! Response: "${text.trim()}"`)
    } catch (err) {
      setTestResult('fail')
      setTestMsg(err.message)
    } finally {
      setTesting(false)
    }
  }

  const dirty = JSON.stringify(local) !== JSON.stringify(settings)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configure your CometAPI connection and defaults</p>
          </div>
          <div className="flex gap-2">
            {dirty && (
              <button onClick={reset} className="btn-secondary py-2 px-3">
                <RotateCcw size={14} /> Discard
              </button>
            )}
            <button onClick={save} className={`btn-primary py-2 px-4 ${dirty ? 'glow-brand' : 'opacity-70'}`}>
              <Save size={14} /> Save
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <Section title="API Credentials" icon={Key}>
          <FieldRow label="CometAPI Key" hint="Keep this secret — never share it publicly.">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={local.apiKey}
                onChange={(e) => patch('apiKey', e.target.value)}
                placeholder="sk-…"
                className="input-field pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FieldRow>

          <FieldRow label="Base URL" hint="Default: https://api.cometapi.com/v1 — change only if you use a custom proxy.">
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                value={local.baseUrl}
                onChange={(e) => patch('baseUrl', e.target.value)}
                placeholder="https://api.cometapi.com/v1"
                className="input-field pl-8"
              />
            </div>
          </FieldRow>

          {/* Test connection */}
          <div className="pt-1 space-y-2">
            <button
              onClick={testConnection}
              disabled={testing || !local.apiKey}
              className="btn-secondary w-full py-2"
            >
              {testing ? <><Bot size={14} className="animate-spin" /> Testing…</> : <><Bot size={14} /> Test Connection</>}
            </button>
            {testResult && (
              <div className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg border
                ${testResult === 'ok'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {testResult === 'ok' ? <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />}
                <span>{testMsg}</span>
              </div>
            )}
          </div>
        </Section>

        {/* Default Models */}
        <Section title="Default Models" icon={Bot}>
          <FieldRow label="Default Chat Model">
            <select
              value={local.defaultChatModel}
              onChange={(e) => patch('defaultChatModel', e.target.value)}
              className="input-field"
            >
              {enabledChatModels.map((m) => (
                <option key={m.id} value={m.id}>{m.provider} — {m.label}</option>
              ))}
            </select>
          </FieldRow>

          <FieldRow label="Default Image Model">
            <select
              value={local.defaultImageModel}
              onChange={(e) => patch('defaultImageModel', e.target.value)}
              className="input-field"
            >
              {enabledImageModels.map((m) => (
                <option key={m.id} value={m.id}>{m.provider} — {m.label}</option>
              ))}
            </select>
          </FieldRow>

          <FieldRow label="Default Video Model">
            <select
              value={local.defaultVideoModel}
              onChange={(e) => patch('defaultVideoModel', e.target.value)}
              className="input-field"
            >
              {enabledVideoModels.map((m) => (
                <option key={m.id} value={m.id}>{m.provider} — {m.label}</option>
              ))}
            </select>
          </FieldRow>
        </Section>

        <Section title="Model Availability" icon={Sparkles}>
          <ModelToggleGrid
            title="Chat Models"
            models={chatModels}
            disabledIds={local.disabledChatModelIds}
            onToggle={(modelId) => toggleDisabledModel('disabledChatModelIds', modelId, chatModels, 'defaultChatModel', DEFAULT_CHAT_MODEL)}
          />

          <ModelToggleGrid
            title="Image Generation Models"
            models={IMAGE_MODELS}
            disabledIds={local.disabledImageModelIds}
            onToggle={(modelId) => toggleDisabledModel('disabledImageModelIds', modelId, IMAGE_MODELS, 'defaultImageModel', DEFAULT_IMAGE_MODEL)}
          />

          <ModelToggleGrid
            title="Image Editing Models"
            models={IMAGE_EDIT_MODELS}
            disabledIds={local.disabledImageEditModelIds}
            onToggle={(modelId) => toggleDisabledModel('disabledImageEditModelIds', modelId, IMAGE_EDIT_MODELS)}
          />

          <ModelToggleGrid
            title="Video Models"
            models={videoModels}
            disabledIds={local.disabledVideoModelIds}
            onToggle={(modelId) => toggleDisabledModel('disabledVideoModelIds', modelId, videoModels, 'defaultVideoModel', DEFAULT_VIDEO_MODEL)}
          />

          <div className="glass rounded-xl p-4 text-xs text-gray-500">
            Models are grouped by provider and your choices are stored locally in the browser. Chat model availability is further constrained by what your CometAPI key can access.
          </div>
        </Section>

        {/* Chat Settings */}
        <Section title="Chat Settings" icon={MessageSquare}>
          <FieldRow label="System Prompt" hint="Sent as the system message before every conversation.">
            <textarea
              value={local.systemPrompt}
              onChange={(e) => patch('systemPrompt', e.target.value)}
              rows={3}
              className="input-field resize-none leading-relaxed"
              placeholder="You are a helpful assistant."
            />
          </FieldRow>

          <FieldRow label={`Temperature: ${local.temperature}`} hint="Higher = more creative, lower = more deterministic.">
            <input
              type="range" min={0} max={2} step={0.05}
              value={local.temperature}
              onChange={(e) => patch('temperature', parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-0.5">
              <span>0 (precise)</span><span>1 (balanced)</span><span>2 (creative)</span>
            </div>
          </FieldRow>

          <FieldRow label="Max Tokens" hint="Maximum tokens to generate per message.">
            <div className="flex items-center gap-3">
              <input
                type="range" min={256} max={32768} step={256}
                value={local.maxTokens}
                onChange={(e) => patch('maxTokens', parseInt(e.target.value))}
                className="flex-1 accent-indigo-500"
              />
              <span className="text-sm text-white w-16 text-right">{local.maxTokens.toLocaleString()}</span>
            </div>
          </FieldRow>

          <FieldRow label="Streaming">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => patch('streamChat', !local.streamChat)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer
                  ${local.streamChat ? 'bg-indigo-600' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                  ${local.streamChat ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm text-gray-300">{local.streamChat ? 'Enabled (real-time streaming)' : 'Disabled (wait for full response)'}</span>
            </label>
          </FieldRow>
        </Section>

        {/* About */}
        <div className="glass rounded-xl p-4 text-xs text-gray-500 space-y-1 text-center">
          <p className="font-medium text-gray-400">CometAPI Studio</p>
          <p>All settings are stored locally in your browser. No data is sent to any third party except CometAPI.</p>
        </div>
      </div>
    </div>
  )
}
