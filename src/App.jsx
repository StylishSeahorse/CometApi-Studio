import { useState } from "react"
import { Toaster } from "react-hot-toast"
import Sidebar from "./components/Sidebar"
import ChatView from "./components/ChatView"
import HistoryView from "./components/HistoryView"
import ImageView from "./components/ImageView"
import VideoView from "./components/VideoView"
import SettingsView from "./components/SettingsView"
import { AppProvider } from "./context/AppContext"

export default function App() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          {activeTab === "chat"     && <ChatView />}
          {activeTab === "history"  && <HistoryView />}
          {activeTab === "image"    && <ImageView />}
          {activeTab === "video"    && <VideoView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.1)" },
          success: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
        }}
      />
    </AppProvider>
  )
}
