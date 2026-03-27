// ─── Model Catalog ────────────────────────────────────────────────────────
export const CHAT_MODELS = [
  // OpenAI
  { id: 'gpt-5-4-pro',          label: 'GPT-5.4 Pro',             provider: 'OpenAI', supportsResponses: true },
  { id: 'gpt-5-4-mini',         label: 'GPT-5.4 Mini',            provider: 'OpenAI', supportsResponses: true },
  // Anthropic
  { id: 'claude-opus-4-6',      label: 'Claude Opus 4.6',         provider: 'Anthropic' },
  { id: 'claude-sonnet-4-6',    label: 'Claude Sonnet 4.6',       provider: 'Anthropic' },
  { id: 'claude-sonnet-4-5',    label: 'Claude Sonnet 4.5',       provider: 'Anthropic' },
  { id: 'claude-haiku-4-5',     label: 'Claude Haiku 4.5',        provider: 'Anthropic' },
  // Google
  { id: 'gemini-3-1-pro-preview', label: 'Gemini 3.1 Pro',        provider: 'Google' },
  { id: 'gemini-3-1-flash-lite-preview', label: 'Gemini 3.1 Flash-Lite', provider: 'Google' },
  // xAI
  { id: 'grok-4',               label: 'Grok 4',                  provider: 'xAI' },
  { id: 'grok-4-1-fast',        label: 'Grok 4.1 Fast',           provider: 'xAI' },
  // DeepSeek
  { id: 'deepseek-v3.2',        label: 'DeepSeek V3.2',           provider: 'DeepSeek' },
  { id: 'deepseek-v3.1',        label: 'DeepSeek V3.1',           provider: 'DeepSeek' },
  { id: 'deepseek-chat',        label: 'DeepSeek Chat',           provider: 'DeepSeek' },
  // Meta
  { id: 'llama-4-maverick',     label: 'Llama 4 Maverick',        provider: 'Meta' },
  { id: 'llama-4-scout',        label: 'Llama 4 Scout',           provider: 'Meta' },
  // Mistral
  { id: 'mistral-large-3',      label: 'Mistral Large 3',         provider: 'Mistral' },
  { id: 'mistral-medium-3',     label: 'Mistral Medium 3',        provider: 'Mistral' },
  // Alibaba
  { id: 'qwen3-max-2026-01-23', label: 'Qwen3 Max',               provider: 'Alibaba' },
  { id: 'qwen3-5-plus',         label: 'Qwen 3.5 Plus',           provider: 'Alibaba' },
  { id: 'qwen3-5-flash',        label: 'Qwen 3.5 Flash',          provider: 'Alibaba' },
  // MiniMax
  { id: 'minimax-m2-7',         label: 'MiniMax M2.7',            provider: 'MiniMax' },
  { id: 'minimax-m2-5',         label: 'MiniMax M2.5',            provider: 'MiniMax' },
]

