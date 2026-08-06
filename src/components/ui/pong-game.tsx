"use client"

import { useEffect, useRef, useState } from "react"
import { Press_Start_2P } from "next/font/google"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] })

// Let's use the forest theme colors instead of purely black and white
const COLOR = "rgba(232, 229, 218, 0.2)" // muted for untouched pixels
const HIT_COLOR = "#8FAF8F" // accent color for hit pixels
const BACKGROUND_COLOR = "#101612" // bg color
const BALL_COLOR = "#E8E5DA"
const PADDLE_COLOR = "#8FAF8F"
const HEART_COLOR = "#8FAF8F"
const LETTER_SPACING = 1

const LIVES_START = 3
const LIFE_LOST_PAUSE_MS = 700

const PIXEL_MAP = {
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
}

// Small 8-bit heart bitmap, drawn with the same per-pixel fillRect technique as the letters.
const HEART_PIXEL_MAP = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
]
const HEART_CELL = 3
const HEART_GAP = 6
const HUD_MARGIN = 12

type GameState = "idle" | "playing" | "life-lost" | "gameover" | "win"

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddleRef = useRef<Paddle>({ x: 0, y: 0, width: 0, height: 0 })
  const scaleRef = useRef(1)
  const dimsRef = useRef({ width: 0, height: 0 })
  const baseSpeedRef = useRef(1)
  const paddleStepRef = useRef(20)
  const livesRef = useRef(LIVES_START)
  const gameStateRef = useRef<GameState>("idle")
  const lifeLostTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startGameRef = useRef<() => void>(() => {})
  const playAgainRef = useRef<() => void>(() => {})
  const redrawRef = useRef<() => void>(() => {})

  const [gameState, setGameState] = useState<GameState>("idle")
  const reducedMotion = useReducedMotion()

  // Keep gameState (for the DOM overlay) and gameStateRef (for the rAF loop) in lockstep.
  const setGameStateBoth = (next: GameState) => {
    gameStateRef.current = next
    redrawRef.current()
    setGameState(next)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dimsRef.current = { width, height }
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scaleRef.current = Math.min(width / 1000, height / 1000)
      initializeGame()
      redrawRef.current()
    }

    const initializeGame = () => {
      const { width, height } = dimsRef.current
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 12 * scale
      const BALL_SPEED = 6 * scale

      pixelsRef.current = []
      const words = ["ILYASRHMN"]

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((w, letter) => {
            const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
            return w + letterWidth * pixelSize + LETTER_SPACING * pixelSize
          }, 0) -
          LETTER_SPACING * pixelSize
        )
      }

      const totalWidth = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
      const scaleFactor = (width * 0.9) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const largeTextHeight = 5 * adjustedLargePixelSize

      const startY = (height - largeTextHeight) / 2

      words.forEach((word) => {
        const pixelSize = adjustedLargePixelSize
        const totalWordWidth = calculateWordWidth(word, adjustedLargePixelSize)

        let startX = (width - totalWordWidth) / 2

        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
          if (!pixelMap) return

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize
                const y = startY + i * pixelSize
                pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
              }
            }
          }
          startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
        })
      })

      baseSpeedRef.current = BALL_SPEED
      paddleStepRef.current = adjustedLargePixelSize * 2

      // Ball spawns near the top-right corner heading down-left, same as the original decoration.
      ballRef.current = {
        x: width * 0.9,
        y: height * 0.1,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLargePixelSize / 2,
      }

      const paddleThickness = adjustedLargePixelSize
      const paddleLength = 10 * adjustedLargePixelSize
      const INSET = 16

      paddleRef.current = {
        x: width / 2 - paddleLength / 2,
        y: height - paddleThickness - INSET,
        width: paddleLength,
        height: paddleThickness,
      }
    }

    const respawnBall = () => {
      const { width, height } = dimsRef.current
      const speed = baseSpeedRef.current
      ballRef.current = {
        x: width / 2,
        y: height * 0.15,
        dx: Math.random() < 0.5 ? -speed : speed,
        dy: speed,
        radius: ballRef.current.radius,
      }
    }

    const loseLife = () => {
      livesRef.current -= 1
      if (livesRef.current <= 0) {
        setGameStateBoth("gameover")
        return
      }
      respawnBall()
      setGameStateBoth("life-lost")
      if (lifeLostTimeoutRef.current) clearTimeout(lifeLostTimeoutRef.current)
      lifeLostTimeoutRef.current = setTimeout(() => {
        setGameStateBoth("playing")
      }, LIFE_LOST_PAUSE_MS)
    }

    const updateGame = () => {
      const ball = ballRef.current
      const paddle = paddleRef.current
      const dims = dimsRef.current

      ball.x += ball.dx
      ball.y += ball.dy

      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
        ball.dy = -ball.dy
      }
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius
        ball.dx = -ball.dx
      } else if (ball.x + ball.radius > dims.width) {
        ball.x = dims.width - ball.radius
        ball.dx = -ball.dx
      }

      if (
        ball.dy > 0 &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x + ball.radius > paddle.x &&
        ball.x - ball.radius < paddle.x + paddle.width
      ) {
        ball.y = paddle.y - ball.radius
        ball.dy = -ball.dy
        // Where the ball lands on the paddle (relative to its center) nudges the outgoing angle.
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)
        const maxDx = baseSpeedRef.current * 1.6
        ball.dx = clamp(ball.dx + hitPos * baseSpeedRef.current * 0.5, -maxDx, maxDx)
      } else if (ball.y - ball.radius > dims.height) {
        loseLife()
        return
      }

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          const centerX = pixel.x + pixel.size / 2
          const centerY = pixel.y + pixel.size / 2
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx
          } else {
            ball.dy = -ball.dy
          }
        }
      })

      if (pixelsRef.current.every((pixel) => pixel.hit)) {
        setGameStateBoth("win")
      }
    }

    const drawHud = () => {
      const heartWidth = HEART_PIXEL_MAP[0].length * HEART_CELL
      const heartHeight = HEART_PIXEL_MAP.length * HEART_CELL

      ctx.fillStyle = HEART_COLOR
      for (let i = 0; i < livesRef.current; i++) {
        const offsetX = HUD_MARGIN + i * (heartWidth + HEART_GAP)
        HEART_PIXEL_MAP.forEach((row, ry) => {
          row.forEach((cell, rx) => {
            if (cell) {
              ctx.fillRect(offsetX + rx * HEART_CELL, HUD_MARGIN + ry * HEART_CELL, HEART_CELL, HEART_CELL)
            }
          })
        })
      }

      const total = pixelsRef.current.length
      const hit = pixelsRef.current.filter((p) => p.hit).length
      const pct = total > 0 ? Math.round((hit / total) * 100) : 0
      ctx.fillStyle = BALL_COLOR
      ctx.font = "10px monospace"
      ctx.textBaseline = "top"
      ctx.fillText(`Progress: ${pct}%`, HUD_MARGIN, HUD_MARGIN + heartHeight + 6)
    }

    const drawGame = (state: GameState) => {
      const dims = dimsRef.current
      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, dims.width, dims.height)

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      // Idle is the reduced-motion boundary: no ball, no paddle, nothing moving until Start is pressed.
      if (state === "idle") return

      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = PADDLE_COLOR
      ctx.fillRect(paddleRef.current.x, paddleRef.current.y, paddleRef.current.width, paddleRef.current.height)

      drawHud()
    }

    let rafId: number | null = null
    let isVisible = true

    const scheduleFrame = () => {
      if (!isVisible) {
        rafId = null
        return
      }
      rafId = requestAnimationFrame(gameLoop)
    }

    // The idle, game-over and win screens are static pictures — repainting them
    // 60x a second is pure waste while the footer sits on screen.
    let needsRedraw = true
    redrawRef.current = () => {
      needsRedraw = true
    }

    function gameLoop() {
      const state = gameStateRef.current
      if (state === "playing") {
        updateGame()
        drawGame(state)
      } else if (needsRedraw) {
        drawGame(state)
        needsRedraw = false
      }
      scheduleFrame()
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true
      if (isVisible && rafId === null) {
        scheduleFrame()
      }
    })
    intersectionObserver.observe(container)

    scheduleFrame()

    // Mouse and touch tracking: only move the paddle while actively playing.
    const movePaddleTo = (clientX: number) => {
      if (gameStateRef.current !== "playing") return
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const paddle = paddleRef.current
      paddle.x = clamp(x - paddle.width / 2, 0, dimsRef.current.width - paddle.width)
    }

    const handleMouseMove = (e: MouseEvent) => movePaddleTo(e.clientX)
    const handleTouchMove = (e: TouchEvent) => {
      if (gameStateRef.current !== "playing") return
      const touch = e.touches[0]
      if (!touch) return
      e.preventDefault()
      movePaddleTo(touch.clientX)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })

    startGameRef.current = () => {
      setGameStateBoth("playing")
    }
    playAgainRef.current = () => {
      livesRef.current = LIVES_START
      initializeGame()
      setGameStateBoth("idle")
    }

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (lifeLostTimeoutRef.current) clearTimeout(lifeLostTimeoutRef.current)
    }
  }, [])

  // Keyboard control: attach only while playing, per spec, so arrow keys don't hijack the page otherwise.
  useEffect(() => {
    if (gameState !== "playing") return

    const handleKeyDown = (e: KeyboardEvent) => {
      const paddle = paddleRef.current
      const dims = dimsRef.current
      const step = paddleStepRef.current
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        paddle.x = clamp(paddle.x - step, 0, dims.width - paddle.width)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        paddle.x = clamp(paddle.x + step, 0, dims.width - paddle.width)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState])

  const buttonClass = `${pixelFont.className} inline-flex min-h-[44px] min-w-[44px] items-center justify-center border px-6 py-3 text-xs uppercase tracking-[0.05em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`
  const buttonStyle = { color: BALL_COLOR, borderColor: PADDLE_COLOR, backgroundColor: BACKGROUND_COLOR }
  // Overlay text sits on top of the pixel letters, which are the same green as some of this
  // text/border — a solid backdrop keeps it legible regardless of which pixels are lit behind it.
  // border-4 (vs. the site's usual hairline border) reads as a chunky arcade-cabinet frame.
  const panelStyle = { backgroundColor: BACKGROUND_COLOR, borderColor: PADDLE_COLOR }
  const panelClass = "border-4 px-8 py-6 flex flex-col items-center gap-4"

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] min-h-[400px] sm:h-[70vh]"
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
        aria-label="Playable pong game: move the paddle with your mouse, touch, or arrow keys to bounce the ball and spell ILYASRHMN"
      />

      {gameState === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p
            className={`${pixelFont.className} text-[10px] uppercase leading-relaxed tracking-[0.05em]`}
            style={{ color: PADDLE_COLOR }}
          >
            A game is hiding here
            <br />
            Try to spell my name
          </p>
          <button type="button" onClick={() => startGameRef.current()} className={buttonClass} style={buttonStyle}>
            Press Start
          </button>
        </div>
      )}

      {gameState === "life-lost" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={panelClass} style={panelStyle}>
            <p className={`${pixelFont.className} text-xs uppercase tracking-[0.05em]`} style={{ color: BALL_COLOR }}>
              Life lost
            </p>
          </div>
        </div>
      )}

      {(gameState === "gameover" || gameState === "win") && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={panelClass} style={panelStyle}>
            <p className={`${pixelFont.className} text-sm uppercase tracking-[0.05em]`} style={{ color: BALL_COLOR }}>
              {gameState === "win" ? "You spelled it." : "Game Over"}
            </p>
            <button type="button" onClick={() => playAgainRef.current()} className={buttonClass} style={buttonStyle}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PongGame
