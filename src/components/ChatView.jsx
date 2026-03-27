import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, StopCircle, Trash2, Copy, Check, User, Bot, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ModelSelector from './ModelSelector'
import { useApp } from '../context/AppContext'
import {
  CometAPIClient,
  CHAT_MODELS,
  DEFAULT_CHAT_MODEL,
  getAvailableChatModels,
  normalizeModelId,
} from '../api/cometapi'

function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 group animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1
        ${isUser ? 'bg-indigo-600' : 'bg-gradient-to-br from-purple-600 to-indigo-700'}`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
        ${isUser
          ? 'bg-indigo-600/40 border border-indigo-500/30 text-white rounded-tr-sm'
          : 'glass text-gray-100 rounded-tl-sm'}`}>
        {msg.role === 'error' ? (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={14} /> <span>{msg.content}</span>
          </div>
        ) : (
          <div className="prose-dark whitespace-pre-wrap">{msg.content}</div>
        )}

        {/* Copy button */}
        {msg.content && (
          <button
            onClick={copy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded
                       hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center flex-shrink-0">
        <Bot size={14} />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}

export default function ChatView() {
  const { settings, addHistoryEntry } = useApp()
  const [chatModels, setChatModels] = useState(CHAT_MODELS)
  const [model, setModel] = useState(() => normalizeModelId(CHAT_MODELS, settings.defaultChatModel, DEFAULT_CHAT_MODEL))
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [thinking, setThinking] = useState(false)
  const abortRef = useRef(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const visibleChatModels = chatModels.filter((entry) => !settings.disabledChatModelIds?.includes(entry.id))
  const selectableChatModels = visibleChatModels.length > 0 ? visibleChatModels : chatModels

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    let cancelled = false

    if (!settings.apiKey) {
      setChatModels(CHAT_MODELS)
      return undefined
    }

    const client = new CometAPIClient(settings.apiKey, settings.baseUrl)
    client.listModels()
      .then((payload) => {
        if (cancelled) return
        const available = getAvailableChatModels(payload)
        setChatModels(available.length > 0 ? available : CHAT_MODELS)
      })
      .catch(() => {
        if (!cancelled) setChatModels(CHAT_MODELS)
      })

    return () => { cancelled = true }
  }, [settings.apiKey, settings.baseUrl])

  useEffect(() => {
    setModel((current) => {
      if (selectableChatModels.some((entry) => entry.id === current)) {
        return current
      }
      return normalizeModelId(selectableChatModels, settings.defaultChatModel, DEFAULT_CHAT_MODEL)
    })
  }, [selectableChatModels, settings.defaultChatModel])

  const stop = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
    setThinking(false)
  }

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return
    if (!settings.apiKey) { toast.error('Set your API key in Settings first'); return }

    const userMsg = { role: 'user', content: text, id: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    const history = [
      ...(settings.systemPrompt ? [{ role: 'system', content: settings.systemPrompt }] : []),
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: text },
    ]

    const assistantId = Date.now() + 1
    let responseText = ''
    try {
      const client = new CometAPIClient(settings.apiKey, settings.baseUrl)
      let first = true
      const selectedModel = selectableChatModels.find((entry) => entry.id === model)

      for await (const delta of client.chatStream(history, model, {
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
        useResponses: selectedModel?.supportsResponses,
      })) {
        if (controller.signal.aborted) break
        responseText += delta
        if (first) {
          setThinking(false)
          setMessages((prev) => [...prev, { role: 'assistant', content: delta, id: assistantId }])
          first = false
        } else {
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: m.content + delta } : m)
          )
        }
      }

      if (!controller.signal.aborted && responseText.trim()) {
        addHistoryEntry('chat', {
          prompt: text,
          response: responseText,
          model,
          modelLabel: selectedModel?.label || model,
          provider: selectedModel?.provider || 'Unknown',
          status: 'succeeded',
        })
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setThinking(false)
        setMessages((prev) => [...prev, { role: 'error', content: err.message, id: Date.now() }])
        toast.error(err.message)
        const selectedModel = selectableChatModels.find((entry) => entry.id === model)
        addHistoryEntry('chat', {
          prompt: text,
          response: '',
          error: err.message,
          model,
          modelLabel: selectedModel?.label || model,
          provider: selectedModel?.provider || 'Unknown',
          status: 'failed',
        })
      }
    } finally {
      setStreaming(false)
      setThinking(false)
      abortRef.current = null
    }
  }, [input, streaming, messages, model, settings])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Chat cleared')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 glass-dark flex-shrink-0 relative z-10">
        <ModelSelector value={model} onChange={setModel} models={selectableChatModels} />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white">Chat</h2>
          <p className="text-xs text-gray-500 mt-0.5">Conversational AI pipeline</p>
        </div>
        <button onClick={clearChat} className="btn-secondary py-2 px-3 flex-shrink-0" title="Clear chat">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
              <Bot size={32} />
            </div>
            <div>
              <p className="font-medium text-gray-300">Start a conversation</p>
              <p className="text-sm text-gray-500 mt-1">Ask anything or send a prompt below</p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {thinking && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/10 glass-dark flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="input-field resize-none min-h-[42px] max-h-40 py-2.5 leading-relaxed"
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
            }}
            disabled={streaming}
          />
          {streaming ? (
            <button onClick={stop} className="btn-secondary flex-shrink-0 h-[42px] px-4">
              <StopCircle size={16} />
              <span>Stop</span>
            </button>
          ) : (
            <button onClick={send} disabled={!input.trim()} className="btn-primary flex-shrink-0 h-[42px] px-4">
              <Send size={16} />
              <span>Send</span>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-2">Model: {model}</p>
      </div>
    </div>
  )
}
