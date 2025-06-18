"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function VideoPlayer({ width = "100%", height = 400, url }) {
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
  const [isHovering, setIsHovering] = useState(false)
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

  // Handle progress change (from slider/input range)
  const handleProgressChange = (value) => {
    const video = videoRef.current
    if (!video) return
    // value is expected as [percent], e.g. [50]
    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    const video = videoRef.current
    if (video) {
      video.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Skip forward/backward
  const skipTime = (seconds) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration || Infinity)
  }

  // Handle speed change
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
    setShowSpeedMenu(false)
  }

  // Hide controls after timeout
  const hideControlsAfterTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isHovering) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Show controls and reset timeout
  const showControlsTemporarily = () => {
    setShowControls(true)
    hideControlsAfterTimeout()
  }

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }
    const handlePlay = () => {
      setIsPlaying(true)
      hideControlsAfterTimeout()
    }
    const handlePause = () => {
      setIsPlaying(false)
      setShowControls(true)
    }
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferedPercent = (bufferedEnd / video.duration) * 100
        setBuffered(bufferedPercent)
      }
    }
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("progress", handleProgress)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("progress", handleProgress)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [duration, hideControlsAfterTimeout, isHovering, isPlaying])

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only respond when the container (or a child) has focus
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          e.preventDefault()
          skipTime(-10)
          break
        case "ArrowRight":
          e.preventDefault()
          skipTime(10)
          break
        case "ArrowUp":
          e.preventDefault()
          handleVolumeChange([Math.min(100, (volume + 0.1) * 100)])
          break
        case "ArrowDown":
          e.preventDefault()
          handleVolumeChange([Math.max(0, (volume - 0.1) * 100)])
          break
        case "KeyM":
          e.preventDefault()
          toggleMute()
          break
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [togglePlay, volume])

  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSpeedMenu) {
        // Check if click is outside the speed menu and button
        // containerRef may wrap entire player; we want to ensure
        // clicks outside the specific speed-menu area close it.
        // Here, we look for an element with a known wrapper; since
        // we used a relative wrapper for the speed button/menu, we can
        // detect if click target is outside that. We assume the menu's
        // container is inside the main container; to be safer, you could
        // refine selectors or use a dedicated ref for the menu wrapper.
        if (!event.target.closest(".speed-menu-wrapper")) {
          setShowSpeedMenu(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showSpeedMenu])

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden shadow-2xl group"
      style={{ width, height: isFullscreen ? "100vh" : height }}
      onMouseEnter={() => {
        setIsHovering(true)
        showControlsTemporarily()
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        if (isPlaying) {
          hideControlsAfterTimeout()
        }
      }}
      onMouseMove={showControlsTemporarily}
      tabIndex={0}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            onClick={togglePlay}
          >
            <Play className="w-7 h-7 fill-white ml-0.5" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden group/progress hover:h-2 transition-all duration-200">
            {/* Buffer Progress */}
            <div
              className="absolute top-0 left-0 h-full bg-white/40 transition-all duration-300 rounded-full"
              style={{ width: `${buffered}%` }}
            />

            {/* Played Progress */}
            <div
              className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-150 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />

            {/* Interactive Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={(e) => handleProgressChange([parseFloat(e.target.value)])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {/* Progress Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-all duration-200 pointer-events-none shadow-lg border-2 border-white"
              style={{
                left: `${progressPercentage}%`,
                transform: "translateX(-50%) translateY(-50%)",
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 hover:bg-white/20 text-white hover:text-white rounded-lg"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </Button>

            {/* Skip Backward */}
            <Button
              size="icon"
              variant="ghost"
              className="w-11 h-11 hover:bg-white/20 text-white hover:text-white rounded-lg"
              onClick={() => skipTime(-10)}
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            {/* Skip Forward */}
            <Button
              size="icon"
              variant="ghost"
              className="w-11 h-11 hover:bg-white/20 text-white hover:text-white rounded-lg"
              onClick={() => skipTime(10)}
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 hover:bg-white/20 text-white hover:text-white"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>

              <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-sm font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls: Speed & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Speed Control */}
            <div className="relative speed-menu-wrapper">
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 hover:bg-white/20 text-white hover:text-white text-xs font-medium"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              >
                {playbackSpeed}x
              </Button>

              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[80px] border border-white/20 z-10">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/20 transition-colors ${
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
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 hover:bg-white/20 text-white hover:text-white"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
