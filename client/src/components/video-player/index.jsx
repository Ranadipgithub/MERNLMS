import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function VideoPlayer({ width = "100%", height = "100%", url }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [buffered, setBuffered] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }, [isPlaying])

  // Seek
  const handleProgressChange = useCallback(
    (value) => {
      const video = videoRef.current
      if (!video) return
      const newTime = (value[0] / 100) * duration
      video.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration]
  )

  // Volume change
  const handleVolumeChange = useCallback((value) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    const video = videoRef.current
    if (video) {
      video.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (isMuted) {
      const restored = volume || 0.5
      video.volume = restored
      setIsMuted(false)
      setVolume(restored)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }, [isMuted, volume])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  // Skip
  const skipTime = useCallback((seconds) => {
    const video = videoRef.current
    if (!video) return
    let newTime = video.currentTime + seconds
    if (newTime < 0) newTime = 0
    if (video.duration && newTime > video.duration) newTime = video.duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }, [])

  // Speed change
  const handleSpeedChange = useCallback((speed) => {
    const video = videoRef.current
    if (video) video.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }, [])

  // Show/hide controls
  const clearControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
  }

  const hideControls = () => {
    setShowControls(false)
  }

  const scheduleHideControls = () => {
    clearControlsTimeout()
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  const showAndScheduleHide = () => {
    setShowControls(true)
    scheduleHideControls()
  }

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onLoaded = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onPlay = () => {
      setIsPlaying(true)
      scheduleHideControls()
    }
    const onPause = () => {
      setIsPlaying(false)
      setShowControls(true)
      clearControlsTimeout()
    }
    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        const end = video.buffered.end(video.buffered.length - 1)
        setBuffered((end / video.duration) * 100)
      }
    }
    const onWaiting = () => setIsLoading(true)
    const onCanPlay = () => setIsLoading(false)

    video.addEventListener("loadedmetadata", onLoaded)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("progress", onProgress)
    video.addEventListener("waiting", onWaiting)
    video.addEventListener("canplay", onCanPlay)

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("progress", onProgress)
      video.removeEventListener("waiting", onWaiting)
      video.removeEventListener("canplay", onCanPlay)
    }
  }, [])

  // Fullscreen change
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (!containerRef.current?.contains(document.activeElement)) return
      switch (e.code) {
        case "Space":
          e.preventDefault(); togglePlay(); break
        case "ArrowLeft":
          e.preventDefault(); skipTime(-10); showAndScheduleHide(); break
        case "ArrowRight":
          e.preventDefault(); skipTime(10); showAndScheduleHide(); break
        case "ArrowUp":
          e.preventDefault(); handleVolumeChange([Math.min(100, (volume + 0.1) * 100)]); break
        case "ArrowDown":
          e.preventDefault(); handleVolumeChange([Math.max(0, (volume - 0.1) * 100)]); break
        case "KeyM":
          e.preventDefault(); toggleMute(); break
        case "KeyF":
          e.preventDefault(); toggleFullscreen(); break
        default: break
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [togglePlay, skipTime, handleVolumeChange, toggleMute, toggleFullscreen, volume])

  // Click outside speed menu
  useEffect(() => {
    const onClick = (e) => {
      if (showSpeedMenu) {
        if (!e.target.closest(".speed-menu-wrapper")) {
          setShowSpeedMenu(false)
        }
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [showSpeedMenu])

  // Mouse movement to detect leave container
  useEffect(() => {
    const onMouseMove = (e) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const { clientX: x, clientY: y } = e
      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      if (inside) {
        showAndScheduleHide()
      } else {
        hideControls()
      }
    }
    document.addEventListener("mousemove", onMouseMove)
    return () => document.removeEventListener("mousemove", onMouseMove)
  }, [])

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden shadow-2xl max-w-full"
      style={{ width, height: isFullscreen ? "100vh" : height }}
      tabIndex={0}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Play overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Button
            size="icon"
            variant="ghost"
            className="w-16 h-16 rounded-full bg-black/60 text-white backdrop-blur-sm pointer-events-auto"
            onClick={togglePlay}
          >
            <Play className="w-7 h-7" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress */}
        <div className="w-full mb-2">
          <div className="relative h-1 bg-white/20 rounded-full overflow-hidden hover:h-2 transition-all duration-200">
            <div
              className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={(e) => handleProgressChange([parseFloat(e.target.value)])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            {/* Play/Pause */}
            <Button size="icon" variant="ghost" className="w-9 h-9" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </Button>
            {/* Skip (hidden on small) */}
            <Button size="icon" variant="ghost" className="w-9 h-9 hidden md:inline-flex" onClick={() => skipTime(-10)}>
              <SkipBack className="w-4 h-4 text-white" />
            </Button>
            <Button size="icon" variant="ghost" className="w-9 h-9 hidden md:inline-flex" onClick={() => skipTime(10)}>
              <SkipForward className="w-4 h-4 text-white" />
            </Button>
            {/* Volume */}
            <div className="relative flex items-center">
              <Button size="icon" variant="ghost" className="w-9 h-9" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </Button>
              <div className="absolute bottom-10 left-0 w-0 group-hover:w-20 transition-all duration-200 overflow-hidden">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-2 [&_[role=slider]]:h-2 [&_[role=slider]]:border-0"
                />
              </div>
            </div>
            {/* Time */}
            <div className="text-xs font-mono ml-1 hidden sm:inline-block text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Speed */}
            <div className="relative speed-menu-wrapper">
              <Button size="icon" variant="ghost" className="w-9 h-9 text-xs" onClick={() => setShowSpeedMenu((s) => !s)}>
                {playbackSpeed}x
              </Button>
              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-1 min-w-[60px] border border-white/20 z-10">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-white/20 transition-colors ${
                        playbackSpeed === speed ? "text-red-400 bg-white/10" : "text-white"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Fullscreen */}
            <Button size="icon" variant="ghost" className="w-9 h-9" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-white" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
