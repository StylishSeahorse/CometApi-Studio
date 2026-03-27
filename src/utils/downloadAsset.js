export async function downloadAsset(url, filename) {
  if (!url) {
    throw new Error('No download URL available')
  }

  if (url.startsWith('data:') || url.startsWith('blob:')) {
    triggerDownload(url, filename)
    return
  }

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    triggerDownload(blobUrl, filename)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
    return
  } catch {
    // Cross-origin sources may reject fetch. Fall back to opening the direct URL.
    triggerDownload(url, filename, true)
  }
}

function triggerDownload(url, filename, newTab = false) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  if (newTab) {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  }
  document.body.appendChild(link)
  link.click()
  link.remove()
}