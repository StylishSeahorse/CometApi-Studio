import { useEffect, useRef, useState } from 'react'
import { Wand2, Download, RefreshCw, AlertCircle, Settings2, X, Image as ImageIcon, Upload, Pencil } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ModelSelector from './ModelSelector'
import { useApp } from '../context/AppContext'
import { CometAPIClient, IMAGE_MODELS, IMAGE_EDIT_MODELS } from '../api/cometapi'
import { downloadAsset } from '../utils/downloadAsset'

function ImageCard({ item, onRemove }) {
  const download = async () => {
    try {
      await downloadAsset(item.url, `image-${item.id}.png`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="relative group glass rounded-xl overflow-hidden animate-fade-in">
      <img
        src={item.url}
        alt={item.prompt}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <button onClick={() => onRemove(item.id)} className="self-end p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500">
          <X size={14} />
        </button>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-200">
            <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">{item.provider}</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">{item.modelLabel}</span>
          </div>
          <p className="text-xs text-gray-300 line-clamp-3">{item.prompt}</p>
          <button onClick={download} className="btn-secondary w-full py-1.5 text-xs">
            <Download size={12} /> Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ImageView() {
  const { settings, addHistoryEntry } = useApp()
  const [mode, setMode] = useState('generate') // 'generate' | 'edit'
  const [model, setModel] = useState(settings.defaultImageModel || 'gpt-image-1')
  const [editModel, setEditModel] = useState('gpt-image-1')
  const [providerFilter, setProviderFilter] = useState('All')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [showSettings, setShowSettings] = useState(true)

  // Edit mode state
  const [editImageFile, setEditImageFile] = useState(null)
  const [editMaskFile, setEditMaskFile] = useState(null)
  const [referenceImages, setReferenceImages] = useState([])
  const [geminiEditContents, setGeminiEditContents] = useState([])
  const editImageRef = useRef(null)
  const editMaskRef = useRef(null)
  const referenceImagesRef = useRef(null)

  // Per-model settings
  const [imgSettings, setImgSettings] = useState({
    size: '1024x1024',
    aspectRatio: '1:1',
    quality: 'standard',
    style: '',
    steps: 30,
    cfgScale: 7,
    seed: '',
    numImages: 1,
  })

  const enabledGenerateModels = IMAGE_MODELS.filter((entry) => !settings.disabledImageModelIds?.includes(entry.id))
  const enabledEditModels = IMAGE_EDIT_MODELS.filter((entry) => !settings.disabledImageEditModelIds?.includes(entry.id))
  const generateModels = enabledGenerateModels.length > 0 ? enabledGenerateModels : IMAGE_MODELS
  const editModels = enabledEditModels.length > 0 ? enabledEditModels : IMAGE_EDIT_MODELS
  const activeModels = mode === 'edit' ? editModels : generateModels
  const providerOptions = ['All', ...new Set(activeModels.map((entry) => entry.provider))]
  const filteredModels = providerFilter === 'All'
    ? activeModels
    : activeModels.filter((entry) => entry.provider === providerFilter)
  const currentModel = mode === 'edit'
    ? editModels.find((m) => m.id === editModel) || editModels[0]
    : generateModels.find((m) => m.id === model) || generateModels[0]

  const patchSetting = (key, val) => setImgSettings((p) => ({ ...p, [key]: val }))

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError(null)
    setProviderFilter('All')
    setReferenceImages([])
    if (referenceImagesRef.current) referenceImagesRef.current.value = ''
    if (nextMode !== 'edit') {
      setGeminiEditContents([])
      setEditImageFile(null)
      setEditMaskFile(null)
      if (editImageRef.current) editImageRef.current.value = ''
      if (editMaskRef.current) editMaskRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!providerOptions.includes(providerFilter)) {
      setProviderFilter('All')
    }
  }, [providerFilter, providerOptions])

  useEffect(() => {
    if (filteredModels.length === 0) return

    if (mode === 'edit') {
      if (!filteredModels.some((entry) => entry.id === editModel)) {
        handleModelChange(filteredModels[0].id)
      }
      return
    }

    if (!filteredModels.some((entry) => entry.id === model)) {
      handleModelChange(filteredModels[0].id)
    }
  }, [mode, providerFilter, model, editModel, filteredModels])

  useEffect(() => {
    if (mode === 'edit') {
      if (!editModels.some((entry) => entry.id === editModel) && editModels[0]) {
        setEditModel(editModels[0].id)
      }
      return
    }

    if (!generateModels.some((entry) => entry.id === model) && generateModels[0]) {
      setModel(generateModels[0].id)
    }
  }, [mode, model, editModel, generateModels, editModels])

  const handleModelChange = (id) => {
    if (mode === 'edit') {
      setEditModel(id)
      setGeminiEditContents([])
      const sourceModel = generateModels.find((x) => x.id === id) || IMAGE_MODELS.find((x) => x.id === id)
      if (sourceModel) {
        patchSetting('size', sourceModel.sizes?.[0] || '1024x1024')
        patchSetting('aspectRatio', sourceModel.aspects?.[0] || '1:1')
      }
    } else {
      const m = generateModels.find((x) => x.id === id) || IMAGE_MODELS.find((x) => x.id === id)
      setModel(id)
      setReferenceImages([])
      if (referenceImagesRef.current) referenceImagesRef.current.value = ''
      if (m) {
        patchSetting('size', m.sizes[0] || '1024x1024')
        patchSetting('aspectRatio', m.aspects?.[0] || '1:1')
        patchSetting('quality', m.qualities[0] || 'standard')
        patchSetting('style', m.styles[0] || '')
      }
    }
  }

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Enter a prompt'); return }
    if (!settings.apiKey) { toast.error('Set your API key in Settings first'); return }
    if (mode === 'edit' && !editImageFile && !(currentModel.isGeminiImage && geminiEditContents.length > 0)) {
      toast.error('Upload an image to edit')
      return
    }
    setError(null)
    setGenerating(true)

    try {
      const client = new CometAPIClient(settings.apiKey, settings.baseUrl)

      if (mode === 'edit') {
        const opts = {
          size: imgSettings.size,
          n: imgSettings.numImages,
          quality: imgSettings.quality,
          mask: editMaskFile || undefined,
          aspectRatio: imgSettings.aspectRatio,
          imageSize: imgSettings.size,
        }
        if (currentModel.isGeminiImage) {
          const parts = [{ text: prompt.trim() }]
          if (editImageFile) {
            parts.push(editImageFile)
          }
          const contents = [
            ...geminiEditContents,
            {
              role: 'user',
              parts: await Promise.all(parts.map(async (part) => {
                if (typeof part === 'string') return { text: part }
                const dataUrl = await new Promise((resolve, reject) => {
                  const reader = new FileReader()
                  reader.onload = () => resolve(String(reader.result || ''))
                  reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
                  reader.readAsDataURL(part)
                })
                return {
                  inline_data: {
                    mime_type: part.type || 'image/png',
                    data: String(dataUrl).split(',')[1] || '',
                  },
                }
              })),
            },
          ]
          opts.contents = contents
        }

        const data = await client.editImage(editImageFile, prompt.trim(), editModel, opts)
        const images = data.data || []
        if (images.length === 0) throw new Error('No images returned')
        if (currentModel.isGeminiImage && data.geminiContent) {
          setGeminiEditContents((prev) => [...(opts.contents || prev), data.geminiContent])
        }
        const newItems = images.map((img, i) => ({
          id: `${Date.now()}-${i}`,
          url: img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : null),
          prompt: prompt.trim(),
          model: editModel,
          modelLabel: currentModel.label,
          provider: currentModel.provider,
          mode: 'edit',
        }))
        setResults((prev) => [...newItems, ...prev])
        addHistoryEntry('image', {
          prompt: prompt.trim(),
          mode: 'edit',
          model: editModel,
          modelLabel: currentModel.label,
          provider: currentModel.provider,
          outputs: newItems.map((item) => item.url),
          status: 'succeeded',
        })
        toast.success(`Edited ${newItems.length} image${newItems.length > 1 ? 's' : ''}!`)
      } else {
        const opts = {
          size: imgSettings.size,
          numImages: imgSettings.numImages,
          aspectRatio: imgSettings.aspectRatio,
          imageSize: imgSettings.size,
          referenceImages,
        }
        if (imgSettings.quality && imgSettings.quality !== 'standard') opts.quality = imgSettings.quality
        if (imgSettings.style) opts.style = imgSettings.style
        if (currentModel.supportsNegative && negativePrompt.trim()) opts.negative_prompt = negativePrompt.trim()
        if (imgSettings.steps) opts.steps = imgSettings.steps
        if (imgSettings.cfgScale !== 7) opts.guidance = imgSettings.cfgScale
        if (imgSettings.seed !== '') opts.seed = parseInt(imgSettings.seed, 10)

        const data = await client.generateImage(prompt.trim(), model, opts)
        const images = data.data || []
        if (images.length === 0) throw new Error('No images returned')
        const newItems = images.map((img, i) => ({
          id: `${Date.now()}-${i}`,
          url: img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : null),
          prompt: prompt.trim(),
          model,
          modelLabel: currentModel.label,
          provider: currentModel.provider,
          mode: 'generate',
        }))
        setResults((prev) => [...newItems, ...prev])
        addHistoryEntry('image', {
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim(),
          mode: 'generate',
          model,
          modelLabel: currentModel.label,
          provider: currentModel.provider,
          outputs: newItems.map((item) => item.url),
          status: 'succeeded',
        })
        toast.success(`Generated ${newItems.length} image${newItems.length > 1 ? 's' : ''}!`)
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      addHistoryEntry('image', {
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim(),
        mode,
        model: mode === 'edit' ? editModel : model,
        modelLabel: currentModel?.label || (mode === 'edit' ? editModel : model),
        provider: currentModel?.provider || 'Unknown',
        outputs: [],
        error: err.message,
        status: 'failed',
      })
    } finally {
      setGenerating(false)
    }
  }

  const removeResult = (id) => setResults((p) => p.filter((r) => r.id !== id))

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel – settings + prompts */}
      <div className={`flex-shrink-0 overflow-y-auto border-r border-white/10 transition-all duration-200 ${showSettings ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <div className="p-5 space-y-5 min-w-[320px]">

          {/* Mode toggle */}
          <div>
            <label className="label">Mode</label>
            <div className="flex gap-2">
              {[{ id: 'generate', icon: Wand2, label: 'Generate' }, { id: 'edit', icon: Pencil, label: 'Edit' }].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchMode(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm transition-all
                    ${mode === id
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                >
                  <Icon size={13} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="label">Model</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {providerOptions.map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => setProviderFilter(provider)}
                  className={`rounded-full border px-3 py-1 text-xs transition-all ${providerFilter === provider
                    ? 'border-indigo-500 bg-indigo-600/20 text-white'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {provider}
                </button>
              ))}
            </div>
            <ModelSelector
              value={mode === 'edit' ? editModel : model}
              onChange={handleModelChange}
              models={filteredModels}
              className="w-full"
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-[0.18em] text-[10px] text-gray-300">
                {currentModel.provider}
              </span>
              <span>{filteredModels.length} model{filteredModels.length === 1 ? '' : 's'} shown</span>
            </div>
          </div>

          {/* Reference images for supported generation models */}
          {mode === 'generate' && (currentModel.isGeminiImage || currentModel.isByteDanceImage) && (
            <div>
              <label className="label">Reference Images (optional)</label>
              <input
                ref={referenceImagesRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 14)
                  setReferenceImages(files)
                }}
              />
              {referenceImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {referenceImages.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => referenceImagesRef.current.click()}
                      className="btn-secondary flex-1 py-2 text-sm"
                    >
                      <Upload size={14} /> Replace images
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReferenceImages([])
                        if (referenceImagesRef.current) referenceImagesRef.current.value = ''
                      }}
                      className="btn-secondary py-2 px-3 text-sm hover:bg-red-500/20 hover:border-red-500/40"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentModel.isGeminiImage
                      ? 'Up to 14 reference images supported for Nano Banana models.'
                      : 'Doubao supports reference-guided generation from an input image.'}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => referenceImagesRef.current.click()}
                  className="btn-secondary w-full py-2 text-sm"
                >
                  <Upload size={14} /> Upload reference images
                </button>
              )}
            </div>
          )}

          {/* Edit mode: image upload */}
          {mode === 'edit' && (
            <>
              <div>
                <label className="label">
                  Image to Edit
                  {!currentModel.isGeminiImage || geminiEditContents.length === 0 ? <span className="text-red-400"> *</span> : null}
                </label>
                <input ref={editImageRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} />
                {editImageFile ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(editImageFile)}
                      alt="edit source"
                      className="w-full rounded-lg object-cover max-h-40"
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex-1 truncate">{editImageFile.name}</span>
                      <button onClick={() => { setEditImageFile(null); editImageRef.current.value = '' }}
                        className="text-gray-500 hover:text-red-400"><X size={13} /></button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => editImageRef.current.click()}
                    className="btn-secondary w-full py-2 text-sm">
                    <Upload size={14} /> {currentModel.isGeminiImage && geminiEditContents.length > 0 ? 'Add/replace source image' : 'Upload image'}
                  </button>
                )}
              </div>

              {currentModel.isGeminiImage && geminiEditContents.length > 0 && (
                <div className="glass rounded-lg p-3 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Gemini edit thread active</span>
                    <button
                      type="button"
                      onClick={() => setGeminiEditContents([])}
                      className="text-red-400 hover:text-red-300"
                    >
                      Reset thread
                    </button>
                  </div>
                  <p>Subsequent edits can continue from the last Gemini result without re-uploading the source image.</p>
                </div>
              )}

              <div>
                <label className="label">Mask (optional)</label>
                <input ref={editMaskRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => setEditMaskFile(e.target.files?.[0] || null)} />
                {editMaskFile ? (
                  <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-sm text-gray-300">
                    <span className="flex-1 truncate">{editMaskFile.name}</span>
                    <button onClick={() => { setEditMaskFile(null); editMaskRef.current.value = '' }}
                      className="text-gray-500 hover:text-red-400"><X size={13} /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => editMaskRef.current.click()}
                    className="btn-secondary w-full py-2 text-sm">
                    <Upload size={14} /> Upload mask
                  </button>
                )}
              </div>
            </>
          )}

          {/* Positive Prompt */}
          <div>
            <label className="label">{mode === 'edit' ? 'Edit Instructions' : 'Positive Prompt'}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={mode === 'edit' ? 'Describe the changes to make…' : 'Describe what you want to generate…'}
              className="input-field resize-none leading-relaxed"
            />
          </div>

          {/* Negative Prompt (generate mode only) */}
          {mode === 'generate' && (
            <div>
              <label className="label">
                Negative Prompt
                {!currentModel.supportsNegative && (
                  <span className="ml-2 normal-case font-normal text-yellow-600/70">(not supported)</span>
                )}
              </label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={3}
                placeholder="What to avoid: blurry, low quality, distorted…"
                className="input-field resize-none leading-relaxed"
                disabled={!currentModel.supportsNegative}
              />
            </div>
          )}

          {/* Resolution */}
          {mode === 'generate' && (
            <div>
              <label className="label">{currentModel.isGeminiImage ? 'Image Size' : 'Resolution / Size'}</label>
              <select
                value={imgSettings.size}
                onChange={(e) => patchSetting('size', e.target.value)}
                className="input-field"
              >
                {(currentModel.sizes || ['1024x1024']).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {mode === 'generate' && currentModel.isGeminiImage && currentModel.aspects && (
            <div>
              <label className="label">Aspect Ratio</label>
              <select
                value={imgSettings.aspectRatio}
                onChange={(e) => patchSetting('aspectRatio', e.target.value)}
                className="input-field"
              >
                {currentModel.aspects.map((aspect) => (
                  <option key={aspect} value={aspect}>{aspect}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quality */}
          {mode === 'generate' && currentModel.qualities && currentModel.qualities.length > 1 && (
            <div>
              <label className="label">Quality</label>
              <div className="flex gap-2">
                {currentModel.qualities.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => patchSetting('quality', q)}
                    className={`flex-1 py-1.5 rounded-lg text-sm capitalize transition-all
                      ${imgSettings.quality === q
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Style (generate mode) */}
          {mode === 'generate' && currentModel.styles && currentModel.styles.length > 0 && (
            <div>
              <label className="label">Style</label>
              <select
                value={imgSettings.style}
                onChange={(e) => patchSetting('style', e.target.value)}
                className="input-field"
              >
                {currentModel.styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Steps / CFG (diffusion models) */}
          {mode === 'generate' && currentModel.supportsNegative && (
            <>
              <div>
                <label className="label">Steps: {imgSettings.steps}</label>
                <input
                  type="range" min={10} max={150} step={1}
                  value={imgSettings.steps}
                  onChange={(e) => patchSetting('steps', parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                  <span>10 (fast)</span><span>150 (quality)</span>
                </div>
              </div>

              <div>
                <label className="label">Guidance / CFG: {imgSettings.cfgScale}</label>
                <input
                  type="range" min={1} max={20} step={0.5}
                  value={imgSettings.cfgScale}
                  onChange={(e) => patchSetting('cfgScale', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                  <span>1 (creative)</span><span>20 (precise)</span>
                </div>
              </div>
            </>
          )}

          {/* Seed (generate mode) */}
          {mode === 'generate' && (
            <div>
              <label className="label">Seed (blank = random)</label>
              <input
                type="number"
                value={imgSettings.seed}
                onChange={(e) => patchSetting('seed', e.target.value)}
                placeholder="e.g. 42"
                className="input-field"
              />
            </div>
          )}

          {/* Number of images */}
          {!currentModel.isGeminiImage && (
          <div>
            <label className="label">Number of Images: {imgSettings.numImages}</label>
            <input
              type="range" min={1} max={4} step={1}
              value={imgSettings.numImages}
              onChange={(e) => patchSetting('numImages', parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> <span>{error}</span>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={generate}
            disabled={generating || !prompt.trim() || (mode === 'edit' && !editImageFile)}
            className="btn-primary w-full py-3 text-base"
          >
            {generating
              ? <><RefreshCw size={16} className="animate-spin" /> {mode === 'edit' ? 'Editing…' : 'Generating…'}</>
              : mode === 'edit'
              ? <><Pencil size={16} /> Edit Image</>
              : <><Wand2 size={16} /> Generate</>}
          </button>
        </div>
      </div>

      {/* Right panel – results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 glass-dark flex-shrink-0">
          <div>
            <h2 className="font-semibold">Image {mode === 'edit' ? 'Editing' : 'Generation'}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{results.length} image{results.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {results.length > 0 && (
              <button onClick={() => setResults([])} className="btn-secondary py-2 px-3 text-xs">
                Clear all
              </button>
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

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                <ImageIcon size={32} />
              </div>
              <div>
                <p className="font-medium text-gray-300">No images yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'edit' ? 'Upload an image and enter edit instructions' : 'Enter a prompt and click Generate'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((item) => (
                <ImageCard key={item.id} item={item} onRemove={removeResult} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
