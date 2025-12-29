import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

type TabInfo = {
  id: number
  title?: string
  url?: string
  favIconUrl?: string
}

function PopupApp() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.tabs.query({}, (tabsResult) => {
      const mapped = (tabsResult || []).map((t) => ({
        id: t.id as number,
        title: t.title,
        url: t.url,
        favIconUrl: t.favIconUrl
      }))

      setTabs(mapped)

      const initSel: Record<number, boolean> = {}
      mapped.forEach((t) => (initSel[t.id] = false))
      setSelected(initSel)

      setLoading(false)
    })
  }, [])  // <-- THIS LINE WAS BROKEN EARLIER

  const toggle = (tabId: number) => {
    setSelected((prev) => ({ ...prev, [tabId]: !prev[tabId] }))
  }

  const closeSelected = () => {
    const ids = Object.entries(selected)
      .filter(([_, v]) => v)
      .map(([k]) => Number(k))

    if (ids.length === 0) return

    chrome.tabs.remove(ids, () => {
      setTabs((prev) => prev.filter((t) => !ids.includes(t.id)))

      const newSel: Record<number, boolean> = {}
      tabs.forEach((t) => (newSel[t.id] = false))
      setSelected(newSel)
    })
  }

  return (
    <div style={{ fontFamily: 'Arial', width: 320, padding: 12 }}>
      <h3 style={{ marginBottom: '10px' }}>Open Tabs</h3>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {tabs.map((t) => (
            <label key={t.id} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={!!selected[t.id]}
                onChange={() => toggle(t.id)}
              />
              <span style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.title || t.url}
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={closeSelected}
        style={{
          marginTop: 10,
          width: '100%',
          padding: 8,
          background: '#ff4d4d',
          border: 'none',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Close Selected Tabs
      </button>
    </div>
  )
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(<PopupApp />)
