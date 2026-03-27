import { useEffect, useRef, useState } from 'react'
import {
  Clapperboard, Play, Settings2, Download, X, AlertCircle,
  RefreshCw, Clock, Monitor, Film, Layers, CheckCircle2, Upload,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import ModelSelector from './ModelSelector'
import { useApp } from '../context/AppContext'
import { CometAPIClient, getAvailableVideoModels, VIDEO_MODELS } from '../api/cometapi'
import { downloadAsset } from '../utils/downloadAsset'

const STATUS_COLORS = {
  pending:    'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  processing: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  succeeded:  'text-green-400 bg-green-500/10 border-green-500/30',
  failed:     'text-red-400 bg-red-500/10 border-red-500/30',
}

function VideoCard({ item, onRemove, onDownload }) {
  const isReady = item.status === 'succeeded' && item.videoUrl
  return (
    <div className="card space-y-3 animate-fade-in">
      {/* Video or placeholder */}
      <div className="relative rounded-lg overflow-hidden bg-black/40 aspect-video flex items-center justify-center">
        {isReady ? (
          <video
            src={item.videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Clapperboard size={32} />
            {item.status !== 'failed' && (
              <div className="flex gap-1">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-400 line-clamp-2">{item.prompt}</p>
        <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
          <span className="glass px-2 py-0.5 rounded">{item.model}</span>
          {item.settings?.duration && <span className="glass px-2 py-0.5 rounded">{item.settings.duration}s</span>}
          {item.settings?.resolution && <span className="glass px-2 py-0.5 rounded">{item.settings.resolution}</span>}
          {item.settings?.aspect && <span className="glass px-2 py-0.5 rounded">{item.settings.aspect}</span>}
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs border ${STATUS_COLORS[item.status] || STATUS_COLORS.pending}`}>
        {item.status === 'processing' || item.status === 'pending'
          ? <RefreshCw size={12} className="animate-spin" />
          : item.status === 'succeeded'
          ? <CheckCircle2 size={12} />
          : <AlertCircle size={12} />}
        <span className="capitalize">{item.status}</span>
        {item.taskId && <span className="ml-auto text-gray-600 truncate max-w-[80px]">{item.taskId.slice(0, 8)}…</span>}
      </div>

      {/* Error message */}
      {item.status === 'failed' && item.error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1.5">{item.error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isReady && (
          <button onClick={() => onDownload(item)} className="btn-secondary flex-1 py-1.5 text-xs">
            <Download size={12} /> Download
          </button>
        )}
        <button onClick={() => onRemove(item.id)} className="btn-secondary py-1.5 px-3 text-xs hover:bg-red-500/20 hover:border-red-500/40">
          <X size={12} />
        </button>
      </div>
    </div>
  )
}

export default function VideoView() {
  const { settings, addHistoryEntry, updateHistoryEntry } = useApp()
  const [videoModels, setVideoModels] = useState(VIDEO_MODELS)
  const [model, setModel] = useState(settings.defaultVideoModel || 'kling-v2-master')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [jobs, setJobs] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const pollTimers = useRef({})
  const imageInputRef = useRef(null)

  const [vidSettings, setVidSettings] = useState({
    duration: 5,
    resolution: '720p',
    aspect: '16:9',
    fps: 24,
    mode: 'std',
  })

  const enabledVideoModels = videoModels.filter((entry) => !settings.disabledVideoModelIds?.includes(entry.id))
  const visibleVideoModels = enabledVideoModels.length > 0 ? enabledVideoModels : videoModels
  const currentModel = visibleVideoModels.find((m) => m.id === model) || visibleVideoModels[0]
  const patchSetting = (k, v) => setVidSettings((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    let cancelled = false

    if (!settings.apiKey) {
      setVideoModels(VIDEO_MODELS)
      return undefined
    }

    const client = new CometAPIClient(settings.apiKey, settings.baseUrl)
    client.listModels()
      .then((payload) => {
        if (cancelled) return
        const available = getAvailableVideoModels(payload)
        setVideoModels(available.length > 0 ? available : VIDEO_MODELS)
      })
      .catch(() => {
        if (!cancelled) setVideoModels(VIDEO_MODELS)
      })

    return () => { cancelled = true }
  }, [settings.apiKey, settings.baseUrl])

  useEffect(() => {
    if (!visibleVideoModels.some((entry) => entry.id === model) && visibleVideoModels[0]) {
      setModel(visibleVideoModels[0].id)
    }
  }, [model, visibleVideoModels])

  const handleModelChange = (id) => {
    const m = visibleVideoModels.find((x) => x.id === id)
    setModel(id)
    if (m) {
      patchSetting('duration', m.durations[0])
      patchSetting('resolution', m.resolutions[0])
      patchSetting('aspect', m.aspects[0])
      patchSetting('fps', m.fps[0])
    }
  }

  const updateJob = (id, patch) =>
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)))

  const syncHistory = (jobId, patch) => {
    updateHistoryEntry('video', jobId, patch)
  }

  const startPolling = (jobId, jobData, client) => {
    const poll = async () => {
      try {
        const result = await client.pollVideo(jobData)
        // For MiniMax two-step: persist the file_id for next poll
        const merged = { ...result }
        if (result._minimaxFileId) {
          merged._minimaxFileId = result._minimaxFileId
        }

        updateJob(jobId, merged)
  syncHistory(jobId, merged)

        if (result.status !== 'succeeded' && result.status !== 'failed') {
          // Update the stored jobData with any new fields (e.g. _minimaxFileId)
          Object.assign(jobData, merged)
          pollTimers.current[jobId] = setTimeout(() => poll(), 5000)
        } else {
          delete pollTimers.current[jobId]
          if (result.status === 'succeeded') toast.success('Video ready!')
          else toast.error('Video generation failed')
        }
      } catch (err) {
        updateJob(jobId, { status: 'failed', error: err.message })
        syncHistory(jobId, { status: 'failed', error: err.message })
        delete pollTimers.current[jobId]
      }
    }
    pollTimers.current[jobId] = setTimeout(poll, 5000)
  }

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Enter a prompt'); return }
    if (!settings.apiKey) { toast.error('Set your API key in Settings first'); return }

    setGenerating(true)
    const jobId = `job-${Date.now()}`
    const newJob = {
      id: jobId,
      taskId: null,
      prompt: prompt.trim(),
      model,
      settings: { ...vidSettings },
      status: 'pending',
      videoUrl: null,
      error: null,
      provider: currentModel.provider,
      modelLabel: currentModel.label,
    }
    setJobs((prev) => [newJob, ...prev])
    addHistoryEntry('video', {
      id: jobId,
      prompt: prompt.trim(),
      model,
      modelLabel: currentModel.label,
      provider: currentModel.provider,
      settings: { ...vidSettings },
      status: 'pending',
      videoUrl: null,
      error: null,
    })

    try {
      const client = new CometAPIClient(settings.apiKey, settings.baseUrl)
      const opts = {
        negativePrompt: negativePrompt.trim() || undefined,
        duration: vidSettings.duration,
        resolution: vidSettings.resolution,
        aspect: vidSettings.aspect,
        fps: vidSettings.fps,
        mode: vidSettings.mode,
        imageFile: imageFile || undefined,
      }

      const submission = await client.submitVideo(prompt.trim(), currentModel, opts)
      if (!submission.taskId) throw new Error('No task ID returned — check your API subscription for video access')

      // Build a poll-able job descriptor
      const pollJob = {
        taskId: submission.taskId,
        _klingAction: submission._klingAction,
        _soraVeo: submission._soraVeo,
        _runway: submission._runway,
        _minimax: submission._minimax,
        _grok: submission._grok,
        _minimaxFileId: null,
        _provider: currentModel._provider,
      }

      updateJob(jobId, { taskId: submission.taskId, status: 'processing' })
      syncHistory(jobId, { taskId: submission.taskId, status: 'processing' })
      toast.success('Video job started, polling for result…')
      startPolling(jobId, pollJob, client)
    } catch (err) {
      updateJob(jobId, { status: 'failed', error: err.message })
      syncHistory(jobId, { status: 'failed', error: err.message })
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const removeJob = (id) => {
    clearTimeout(pollTimers.current[id])
    delete pollTimers.current[id]
    setJobs((p) => p.filter((j) => j.id !== id))
  }

  const downloadVideo = async (item) => {
    try {
      await downloadAsset(item.videoUrl, `video-${item.id}.mp4`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const supportsImageInput = ['kling', 'runway', 'grok', 'sora', 'veo', 'bytedance'].includes(currentModel._provider)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Settings panel */}
      <div className={`flex-shrink-0 overflow-y-auto border-r border-white/10 transition-all duration-200 ${showSettings ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <div className="p-5 space-y-5 min-w-[320px]">
          {/* Model */}
          <div>
            <label className="label">Model</label>
            <ModelSelector value={model} onChange={handleModelChange} models={visibleVideoModels} className="w-full" />
          </div>

          {/* Positive Prompt */}
          <div>
            <label className="label">Positive Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe the video you want to generate…"
              className="input-field resize-none leading-relaxed"
            />
          </div>

          {/* Negative Prompt */}
          <div>
            <label className="label">Negative Prompt</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              rows={3}
              placeholder="What to avoid in the video…"
              className="input-field resize-none leading-relaxed"
            />
          </div>

          {/* Image input (image-to-video) */}
          {supportsImageInput && (
            <div>
              <label className="label">Reference Image (optional)</label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile ? (
                <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-sm text-gray-300">
                  <span className="flex-1 truncate">{imageFile.name}</span>
                  <button onClick={() => { setImageFile(null); imageInputRef.current.value = '' }}
                    className="text-gray-500 hover:text-red-400"><X size={14} /></button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current.click()}
                  className="btn-secondary w-full py-2 text-sm"
                >
                  <Upload size={14} /> Upload image
                </button>
              )}
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="label"><Clock size={12} className="inline mr-1" />Duration</label>
            <div className="flex gap-2 flex-wrap">
              {currentModel.durations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => patchSetting('duration', d)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all min-w-[60px]
                    ${vidSettings.duration === d
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="label"><Monitor size={12} className="inline mr-1" />Resolution</label>
            <div className="flex gap-2 flex-wrap">
              {currentModel.resolutions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => patchSetting('resolution', r)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all
                    ${vidSettings.resolution === r
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="label"><Layers size={12} className="inline mr-1" />Aspect Ratio</label>
            <div className="flex gap-2 flex-wrap">
              {currentModel.aspects.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => patchSetting('aspect', a)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all min-w-[60px]
                    ${vidSettings.aspect === a
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* FPS */}
          <div>
            <label className="label"><Film size={12} className="inline mr-1" />Frame Rate (FPS)</label>
            <div className="flex gap-2">
              {currentModel.fps.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => patchSetting('fps', f)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all
                    ${vidSettings.fps === f
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                >
                  {f} fps
                </button>
              ))}
            </div>
          </div>

          {/* Kling mode */}
          {currentModel._provider === 'kling' && (
            <div>
              <label className="label">Mode</label>
              <div className="flex gap-2">
                {['std', 'pro'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => patchSetting('mode', m)}
                    className={`flex-1 py-2 rounded-lg text-sm uppercase tracking-wide transition-all
                      ${vidSettings.mode === m
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="glass rounded-xl p-3 text-xs text-gray-400 space-y-1">
            <div className="font-medium text-gray-300 mb-2">Configuration Summary</div>
            <div className="flex justify-between"><span>Duration</span><span className="text-white">{vidSettings.duration}s</span></div>
            <div className="flex justify-between"><span>Resolution</span><span className="text-white">{vidSettings.resolution}</span></div>
            <div className="flex justify-between"><span>Aspect</span><span className="text-white">{vidSettings.aspect}</span></div>
            <div className="flex justify-between"><span>FPS</span><span className="text-white">{vidSettings.fps}</span></div>
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={generating || !prompt.trim()}
            className="btn-primary w-full py-3 text-base"
          >
            {generating
              ? <><RefreshCw size={16} className="animate-spin" /> Starting Job…</>
              : <><Play size={16} /> Generate Video</>}
          </button>
        </div>
      </div>

      {/* Jobs panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 glass-dark flex-shrink-0">
          <div>
            <h2 className="font-semibold">Video Generation</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} &middot; Videos are generated asynchronously
            </p>
          </div>
          <div className="flex gap-2">
            {jobs.length > 0 && (
              <button onClick={() => setJobs([])} className="btn-secondary py-2 px-3 text-xs">Clear all</button>
            )}
            <button
              onClick={() => setShowSettings((s) => !s)}
              className={`btn-secondary py-2 px-3 ${showSettings ? 'bg-indigo-600/30 border-indigo-500/40' : ''}`}
            >
              <Settings2 size={15} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-indigo-700 flex items-center justify-center">
                <Clapperboard size={32} />
              </div>
              <div>
                <p className="font-medium text-gray-300">No videos yet</p>
                <p className="text-sm text-gray-500 mt-1">Enter a prompt and click Generate Video</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <VideoCard key={job.id} item={job} onRemove={removeJob} onDownload={downloadVideo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
