import { useMemo, useState } from 'react'
import {
  Bot,
  Clapperboard,
  Download,
  Image as ImageIcon,
  MessageSquare,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApp } from '../context/AppContext'
import { downloadAsset } from '../utils/downloadAsset'

function formatDate(value) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function HistorySection({ title, icon: Icon, count, children, onClear }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-indigo-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{count} item{count === 1 ? '' : 's'}</p>
          </div>
        </div>
        <button onClick={onClear} className="btn-secondary py-2 px-3 text-xs">
          <Trash2 size={12} /> Clear
        </button>
      </div>
      {children}
    </section>
  )
}

export default function HistoryView() {
  const { history, clearHistory } = useApp()
  const [activeType, setActiveType] = useState('chat')

  const handleDownload = async (url, filename) => {
    try {
      await downloadAsset(url, filename)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const tabs = useMemo(() => ([
    { id: 'chat', label: 'Chat', icon: MessageSquare, count: history.chat.length },
    { id: 'image', label: 'Image', icon: ImageIcon, count: history.image.length },
    { id: 'video', label: 'Video', icon: Clapperboard, count: history.video.length },
  ]), [history])

  const renderChat = () => (
    <HistorySection title="Chat History" icon={MessageSquare} count={history.chat.length} onClear={() => clearHistory('chat')}>
      <div className="space-y-3">
        {history.chat.length === 0 && <EmptyState label="No chat history yet" />}
        {history.chat.map((entry) => (
          <div key={entry.id} className="card space-y-3">
            <MetaRow entry={entry} />
            <div className="glass rounded-xl p-3 space-y-2">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-1">Prompt</div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{entry.prompt}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-1">Response</div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{entry.response || entry.error || 'No response recorded.'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </HistorySection>
  )

  const renderImage = () => (
    <HistorySection title="Image History" icon={ImageIcon} count={history.image.length} onClear={() => clearHistory('image')}>
      <div className="space-y-3">
        {history.image.length === 0 && <EmptyState label="No image history yet" />}
        {history.image.map((entry) => (
          <div key={entry.id} className="card space-y-3">
            <MetaRow entry={entry} />
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              <span className="glass px-2 py-1 rounded-full">{entry.mode === 'edit' ? 'Edit' : 'Generate'}</span>
              {entry.negativePrompt ? <span className="glass px-2 py-1 rounded-full">Negative prompt used</span> : null}
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{entry.prompt}</p>
            {entry.error ? (
              <p className="text-sm text-red-400">{entry.error}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(entry.outputs || []).map((url, index) => (
                  <button
                    key={`${entry.id}-${index}`}
                    type="button"
                    onClick={() => handleDownload(url, `image-history-${entry.id}-${index + 1}.png`)}
                    className="group glass rounded-xl overflow-hidden border border-white/10 text-left"
                  >
                    <img src={url} alt={entry.prompt} className="w-full aspect-square object-cover" />
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-300">
                      <span>Download result {index + 1}</span>
                      <Download size={12} className="opacity-60 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </HistorySection>
  )

  const renderVideo = () => (
    <HistorySection title="Video History" icon={Clapperboard} count={history.video.length} onClear={() => clearHistory('video')}>
      <div className="space-y-3">
        {history.video.length === 0 && <EmptyState label="No video history yet" />}
        {history.video.map((entry) => (
          <div key={entry.id} className="card space-y-3">
            <MetaRow entry={entry} />
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              {entry.settings?.duration ? <span className="glass px-2 py-1 rounded-full">{entry.settings.duration}s</span> : null}
              {entry.settings?.resolution ? <span className="glass px-2 py-1 rounded-full">{entry.settings.resolution}</span> : null}
              {entry.settings?.aspect ? <span className="glass px-2 py-1 rounded-full">{entry.settings.aspect}</span> : null}
            </div>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">{entry.prompt}</p>
            {entry.videoUrl ? (
              <div className="space-y-3">
                <video src={entry.videoUrl} controls className="w-full rounded-xl bg-black/40 aspect-video object-contain" />
                <button
                  type="button"
                  onClick={() => handleDownload(entry.videoUrl, `video-history-${entry.id}.mp4`)}
                  className="btn-secondary py-2 px-3 text-sm"
                >
                  <Download size={14} /> Download Video
                </button>
              </div>
            ) : (
              <div className="glass rounded-xl p-4 text-sm text-gray-400 flex items-center gap-2">
                {entry.status === 'processing' || entry.status === 'pending'
                  ? <RefreshCw size={14} className="animate-spin" />
                  : <Bot size={14} />}
                <span>{entry.error || `Status: ${entry.status}`}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </HistorySection>
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">History</h1>
            <p className="text-sm text-gray-500 mt-1">Review prior chat replies and image or video generations stored locally in the browser.</p>
          </div>
          <button onClick={() => clearHistory()} className="btn-secondary py-2 px-3 text-sm">
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveType(id)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${activeType === id
                ? 'border-indigo-500 bg-indigo-600/20 text-white'
                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon size={14} /> {label} ({count})
              </span>
            </button>
          ))}
        </div>

        {activeType === 'chat' && renderChat()}
        {activeType === 'image' && renderImage()}
        {activeType === 'video' && renderVideo()}
      </div>
    </div>
  )
}

function MetaRow({ entry }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{entry.provider}</span>
      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{entry.modelLabel}</span>
      <span className={`rounded-full border px-2 py-1 ${entry.status === 'failed'
        ? 'border-red-500/30 bg-red-500/10 text-red-300'
        : entry.status === 'processing' || entry.status === 'pending'
        ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
        : 'border-green-500/30 bg-green-500/10 text-green-300'}`}>
        {entry.status || 'succeeded'}
      </span>
      <span className="ml-auto text-gray-500">{formatDate(entry.createdAt)}</span>
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <div className="glass rounded-2xl px-6 py-12 text-center text-sm text-gray-500">
      {label}
    </div>
  )
}
