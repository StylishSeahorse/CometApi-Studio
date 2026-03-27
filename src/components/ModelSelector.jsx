import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

/**
 * @param {string} value         - current model id
 * @param {Function} onChange    - (id) => void
 * @param {Array} models         - [{id, label, provider}]
 * @param {string} className
 */
export default function ModelSelector({ value, onChange, models, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = models.find((m) => m.id === value) || models[0]

  // Group by provider
  const groups = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = []
    acc[m.provider].push(m)
    return acc
  }, {})

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/50
                   rounded-lg px-3 py-2 text-sm text-white transition-all duration-150 w-full min-w-[200px]"
      >
        <span className="flex-1 text-left truncate">
          <span className="text-gray-400 text-xs mr-1">{selected?.provider}</span>
          {selected?.label || 'Select model'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 w-72 glass rounded-xl shadow-2xl shadow-black/50 overflow-y-auto animate-fade-in max-h-80">
          {Object.entries(groups).map(([provider, items]) => (
            <div key={provider}>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-black/20 sticky top-0">
                {provider}
              </div>
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onChange(m.id); setOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors
                    ${m.id === value
                      ? 'bg-indigo-600/30 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="flex-1">{m.label}</span>
                  {m.id === value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
