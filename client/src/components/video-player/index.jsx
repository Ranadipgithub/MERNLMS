"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react"

function VideoPlayer({ width = "100%", height = "100%", url, onProgressUpdate, progressData }) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isHoveringProgress, setIsHoveringProgress] = useState(false)

  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  function handlePlayAndPause() {
    setPlaying(!playing)
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  function handleRewind() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5)
  }

  function handleForward() {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5)
  }

  function handleToggleMute() {
    setMuted(!muted)
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue[0])
    setSeeking(true)
  }

  function handleSeekMouseUp() {
    setSeeking(false)
    playerRef.current?.seekTo(played)
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0])
  }

  function pad(string) {
    return ("0" + string).slice(-2)
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`
    }

    return `${mm}:${ss}`
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }, [isFullScreen])

  function handleMouseMove() {
    setShowControls(true)
    clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      })
    }
  }, [played])

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out group
      ${isFullScreen ? "w-screen h-screen rounded-none" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />

      {/* Gradient overlay for better control visibility */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Controls Container */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-3 pb-2 transition-all duration-300 transform ${
          showControls ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {/* Progress Bar Container */}
        <div
          className="mb-2 px-1"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className={`w-full transition-all duration-200 [&>span:first-child]:bg-white/30 [&>span:first-child]:h-1 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&>span:first-child_span]:bg-red-600 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-110 ${
              isHoveringProgress
                ? "[&>span:first-child]:h-1.5 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4"
                : "[&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
            }`}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayAndPause}
              className="text-white bg-transparent hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-200"
            >
              {playing ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-white ml-0.5" />}
            </Button>

            <Button
              onClick={handleRewind}
              className="text-white bg-transparent hover:bg-white/20 h-9 w-9 rounded-full transition-all duration-200"
              variant="ghost"
              size="icon"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              onClick={handleForward}
              className="text-white bg-transparent hover:bg-white/20 h-9 w-9 rounded-full transition-all duration-200"
              variant="ghost"
              size="icon"
            >
              <RotateCw className="h-5 w-5" />
            </Button>

            {/* Volume Controls */}
            <div className="flex items-center space-x-2 ml-2">
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:bg-white/20 h-9 w-9 rounded-full transition-all duration-200"
                variant="ghost"
                size="icon"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <div className="group/volume relative">
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                  className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden [&>span:first-child]:bg-white/30 [&>span:first-child]:h-1 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Time Display */}
            <div className="text-white text-sm font-medium tracking-wide">
              <span className="tabular-nums">{formatTime(played * (playerRef?.current?.getDuration() || 0))}</span>
              <span className="text-white/70 mx-1">/</span>
              <span className="text-white/90 tabular-nums">{formatTime(playerRef?.current?.getDuration() || 0)}</span>
            </div>

            {/* Fullscreen Button */}
            <Button
              className="text-white bg-transparent hover:bg-white/20 h-9 w-9 rounded-full transition-all duration-200"
              variant="ghost"
              size="icon"
              onClick={handleFullScreen}
            >
              {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
