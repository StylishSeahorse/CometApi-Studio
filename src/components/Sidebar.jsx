import { MessageSquare, Image, Video, Settings, Zap, ChevronRight, History } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'chat',     icon: MessageSquare, label: 'Chat',           desc: 'Text & reasoning' },
  { id: 'history',  icon: History,       label: 'History',        desc: 'Saved sessions' },
  { id: 'image',    icon: Image,         label: 'Image',          desc: 'Generate images' },
  { id: 'video',    icon: Video,         label: 'Video',          desc: 'Generate videos' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 flex flex-col glass-dark border-r border-white/10 flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-brand">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-none">CometAPI</h1>
            <p className="text-xs text-gray-500 mt-0.5">Studio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label, desc }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group
                ${active
                  ? 'bg-indigo-600/30 border border-indigo-500/40 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              <Icon size={18} className={active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-none">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{desc}</div>
              </div>
              {active && <ChevronRight size={14} className="text-indigo-400 flex-shrink-0" />}
            </button>
          )
        })}
      </nav>

      {/* Settings button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group
            ${activeTab === 'settings'
              ? 'bg-indigo-600/30 border border-indigo-500/40 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
        >
          <Settings size={18} className={activeTab === 'settings' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  )
}