export const IMAGE_MODELS = [
  // OpenAI
  { id: 'gpt-image-1.5',        label: 'GPT Image 1.5',           provider: 'OpenAI',
    sizes: ['1024x1024', '1536x1024', '1024x1536'],
    qualities: ['standard', 'hd'], styles: [], supportsNegative: false, isFlux: false },
  { id: 'gpt-image-1',          label: 'GPT Image 1',             provider: 'OpenAI',
    sizes: ['1024x1024', '1536x1024', '1024x1536', 'auto'],
    qualities: ['standard', 'hd'], styles: [], supportsNegative: false, isFlux: false },
  { id: 'gpt-image-1-mini',     label: 'GPT Image 1 Mini',        provider: 'OpenAI',
    sizes: ['1024x1024', '1536x1024', '1024x1536', 'auto'],
    qualities: ['standard'], styles: [], supportsNegative: false, isFlux: false },
  // Google / Gemini image generation
  { id: 'gemini-3-pro-image',   label: 'Nano Banana Pro',         provider: 'Google',
    sizes: ['1K', '2K', '4K'], qualities: ['standard'], styles: [], supportsNegative: false,
    isFlux: false, isGeminiImage: true,
    aspects: ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'] },
  { id: 'gemini-3.1-flash-image-preview', label: 'Nano Banana 2', provider: 'Google',
    sizes: ['1K', '2K', '4K'], qualities: ['standard'], styles: [], supportsNegative: false,
    isFlux: false, isGeminiImage: true,
    aspects: ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'] },
  // Doubao / ByteDance
  { id: 'doubao-seedream-5-0-260128', label: 'Doubao Seedream 5', provider: 'Doubao',
    sizes: ['1K', '2K', '4K'], qualities: ['standard'], styles: [], supportsNegative: false,
    isFlux: false, isByteDanceImage: true },
  { id: 'doubao-seedream-4-5-251128', label: 'Doubao Seedream 4.5', provider: 'Doubao',
    sizes: ['1K', '2K', '4K'], qualities: ['standard'], styles: [], supportsNegative: false,
    isFlux: false, isByteDanceImage: true },
  { id: 'qwen-image',           label: 'Qwen Image',              provider: 'Alibaba',
    sizes: ['1024x1024', '1536x1024', '1024x1536', 'auto'],
    qualities: ['standard'], styles: [], supportsNegative: false, isFlux: false },
  // Black Forest Labs – Flux (async polling via /flux/v1/{model})
  { id: 'flux-kontext-max',     label: 'FLUX Kontext Max',        provider: 'Black Forest Labs',
    sizes: ['1024x1024', '1440x1024', '1024x1440'],
    qualities: ['standard'], styles: [], supportsNegative: false, isFlux: true },
  { id: 'flux-2-pro',           label: 'FLUX 2 Pro',              provider: 'Black Forest Labs',
    sizes: ['1024x1024', '1440x1024', '1024x1440', '1920x1080'],
    qualities: ['standard'], styles: [], supportsNegative: false, isFlux: true },
  { id: 'flux-2-max',           label: 'FLUX 2 Max',              provider: 'Black Forest Labs',
    sizes: ['1024x1024', '1440x1024', '1024x1440', '1920x1080'],
    qualities: ['standard'], styles: [], supportsNegative: false, isFlux: true },
]

// Models that support the /v1/images/edits endpoint
export const IMAGE_EDIT_MODELS = [
  { id: 'gpt-image-1.5',        label: 'GPT Image 1.5',           provider: 'OpenAI' },
  { id: 'gpt-image-1',          label: 'GPT Image 1',             provider: 'OpenAI' },
  { id: 'gpt-image-1-mini',     label: 'GPT Image 1 Mini',        provider: 'OpenAI' },
  { id: 'gemini-3-pro-image',   label: 'Nano Banana Pro',         provider: 'Google', isGeminiImage: true },
  { id: 'gemini-3.1-flash-image-preview', label: 'Nano Banana 2', provider: 'Google', isGeminiImage: true },
  { id: 'doubao-seedream-5-0-260128', label: 'Doubao Seedream 5', provider: 'Doubao', isByteDanceEdit: true },
  { id: 'doubao-seedream-4-5-251128', label: 'Doubao Seedream 4.5', provider: 'Doubao', isByteDanceEdit: true },
  { id: 'flux-kontext-max',     label: 'FLUX Kontext Max',        provider: 'Black Forest Labs' },
  { id: 'flux-kontext-pro',     label: 'FLUX Kontext Pro',        provider: 'Black Forest Labs' },
  { id: 'qwen-image-edit',      label: 'Qwen Image Edit',         provider: 'Alibaba' },
]

// ─── Video provider tag – controls which endpoint/polling logic to use ────
// provider values: 'kling' | 'sora' | 'veo' | 'bytedance' | 'runway' | 'minimax' | 'grok'
export const VIDEO_MODELS = [
  // ── Kling (Kuaishou) ──────────────────────────────────────────────────
  { id: 'kling-v2-master',      label: 'Kling v2 Master',         provider: 'Kuaishou', _provider: 'kling',
    modelName: 'kling-v2-master',
    durations: [5, 10], resolutions: ['720p', '1080p'], aspects: ['16:9', '9:16', '1:1'], fps: [24] },
  { id: 'kling-v1-6',           label: 'Kling v1.6',              provider: 'Kuaishou', _provider: 'kling',
    modelName: 'kling-v1-6',
    durations: [5, 10], resolutions: ['720p', '1080p'], aspects: ['16:9', '9:16', '1:1'], fps: [24] },
  { id: 'kling-v1-5',           label: 'Kling v1.5',              provider: 'Kuaishou', _provider: 'kling',
    modelName: 'kling-v1-5',
    durations: [5, 10], resolutions: ['720p', '1080p'], aspects: ['16:9', '9:16', '1:1'], fps: [24] },
  // ── Sora (OpenAI) ─────────────────────────────────────────────────────
  { id: 'sora-2',               label: 'Sora 2',                  provider: 'OpenAI',   _provider: 'sora',
    durations: [4, 8, 12], resolutions: ['720p', '1080p'],
    aspects: ['16:9', '9:16', '4:3', '3:4', '1:1'], fps: [24] },
  { id: 'sora-2-pro',           label: 'Sora 2 Pro',              provider: 'OpenAI',   _provider: 'sora',
    durations: [4, 8, 12], resolutions: ['720p', '1080p'],
    aspects: ['16:9', '9:16', '4:3', '3:4', '1:1'], fps: [24] },
  // ── Veo (Google) ──────────────────────────────────────────────────────
  { id: 'veo3.1',               label: 'Veo 3.1',                 provider: 'Google',   _provider: 'veo',
    durations: [8], resolutions: ['720p', '1080p'], aspects: ['16:9'], fps: [24] },
  { id: 'veo3.1-pro',           label: 'Veo 3.1 Pro',             provider: 'Google',   _provider: 'veo',
    durations: [8], resolutions: ['1080p'], aspects: ['16:9'], fps: [24] },
  { id: 'veo3-pro',             label: 'Veo 3 Pro',               provider: 'Google',   _provider: 'veo',
    durations: [8], resolutions: ['720p', '1080p'], aspects: ['16:9'], fps: [24] },
  // ── ByteDance / Seedance ─────────────────────────────────────────────
  { id: 'seedance-1-0-pro',     label: 'Seedance 1.0 Pro',        provider: 'ByteDance', _provider: 'bytedance',
    durations: [5, 10], resolutions: ['720p', '1080p'], aspects: ['16:9', '9:16', '1:1'], fps: [24] },
  { id: 'seedance-1-0-lite',    label: 'Seedance 1.0 Lite',       provider: 'ByteDance', _provider: 'bytedance',
    durations: [5, 10], resolutions: ['720p', '1080p'], aspects: ['16:9', '9:16', '1:1'], fps: [24] },
  // ── Runway ────────────────────────────────────────────────────────────
  { id: 'gen3a_turbo',          label: 'Runway Gen-3 Alpha Turbo', provider: 'Runway',  _provider: 'runway',
    durations: [5, 10], resolutions: ['720p'],
    aspects: ['16:9', '9:16', '1:1', '4:3', '3:4'], fps: [24] },
  // ── MiniMax (Hailuo) ──────────────────────────────────────────────────
  { id: 'minimax-hailuo-02',    label: 'Hailuo 02',               provider: 'MiniMax',  _provider: 'minimax',
    durations: [6], resolutions: ['720p', '1080p'], aspects: ['16:9', '9:16', '1:1'], fps: [25] },
  { id: 'T2V-01-Director',      label: 'Hailuo T2V Director',     provider: 'MiniMax',  _provider: 'minimax',
    durations: [6], resolutions: ['720p'], aspects: ['16:9', '9:16', '1:1'], fps: [25] },
  { id: 'I2V-01-Director',      label: 'Hailuo I2V Director',     provider: 'MiniMax',  _provider: 'minimax',
    durations: [6], resolutions: ['720p'], aspects: ['16:9', '9:16', '1:1'], fps: [25] },
  // ── XAI / Grok ────────────────────────────────────────────────────────
  { id: 'grok-imagine-video',   label: 'Grok Imagine Video',      provider: 'xAI',      _provider: 'grok',
    durations: [5, 10, 15], resolutions: ['480p', '720p'], aspects: ['16:9', '9:16', '1:1'], fps: [24] },
]

export const DEFAULT_CHAT_MODEL = 'claude-sonnet-4-6'
export const DEFAULT_IMAGE_MODEL = 'gpt-image-1'
export const DEFAULT_VIDEO_MODEL = 'kling-v2-master'

const CHAT_MODEL_PREFIX = /^(gpt|claude|gemini|grok|deepseek|llama|mistral|qwen|minimax)/i
const NON_CHAT_MODEL_PATTERN = /(image|edit|video|seedream|flux|veo|sora|kling|runway|hailuo|i2v|t2v|audio|transcribe|tts|speech|realtime|search|moderation|embed|embedding|ranker|rerank|vision)/i
const GENERIC_PROVIDER_PATTERN = /^(custom|distributor|default|router|routing|other|unknown)$/i

export function normalizeModelId(models, candidateId, fallbackId) {
  if (candidateId && models.some((model) => model.id === candidateId)) {
    return candidateId
  }
  if (fallbackId && models.some((model) => model.id === fallbackId)) {
    return fallbackId
  }
  return models[0]?.id || ''
}

export function getAvailableChatModels(payload) {
  const rawModels = _extractModelList(payload)
  if (rawModels.length === 0) {
    return CHAT_MODELS
  }

  const availableIds = new Set(rawModels.map((entry) => _getModelId(entry)).filter(Boolean))
  const curated = CHAT_MODELS.filter((model) => availableIds.has(model.id))
  const curatedIds = new Set(curated.map((model) => model.id))

  const discovered = rawModels
    .filter((entry) => _isLikelyChatModel(entry))
    .map((entry) => {
      const id = _getModelId(entry)
      return {
        id,
        label: entry.display_name || entry.name || _humanizeModelId(id),
        provider: _inferProvider(entry, id),
        supportsResponses: _supportsResponsesApi(entry, id),
      }
    })
    .filter((model) => model.id && !curatedIds.has(model.id))

  return _dedupeById([
    ...curated.map((model) => ({ ...model, supportsResponses: model.supportsResponses ?? _supportsResponsesApi(null, model.id) })),
    ...discovered,
  ])
}

export function getAvailableVideoModels(payload) {
  const rawModels = _extractModelList(payload)
  if (rawModels.length === 0) {
    return VIDEO_MODELS
  }

  const availableIds = new Set(rawModels.map((entry) => _getModelId(entry)).filter(Boolean))
  const curated = VIDEO_MODELS.filter((model) => availableIds.has(model.id))
  const curatedIds = new Set(curated.map((model) => model.id))

  const discovered = rawModels
    .filter((entry) => _isLikelyVideoModel(entry))
    .map((entry) => {
      const id = _getModelId(entry)
      const videoDefaults = _getVideoDefaults(id)
      return {
        id,
        label: entry.display_name || entry.name || _humanizeModelId(id),
        provider: _inferProvider(entry, id),
        _provider: videoDefaults._provider,
        modelName: videoDefaults.modelName,
        durations: videoDefaults.durations,
        resolutions: videoDefaults.resolutions,
        aspects: videoDefaults.aspects,
        fps: videoDefaults.fps,
      }
    })
    .filter((model) => model.id && !curatedIds.has(model.id))

  return _dedupeById([
    ...curated,
    ...discovered,
  ])
}

// ─── API Client ────────────────────────────────────────────────────────────
const ROOT = 'https://api.cometapi.com'

export class CometAPIClient {
  constructor(apiKey, baseUrl = `${ROOT}/v1`) {
    this.apiKey = apiKey
    // Normalize to root so we can build paths from scratch per provider
    this.root = baseUrl.replace(/\/v1\/?$/, '').replace(/\/$/, '') || ROOT
  }

  _headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...extra,
    }
  }

  async _handleError(res) {
    let msg = `HTTP ${res.status}`
    try { const j = await res.json(); msg = j.error?.message || j.message || msg } catch {}
    throw new Error(msg)
  }

  // ── Chat (streaming) ──────────────────────────────────────────────────
  async *chatStream(messages, model, options = {}) {
    const prefersResponses = options.useResponses ?? _supportsResponsesApi(null, model)

    if (prefersResponses) {
      try {
        yield* this._responsesStream(messages, model, options)
        return
      } catch (err) {
        if (!_shouldFallbackToChatCompletions(err)) throw err
      }
    }

    yield* this._chatCompletionsStream(messages, model, options)
  }


  async *_chatCompletionsStream(messages, model, options = {}) {
    const { useResponses, ...restOptions } = options
    const res = await fetch(`${this.root}/v1/chat/completions`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ model, messages, stream: true, ...restOptions }),
    })
    if (!res.ok) await this._handleError(res)

    yield* this._streamSseText(res, (json) => json.choices?.[0]?.delta?.content)
  }

  async *_responsesStream(messages, model, options = {}) {
    const { instructions, input } = _messagesToResponsesInput(messages)
    const body = {
      model,
      input,
      stream: true,
    }
    if (instructions) body.instructions = instructions
    if (options.max_tokens != null) body.max_output_tokens = options.max_tokens
    if (options.temperature != null) body.temperature = options.temperature

    const res = await fetch(`${this.root}/v1/responses`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)

    yield* this._streamSseText(res, (json) => _extractResponsesDelta(json))
  }

  async *_streamSseText(res, extractText) {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop()
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') return
        try {
          const json = JSON.parse(data)
          const delta = extractText(json)
          if (delta) yield delta
        } catch {}
      }
    }
  }
  // ── Image Generation ──────────────────────────────────────────────────
  // Standard models: POST /v1/images/generations (sync response)
  // Flux models:     POST /flux/v1/{model} → async {id} → GET /flux/v1/get_result?id=
  async generateImage(prompt, modelId, options = {}) {
    const modelDef = IMAGE_MODELS.find((m) => m.id === modelId)
    if (modelDef?.isFlux) {
      return this._fluxGenerate(prompt, modelId, options)
    }
    if (modelDef?.isGeminiImage) {
      return this._geminiGenerate(prompt, modelId, options)
    }
    if (modelDef?.isByteDanceImage) {
      return this._byteDanceGenerate(prompt, modelId, options)
    }
    const body = { model: modelId, prompt, n: options.numImages ?? options.n ?? 1 }
    if (modelId === 'qwen-image') delete body.n
    if (options.size) body.size = options.size
    if (options.quality && options.quality !== 'standard') body.quality = options.quality
    if (options.style) body.style = options.style
    if (options.seed != null) body.seed = options.seed
    const res = await fetch(`${this.root}/v1/images/generations`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    return res.json()
  }

  async _byteDanceGenerate(prompt, modelId, options = {}) {
    const body = {
      model: modelId,
      prompt,
      response_format: 'url',
      size: options.size || '2K',
      guidance_scale: options.guidanceScale ?? 3,
      watermark: options.watermark ?? false,
      n: String(options.numImages ?? options.n ?? 1),
    }
    if (options.referenceImages?.[0]) {
      body.image = await _fileToDataUrl(options.referenceImages[0])
    }

    const res = await fetch(`${this.root}/v1/images/generations`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    return res.json()
  }

  async _geminiGenerate(prompt, modelId, options = {}) {
    const parts = [{ text: prompt }]
    if (options.referenceImages?.length) {
      const imageParts = await Promise.all(
        options.referenceImages.map(async (file) => ({
          inline_data: {
            mime_type: file.type || 'image/png',
            data: await _fileToBase64(file),
          },
        }))
      )
      parts.push(...imageParts)
    }

    const contents = options.contents || [{ role: 'user', parts }]
    return this._geminiGenerateFromContents(modelId, contents, options)
  }

  async _geminiGenerateFromContents(modelId, contents, options = {}) {

    const body = {
      contents,
      tools: options.useGoogleSearch ? [{ google_search: {} }] : [],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: options.aspectRatio || '1:1',
          imageSize: options.imageSize || '1K',
        },
      },
    }

    const res = await fetch(`${this.root}/v1beta/models/${modelId}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    const images = []
    const geminiContent = json.candidates?.[0]?.content || null
    for (const candidate of json.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        const inline = part.inlineData || part.inline_data
        if (inline?.data) {
          images.push({ b64_json: inline.data })
        }
      }
    }
    return { data: images, geminiContent }
  }

  async _fluxGenerate(prompt, modelId, options = {}) {
    const body = { prompt }
    if (options.width || options.size) {
      const [w, h] = (options.size || '1024x1024').split('x').map(Number)
      body.width = w
      body.height = h
    }
    if (options.steps) body.steps = options.steps
    if (options.seed != null) body.seed = options.seed
    if (options.guidance) body.guidance = options.guidance
    if (options.negative_prompt) body.negative_prompt = options.negative_prompt

    const res = await fetch(`${this.root}/flux/v1/${modelId}`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    const { id } = await res.json()

    // Poll for result
    for (let attempts = 0; attempts < 60; attempts++) {
      await new Promise((r) => setTimeout(r, 3000))
      const poll = await fetch(`${this.root}/flux/v1/get_result?id=${id}`, {
        headers: this._headers(),
      })
      if (!poll.ok) await this._handleError(poll)
      const result = await poll.json()
      if (result.status === 'Ready') {
        const url = result.result?.sample
        return { data: [{ url }] }
      }
      if (result.status === 'Error') throw new Error(result.result?.error || 'Flux generation failed')
    }
    throw new Error('Flux image generation timed out')
  }

  // ── Image Editing ─────────────────────────────────────────────────────
  // POST /v1/images/edits  (multipart/form-data)
  async editImage(imageFile, prompt, modelId, options = {}) {
    const editModelDef = IMAGE_EDIT_MODELS.find((m) => m.id === modelId)
    if (editModelDef?.isGeminiImage) {
      const parts = [{ text: prompt }]
      if (imageFile) {
        parts.push({
          inline_data: {
            mime_type: imageFile.type || 'image/png',
            data: await _fileToBase64(imageFile),
          },
        })
      }
      const contents = options.contents || [{ role: 'user', parts }]
      return this._geminiGenerateFromContents(modelId, contents, options)
    }

    const form = new FormData()
    form.append('image', imageFile)
    form.append('prompt', prompt)
    form.append('model', modelId)
    if (editModelDef?.isByteDanceEdit) {
      form.append('response_format', 'url')
      form.append('size', 'adaptive')
      form.append('watermark', 'false')
      if (options.guidanceScale != null) form.append('guidance_scale', String(options.guidanceScale))
      if (options.seed != null) form.append('seed', String(options.seed))
    }
    if (options.mask) form.append('mask', options.mask)
    if (options.size) form.append('size', options.size)
    if (options.n) form.append('n', String(options.n))
    if (options.quality && options.quality !== 'standard') form.append('quality', options.quality)

    const res = await fetch(`${this.root}/v1/images/edits`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` }, // no Content-Type (browser sets multipart boundary)
      body: form,
    })
    if (!res.ok) await this._handleError(res)
    return res.json()
  }

  // ── Video Submission ──────────────────────────────────────────────────
  // Routes to the correct provider endpoint based on _provider tag
  async submitVideo(prompt, modelDef, opts = {}) {
    const p = modelDef._provider
    if (p === 'kling')   return this._klingSubmit(prompt, modelDef, opts)
    if (p === 'sora')    return this._soraVeoSubmit(prompt, modelDef, opts)
    if (p === 'veo')     return this._soraVeoSubmit(prompt, modelDef, opts)
    if (p === 'bytedance') return this._soraVeoSubmit(prompt, modelDef, opts)
    if (p === 'runway')  return this._runwaySubmit(prompt, modelDef, opts)
    if (p === 'minimax') return this._minimaxSubmit(prompt, modelDef, opts)
    if (p === 'grok')    return this._grokSubmit(prompt, modelDef, opts)
    throw new Error(`Unknown video provider: ${p}`)
  }

  async _klingSubmit(prompt, modelDef, opts) {
    const body = {
      prompt,
      model_name: modelDef.modelName,
      duration: opts.duration ?? 5,
      aspect_ratio: opts.aspect ?? '16:9',
      mode: opts.mode ?? 'std',
      cfg_scale: opts.cfgScale ?? 0.5,
    }
    if (opts.negativePrompt) body.negative_prompt = opts.negativePrompt
    if (opts.imageUrl) {
      // Image-to-video
      body.image = opts.imageUrl
      const res = await fetch(`${this.root}/kling/v1/videos/image2video`, {
        method: 'POST', headers: this._headers(), body: JSON.stringify(body),
      })
      if (!res.ok) await this._handleError(res)
      const json = await res.json()
      return { taskId: json.data?.task_id, _klingAction: 'image2video' }
    }
    const res = await fetch(`${this.root}/kling/v1/videos/text2video`, {
      method: 'POST', headers: this._headers(), body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    return { taskId: json.data?.task_id, _klingAction: 'text2video' }
  }

  async _soraVeoSubmit(prompt, modelDef, opts) {
    const form = new FormData()
    form.append('prompt', prompt)
    form.append('model', modelDef.id)
    // Sora uses seconds; Veo ignores duration (fixed 8s)
    if (modelDef._provider === 'sora' && opts.duration) {
      form.append('seconds', String(opts.duration))
    }
    // Map aspect + resolution to size string
    const size = _aspectResToSize(opts.aspect, opts.resolution)
    if (size) form.append('size', size)
    if (opts.imageFile) form.append('input_reference', opts.imageFile)

    const res = await fetch(`${this.root}/v1/videos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: form,
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    return { taskId: json.id, _soraVeo: true }
  }

  async _runwaySubmit(prompt, modelDef, opts) {
    const body = {
      model: modelDef.id,
      promptText: prompt,
      duration: opts.duration ?? 5,
      ratio: _aspectToRunwayRatio(opts.aspect),
    }
    if (opts.negativePrompt) body.negativeText = opts.negativePrompt
    if (opts.imageUrl) body.promptImage = opts.imageUrl

    const res = await fetch(`${this.root}/runwayml/v1/image_to_video`, {
      method: 'POST',
      headers: this._headers({ 'X-Runway-Version': '2024-11-06' }),
      body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    return { taskId: json.id, _runway: true }
  }

  async _minimaxSubmit(prompt, modelDef, opts) {
    const body = { model: modelDef.id, prompt }
    const res = await fetch(`${this.root}/v1/video_generation`, {
      method: 'POST', headers: this._headers(), body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    return { taskId: json.task_id, _minimax: true }
  }

  async _grokSubmit(prompt, modelDef, opts) {
    const body = {
      model: modelDef.id,
      prompt,
      aspect_ratio: opts.aspect ?? '16:9',
      duration: opts.duration ?? 5,
      resolution: opts.resolution ?? '720p',
    }
    if (opts.negativePrompt) body.negative_prompt = opts.negativePrompt
    if (opts.imageUrl) body.image = { url: opts.imageUrl }

    const res = await fetch(`${this.root}/grok/v1/videos/generations`, {
      method: 'POST', headers: this._headers(), body: JSON.stringify(body),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    return { taskId: json.request_id, _grok: true }
  }

  // ── Video Polling ─────────────────────────────────────────────────────
  // Returns { status: 'pending'|'processing'|'succeeded'|'failed', videoUrl?, error? }
  async pollVideo(job) {
    const { taskId, _klingAction, _soraVeo, _runway, _minimax, _grok, _provider } = job
    try {
      if (_klingAction) return this._pollKling(taskId, _klingAction)
      if (_soraVeo)     return this._pollSoraVeo(taskId)
      if (_runway)      return this._pollRunway(taskId)
      if (_minimax)     return this._pollMinimax(taskId, job._minimaxFileId)
      if (_grok)        return this._pollGrok(taskId)
    } catch (err) {
      return { status: 'failed', error: err.message }
    }
    return { status: 'failed', error: 'Unknown provider' }
  }

  async _pollKling(taskId, action) {
    const res = await fetch(`${this.root}/kling/v1/videos/${action}/${taskId}`, {
      headers: this._headers(),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    const s = json.data?.task_status
    const videoUrl = json.data?.task_result?.videos?.[0]?.url || null
    if (s === 'succeed') return { status: 'succeeded', videoUrl }
    if (s === 'failed')  return { status: 'failed', error: json.data?.task_status_msg || 'Failed' }
    return { status: 'processing' }
  }

  async _pollSoraVeo(videoId) {
    const res = await fetch(`${this.root}/v1/videos/${videoId}`, { headers: this._headers() })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    if (json.status === 'completed' && json.progress === 100) {
      // Retrieve video content URL
      const cr = await fetch(`${this.root}/v1/videos/${videoId}/content`, { headers: this._headers() })
      if (!cr.ok) return { status: 'succeeded', videoUrl: null }
      const blob = await cr.blob()
      const videoUrl = URL.createObjectURL(blob)
      return { status: 'succeeded', videoUrl }
    }
    if (json.status === 'failed') return { status: 'failed', error: 'Video generation failed' }
    return { status: 'processing', progress: json.progress }
  }

  async _pollRunway(taskId) {
    const res = await fetch(`${this.root}/runwayml/v1/tasks/${taskId}`, {
      headers: this._headers({ 'X-Runway-Version': '2024-11-06' }),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    if (json.status === 'SUCCEEDED') {
      const videoUrl = json.output?.[0] || null
      return { status: 'succeeded', videoUrl }
    }
    if (json.status === 'FAILED') return { status: 'failed', error: json.failure || 'Failed' }
    return { status: 'processing' }
  }

  async _pollMinimax(taskId, fileId) {
    if (!fileId) {
      // Step 1: query for file_id
      const res = await fetch(`${this.root}/v1/query/video_generation?task_id=${taskId}`, {
        headers: this._headers(),
      })
      if (!res.ok) await this._handleError(res)
      const json = await res.json()
      if (json.status === 'Fail') return { status: 'failed', error: 'Generation failed' }
      if (!json.file_id) return { status: 'processing' }
      fileId = json.file_id
    }
    // Step 2: retrieve download URL
    const res = await fetch(`${this.root}/v1/files/retrieve?file_id=${fileId}&task_id=${taskId}`, {
      headers: this._headers(),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    const videoUrl = json.file?.download_url || null
    return { status: 'succeeded', videoUrl, _minimaxFileId: fileId }
  }

  async _pollGrok(requestId) {
    const res = await fetch(`${this.root}/grok/v1/videos/${requestId}`, {
      headers: this._headers(),
    })
    if (!res.ok) await this._handleError(res)
    const json = await res.json()
    const videoUrl = json.video_url || json.url || null
    if (videoUrl) return { status: 'succeeded', videoUrl }
    if (json.status === 'failed') return { status: 'failed', error: 'Generation failed' }
    return { status: 'processing' }
  }

  // ── Model list ─────────────────────────────────────────────────────────
  async listModels() {
    const res = await fetch(`${this.root}/v1/models`, { headers: this._headers() })
    if (!res.ok) await this._handleError(res)
    return res.json()
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function _aspectResToSize(aspect, resolution) {
  const map = {
    '16:9':  { '720p': '1280x720',  '1080p': '1920x1080', default: '1280x720' },
    '9:16':  { '720p': '720x1280',  '1080p': '1080x1920', default: '720x1280' },
    '1:1':   { '720p': '1024x1024', '1080p': '1024x1024', default: '1024x1024' },
    '4:3':   { '720p': '1024x768',  '1080p': '1440x1080', default: '1024x768' },
    '3:4':   { '720p': '768x1024',  '1080p': '1080x1440', default: '768x1024' },
  }
  return map[aspect]?.[resolution] || map[aspect]?.default || '1280x720'
}

function _aspectToRunwayRatio(aspect) {
  const map = {
    '16:9': '1280:720',
    '9:16': '720:1280',
    '4:3':  '1104:832',
    '3:4':  '832:1104',
    '1:1':  '960:960',
  }
  return map[aspect] || '1280:720'
}

async function _fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      resolve(result.split(',')[1] || '')
    }
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

async function _fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

function _extractModelList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.models)) return payload.models
  return []
}

function _getModelId(entry) {
  return entry?.id || entry?.model || entry?.name || ''
}

function _supportsResponsesApi(entry, modelId = '') {
  const id = String(modelId || _getModelId(entry)).toLowerCase()
  const descriptors = [
    entry?.supported_endpoints,
    entry?.endpoints,
    entry?.capabilities,
    entry?.features,
    entry?.modalities,
    entry?.tags,
    entry?.type,
    entry?.category,
  ]
    .flat()
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())

  if (descriptors.some((value) => value.includes('/v1/responses') || value.includes('responses'))) {
    return true
  }

  // Safe fallback heuristics for current text families that commonly support responses.
  return /^(gpt-5|gpt-4\.1|gpt-4o|o1|o3|o4)/i.test(id)
}

function _isLikelyVideoModel(entry) {
  const id = _getModelId(entry)
  if (!id) return false

  const descriptors = [
    entry?.type,
    entry?.category,
    entry?.modality,
    entry?.modalities,
    entry?.capabilities,
    entry?.supported_endpoints,
    entry?.endpoints,
    entry?.tags,
  ]
    .flat()
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())

  if (descriptors.some((value) => value.includes('video'))) return true
  if (VIDEO_MODELS.some((model) => model.id === id)) return true
  return /(seedance|kling|sora|veo|runway|minimax|hailuo|grok.*video|video-)/i.test(id)
}

function _isLikelyChatModel(entry) {
  const id = _getModelId(entry)
  if (!id) return false
  if (NON_CHAT_MODEL_PATTERN.test(id)) return false

  const descriptors = [
    entry?.type,
    entry?.category,
    entry?.modality,
    entry?.modalities,
    entry?.capabilities,
    entry?.supported_endpoints,
    entry?.endpoints,
    entry?.tags,
  ]
    .flat()
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())

  const hasChatSignal = descriptors.some((value) =>
    value.includes('chat') || value.includes('text') || value.includes('completion')
  )

  if (hasChatSignal) return true

  // If the API does not provide explicit capabilities, only keep curated-known chat ids
  // or plain family ids that are not obviously specialized variants.
  if (CHAT_MODELS.some((model) => model.id === id)) return true
  if (!CHAT_MODEL_PREFIX.test(id)) return false

  return /^(gpt-[45]|claude-|gemini-|grok-|deepseek-|llama-|mistral-|qwen|minimax-)/i.test(id)
}

function _messagesToResponsesInput(messages) {
  const systemMessages = messages.filter((message) => message.role === 'system')
  const input = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))

  return {
    instructions: systemMessages.map((message) => message.content).join('\n\n').trim() || undefined,
    input,
  }
}

function _extractResponsesDelta(json) {
  if (!json || typeof json !== 'object') return ''

  switch (json.type) {
    case 'response.output_text.delta':
    case 'response.text.delta':
    case 'response.refusal.delta':
    case 'response.reasoning_text.delta':
    case 'response.reasoning_summary_text.delta':
      return json.delta || ''
    default:
      return ''
  }
}

function _shouldFallbackToChatCompletions(error) {
  const message = String(error?.message || '').toLowerCase()
  return message.includes('404') ||
    message.includes('not found') ||
    message.includes('unsupported') ||
    message.includes('invalid endpoint') ||
    message.includes('does not support')
}

function _inferProvider(entry, id) {
  const lowerId = String(id).toLowerCase()
  const inferred = _inferProviderFromId(lowerId)
  const provider = entry?.provider || entry?.owned_by || entry?.owner || entry?.vendor
  if (provider && !GENERIC_PROVIDER_PATTERN.test(String(provider).trim())) {
    return _titleCase(String(provider))
  }

  if (inferred) return inferred
  return 'Other'
}

function _inferProviderFromId(lowerId) {
  if (lowerId.startsWith('gpt')) return 'OpenAI'
  if (lowerId.startsWith('claude')) return 'Anthropic'
  if (lowerId.startsWith('gemini')) return 'Google'
  if (lowerId.startsWith('grok')) return 'xAI'
  if (lowerId.startsWith('seedance') || lowerId.startsWith('doubao')) return 'ByteDance'
  if (lowerId.startsWith('deepseek')) return 'DeepSeek'
  if (lowerId.startsWith('llama')) return 'Meta'
  if (lowerId.startsWith('mistral')) return 'Mistral'
  if (lowerId.startsWith('qwen')) return 'Alibaba'
  if (lowerId.startsWith('minimax')) return 'MiniMax'
  return ''
}

function _getVideoDefaults(id) {
  const curated = VIDEO_MODELS.find((model) => model.id === id)
  if (curated) return curated

  const lowerId = String(id).toLowerCase()
  if (lowerId.startsWith('seedance')) {
    return {
      _provider: 'bytedance',
      modelName: id,
      durations: [5, 10],
      resolutions: ['720p', '1080p'],
      aspects: ['16:9', '9:16', '1:1'],
      fps: [24],
    }
  }

  return {
    _provider: 'sora',
    modelName: id,
    durations: [5],
    resolutions: ['720p'],
    aspects: ['16:9'],
    fps: [24],
  }
}

function _humanizeModelId(id) {
  return String(id)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function _titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function _dedupeById(models) {
  const seen = new Set()
  return models.filter((model) => {
    if (seen.has(model.id)) return false
    seen.add(model.id)
    return true
  })
}
