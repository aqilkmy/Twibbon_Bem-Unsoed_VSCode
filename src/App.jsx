import { useState, useEffect, useRef, useCallback } from 'react'
import { fabric } from 'fabric'
import {
  Upload,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  RefreshCw,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  MessageSquareText
} from 'lucide-react'

// Canvas dimensions (vertical format)
const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1350

// Twibbon image URL
const TWIBBON_URL = '/twibbons/twibbon-oprec.png'

// Caption for social media
const CAPTION_TEXT = `[OPEN RECRUITMENT STAF BEM UNSOED 2026]

Halo, Generasi Soedirman!

Saya (nama lengkap) dari (fakultas) siap bergabung bersama BEM Unsoed (alasan ingin masuk BEM Unsoed)

Mari bersama-sama berkolaborasi, menjadi satu kesatuan untuk membawa perubahan yang nyata🌟

(mention @bem_unsoed dan 3 teman kamu)

#BEMUnsoed2026
#KolaborAksi
#MerajutKolaborasiWujudkanAksi
#JoinBEMUnsoed2026`

function App() {
  // State management
  const [userPhoto, setUserPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copiedCaption, setCopiedCaption] = useState(false)
  
  // Image control states
  const [scale, setScale] = useState(100)
  const [rotation, setRotation] = useState(0)
  
  // Refs
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const userImageRef = useRef(null)
  const twibbonImageRef = useRef(null)
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)
  
  // Responsive canvas size
  const [canvasDisplaySize, setCanvasDisplaySize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT })

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32
        const maxWidth = Math.min(containerWidth, 400)
        const aspectRatio = CANVAS_HEIGHT / CANVAS_WIDTH
        const displayWidth = Math.max(280, maxWidth)
        const displayHeight = displayWidth * aspectRatio
        
        setCanvasDisplaySize({ width: displayWidth, height: displayHeight })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#1a1a2e',
      selection: false,
      preserveObjectStacking: true,
    })

    fabricCanvasRef.current = canvas

    // Cleanup
    return () => {
      canvas.dispose()
      fabricCanvasRef.current = null
    }
  }, [])

  // Update canvas display size
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const scaleX = canvasDisplaySize.width / CANVAS_WIDTH
    const scaleY = canvasDisplaySize.height / CANVAS_HEIGHT
    const zoomScale = Math.min(scaleX, scaleY)
    
    canvas.setZoom(zoomScale)
    canvas.setDimensions({
      width: canvasDisplaySize.width,
      height: canvasDisplaySize.height,
    })
  }, [canvasDisplaySize])

  // Load twibbon overlay
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Remove existing twibbon
    if (twibbonImageRef.current) {
      canvas.remove(twibbonImageRef.current)
      twibbonImageRef.current = null
    }

    // Load twibbon as overlay
    fabric.Image.fromURL(
      TWIBBON_URL,
      (img) => {
        if (!img) return

        // Scale to fit canvas
        const scaleX = CANVAS_WIDTH / img.width
        const scaleY = CANVAS_HEIGHT / img.height
        const scaleFactor = Math.max(scaleX, scaleY)
        
        img.scale(scaleFactor)

        img.set({
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          hoverCursor: 'default',
        })

        twibbonImageRef.current = img
        canvas.add(img)
        canvas.bringToFront(img)
        canvas.renderAll()
      },
      { crossOrigin: 'anonymous' }
    )
  }, [])

  // Handle user photo upload
  const handlePhotoUpload = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setUserPhoto(e.target.result)
      setScale(100)
      setRotation(0)
    }
    reader.readAsDataURL(file)
  }, [])

  // Add/update user photo on canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas || !userPhoto) return

    // Remove existing user image
    if (userImageRef.current) {
      canvas.remove(userImageRef.current)
      userImageRef.current = null
    }

    fabric.Image.fromURL(userPhoto, (img) => {
      if (!img) return

      // Calculate initial scale to cover canvas
      const coverScaleX = CANVAS_WIDTH / img.width
      const coverScaleY = CANVAS_HEIGHT / img.height
      const coverScale = Math.max(coverScaleX, coverScaleY)

      img.set({
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        scaleX: coverScale,
        scaleY: coverScale,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockUniScaling: true,
        cornerColor: '#D79146',
        cornerStyle: 'circle',
        cornerSize: 20,
        transparentCorners: false,
        borderColor: '#EEC69B',
        borderScaleFactor: 2,
      })

      userImageRef.current = img
      canvas.add(img)
      canvas.sendToBack(img)
      canvas.setActiveObject(img)

      // Bring twibbon to front
      if (twibbonImageRef.current) {
        canvas.bringToFront(twibbonImageRef.current)
      }

      canvas.renderAll()
    })
  }, [userPhoto])

  // Update user image scale
  useEffect(() => {
    const img = userImageRef.current
    const canvas = fabricCanvasRef.current
    if (!img || !canvas) return

    const coverScaleX = CANVAS_WIDTH / img.width
    const coverScaleY = CANVAS_HEIGHT / img.height
    const baseScale = Math.max(coverScaleX, coverScaleY)
    const newScale = baseScale * (scale / 100)

    img.set({
      scaleX: newScale,
      scaleY: newScale,
    })

    canvas.renderAll()
  }, [scale])

  // Update user image rotation
  useEffect(() => {
    const img = userImageRef.current
    const canvas = fabricCanvasRef.current
    if (!img || !canvas) return

    img.set({ angle: rotation })
    canvas.renderAll()
  }, [rotation])

  // Reset transformations
  const handleReset = useCallback(() => {
    setScale(100)
    setRotation(0)

    const img = userImageRef.current
    const canvas = fabricCanvasRef.current
    if (!img || !canvas) return

    img.set({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
    })
    canvas.renderAll()
  }, [])

  // Download merged image
  const handleDownload = useCallback(async () => {
    const canvas = fabricCanvasRef.current
    if (!canvas || !userPhoto) return

    setIsProcessing(true)

    try {
      // Temporarily deselect to remove selection borders
      canvas.discardActiveObject()
      canvas.renderAll()

      // Get data URL from fabric canvas at full resolution
      const currentZoom = canvas.getZoom()
      canvas.setZoom(1)
      canvas.setDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT })

      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      })

      // Restore zoom
      const scaleX = canvasDisplaySize.width / CANVAS_WIDTH
      const scaleY = canvasDisplaySize.height / CANVAS_HEIGHT
      const zoomScale = Math.min(scaleX, scaleY)
      
      canvas.setZoom(zoomScale)
      canvas.setDimensions({
        width: canvasDisplaySize.width,
        height: canvasDisplaySize.height,
      })

      // Create download link
      const link = document.createElement('a')
      link.download = 'twibbon-result.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error('Error downloading image:', err)
      setError('Failed to download image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [userPhoto, canvasDisplaySize])

  // Copy caption to clipboard
  const handleCopyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CAPTION_TEXT)
      setCopiedCaption(true)
      setTimeout(() => setCopiedCaption(false), 2000)
    } catch (err) {
      console.error('Failed to copy caption:', err)
      setError('Gagal menyalin caption. Silakan copy manual.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Twibbon BEM Unsoed 2026</h1>
              <p className="text-xs text-gray-300 hidden sm:block">Open Recruitment BEM Unsoed 2026</p>
            </div>
          </div>
          <div className="text-highlight-light text-sm font-medium">
            #BEMUnsoed2026
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Success Alert */}
        {showSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-green-200 text-sm">
              Twibbon berhasil di-download! 🎉
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr,420px] gap-6">
          {/* Canvas Section */}
          <div className="space-y-4">
            {/* Canvas Container */}
            <div
              ref={containerRef}
              className="card flex flex-col items-center p-4 sm:p-6"
            >
              <div
                className="canvas-container relative"
                style={{
                  width: canvasDisplaySize.width,
                  height: canvasDisplaySize.height,
                }}
              >
                <canvas ref={canvasRef} />
                
                {!userPhoto && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
                    <p className="text-gray-400 text-center px-4">
                      Upload foto untuk memulai
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="card space-y-4">
              {/* Upload Button */}
              <div className="flex flex-wrap gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center"
                >
                  <Upload className="w-5 h-5" />
                  <span>{userPhoto ? 'Ganti Foto' : 'Upload Foto'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!userPhoto || isProcessing}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center bg-gradient-highlight text-primary-dark disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>Download</span>
                </button>
              </div>

              {/* Sliders */}
              {userPhoto && (
                <div className="space-y-4 animate-fade-in">
                  {/* Scale Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white text-sm font-medium flex items-center gap-2">
                        <ZoomIn className="w-4 h-4 text-highlight-light" />
                        Zoom
                      </label>
                      <span className="text-highlight-light text-sm font-mono">
                        {scale}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setScale((s) => Math.max(50, s - 10))}
                        className="btn-secondary p-2"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="slider-custom flex-1"
                      />
                      <button
                        onClick={() => setScale((s) => Math.min(200, s + 10))}
                        className="btn-secondary p-2"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rotation Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white text-sm font-medium flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-highlight-light" />
                        Rotasi
                      </label>
                      <span className="text-highlight-light text-sm font-mono">
                        {rotation}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="slider-custom"
                    />
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Posisi
                  </button>

                  {/* Tips */}
                  <div className="bg-primary-dark/50 rounded-lg p-3">
                    <p className="text-gray-300 text-xs flex items-start gap-2">
                      <Move className="w-4 h-4 flex-shrink-0 mt-0.5 text-highlight-light" />
                      <span>
                        <strong className="text-white">Tips:</strong> Drag foto
                        untuk mengatur posisi. Gunakan slider untuk zoom dan
                        rotasi.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption Section */}
          <div className="card h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-highlight-light" />
                Caption
              </h2>
              <button
                onClick={handleCopyCaption}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  copiedCaption 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-gradient-secondary text-white hover:shadow-glow-red'
                }`}
              >
                {copiedCaption ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Salin
                  </>
                )}
              </button>
            </div>

            <div className="bg-primary-dark/50 rounded-xl p-4 max-h-[50vh] overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {CAPTION_TEXT}
              </pre>
            </div>

            <p className="text-gray-400 text-xs mt-3 flex items-center gap-2">
              <img src="/logo.png" alt="" className="w-3 h-3 object-contain" />
              Klik tombol "Salin" untuk copy caption ke clipboard
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
            Cara Penggunaan
          </h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Klik "Upload Foto" untuk memilih foto dari perangkat kamu</li>
            <li>Atur posisi foto dengan drag, dan gunakan slider untuk zoom/rotasi</li>
            <li>Klik "Download" untuk menyimpan hasil twibbon-mu</li>
            <li>Salin caption dengan klik tombol "Salin" di bagian Caption</li>
            <li>Unggah Twibbon kamu di Instagram</li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-8 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            ©Kementrian Koordinasi Riset Media 2026 BEM Unsoed.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Open Recruitment BEM Unsoed 2026 - "Merajut Kolaborasi, Wujudkan Aksi!"
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
