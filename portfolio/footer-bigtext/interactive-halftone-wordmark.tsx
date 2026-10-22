"use client"

import * as React from "react"

export type HalftonePalette = {
  /** Canvas background fill color */
  background?: string
  /** Resting dot color */
  ink?: string
  /** Active / displaced dot warmth color */
  warm?: string
}

export const HALFTONE_PRESETS = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
  crimson: { background: "#762326", ink: "#f4dfb8", warm: "#f2a93b" },
} as const

export type HalftonePresetName = keyof typeof HALFTONE_PRESETS

export type InteractiveHalftoneWordmarkProps = {
  /** The text to render in halftone dots (e.g. "STUDIO", "HALDEN", "MALNADU KITCHEN") */
  text?: string
  /** Color theme preset */
  preset?: HalftonePresetName
  /** Custom colors overriding or complementing the preset */
  palette?: HalftonePalette
  /** Pitch between dot centers in pixels (defaults to 6; smaller = denser/sharper) */
  dotGap?: number
  /** Mouse repulsion radius in pixels (default 85) */
  radius?: number
  /** Fraction of text height cropped by the bottom edge (0 to 0.5, default 0.18) */
  crop?: number
  /** Film grain noise intensity (0 to 1, default 0.45, 0 = off) */
  grain?: number
  /** Enable mouse repulsion & click ripples (default true) */
  interactive?: boolean
  /** Font family for measuring and rendering the wordmark */
  fontFamily?: string
  /** Font weight for measuring and rendering the wordmark */
  fontWeight?: number | string
  /** Container height (e.g. "360px", "clamp(240px, 25vw, 420px)") */
  height?: string | number
  /** Optional click handler for the container */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Optional CSS class */
  className?: string
  /** Optional inline styles */
  style?: React.CSSProperties
}

const DEFAULT_FONT =
  '"Gabarito", "Inter Tight", "Helvetica Neue", Arial, -apple-system, BlinkMacSystemFont, sans-serif'

function parseHex(hex?: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!match) return null
  const full =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : match[1]
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function calculateDotRadius(density: number, gap: number): number {
  const clamped = density < 0 ? 0 : density > 1 ? 1 : density
  return Math.sqrt(clamped) * gap * 0.56
}

function physicsStep(
  curX: number,
  curY: number,
  vx: number,
  vy: number,
  origX: number,
  origY: number,
  ptrX: number,
  ptrY: number,
  radius: number
): [number, number, number, number] {
  const dx = curX - ptrX
  const dy = curY - ptrY
  const distSq = dx * dx + dy * dy
  if (radius > 0 && distSq < radius * radius) {
    const dist = Math.sqrt(distSq) + 0.001
    const push = (1 - dist / radius) * 2.6
    vx += (dx / dist) * push
    vy += (dy / dist) * push
  }
  // Restorative spring force toward grid origin (k = 0.05) + velocity damping (0.84)
  vx = (vx + (origX - curX) * 0.05) * 0.84
  vy = (vy + (origY - curY) * 0.05) * 0.84
  return [curX + vx, curY + vy, vx, vy]
}

function calculateWarmth(
  curX: number,
  curY: number,
  origX: number,
  origY: number,
  maxDist: number
): number {
  const dist = Math.hypot(curX - origX, curY - origY)
  return Math.min(1, dist / maxDist)
}

function computeTargetFontSize(measured100: number, targetWidth: number): number {
  return measured100 > 0 ? (targetWidth / measured100) * 100 : 0
}

/**
 * InteractiveHalftoneWordmark
 *
 * A standalone, high-performance canvas component rendering large typography
 * in halftone dots with:
 * - Realtime spring-physics cursor repulsion
 * - Dynamic color shifting from base ink to warm embers upon displacement
 * - Expanding radial shockwave ripple on click
 * - Film grain noise texture overlay
 * - DPI-aware crisp rendering & automatic ResizeObserver layout
 * - Screen-reader accessible hidden text
 */
export function InteractiveHalftoneWordmark({
  text = "HALDEN",
  preset = "night",
  palette,
  dotGap = 6,
  radius = 85,
  crop = 0.18,
  grain = 0.45,
  interactive = true,
  fontFamily = DEFAULT_FONT,
  fontWeight = 800,
  height = "clamp(240px, 24vw, 420px)",
  onClick,
  className = "",
  style = {},
}: InteractiveHalftoneWordmarkProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const activeColors: Required<HalftonePalette> = {
    ...(HALFTONE_PRESETS[preset] || HALFTONE_PRESETS.night),
    ...(palette || {}),
  }

  const stateRef = React.useRef({
    colors: activeColors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    text,
  })

  stateRef.current = {
    colors: activeColors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    text,
  }

  const cacheKey = [
    text,
    dotGap,
    crop,
    grain,
    fontFamily,
    fontWeight,
    activeColors.background,
    activeColors.ink,
    activeColors.warm,
  ].join("|")

  React.useEffect(() => {
    const rootEl = rootRef.current
    const canvasEl = canvasRef.current
    if (!rootEl || !canvasEl) return
    const ctx = canvasEl.getContext("2d")
    if (!ctx) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let heightPx = 0
    let dpr = 1
    let pointerX = -1e5
    let pointerY = -1e5
    let animFrame = 0
    let isIntersecting = true
    let needsDraw = true
    let shockwave = { x: 0, y: 0, t: -1 }
    let particles = new Float32Array(0)
    let particleCount = 0
    let noiseCanvas: HTMLCanvasElement | null = null

    const inkRgb = parseHex(stateRef.current.colors.ink) || [233, 228, 218]
    const warmRgb = parseHex(stateRef.current.colors.warm) || [233, 118, 43]

    const layout = () => {
      const state = stateRef.current
      const rect = rootEl.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      heightPx = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvasEl.width = Math.round(width * dpr)
      canvasEl.height = Math.round(heightPx * dpr)

      const offscreen = document.createElement("canvas")
      offscreen.width = width
      offscreen.height = heightPx
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true })
      if (!offCtx) return

      const baseFont = `${state.fontWeight} 100px ${state.fontFamily}`
      offCtx.font = baseFont
      const displayText = state.text || " "
      const measured100 = offCtx.measureText(displayText).width
      const targetFontSize = computeTargetFontSize(measured100, width * 1.02)
      offCtx.font = `${state.fontWeight} ${targetFontSize}px ${state.fontFamily}`

      const metrics = offCtx.measureText(displayText)
      const ascent = metrics.actualBoundingBoxAscent || targetFontSize * 0.72
      const clampedCrop = Math.max(0, Math.min(0.6, state.crop))

      offCtx.fillStyle = "#000"
      offCtx.textBaseline = "alphabetic"
      offCtx.fillText(displayText, (width - metrics.width) / 2, heightPx + ascent * clampedCrop)

      const imgData = offCtx.getImageData(0, 0, width, heightPx).data
      const gap = Math.max(3, state.dotGap)
      const cols = Math.ceil(width / gap)
      const rows = Math.ceil(heightPx / gap)
      const particleData: number[] = []

      // 3x3 supersampling for anti-aliased dot radius
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sumAlpha = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const sampleX = Math.min(width - 1, Math.floor(c * gap + ((sx + 0.5) * gap) / 3))
              const sampleY = Math.min(heightPx - 1, Math.floor(r * gap + ((sy + 0.5) * gap) / 3))
              sumAlpha += imgData[(sampleY * width + sampleX) * 4 + 3]
            }
          }
          const density = sumAlpha / (9 * 255)
          if (density < 0.06) continue
          const dotX = c * gap + gap / 2
          const dotY = r * gap + gap / 2
          particleData.push(dotX, dotY, 0, 0, dotX, dotY, calculateDotRadius(density, gap))
        }
      }

      particles = new Float32Array(particleData)
      particleCount = particleData.length / 7

      // Create film-grain noise texture
      noiseCanvas = document.createElement("canvas")
      noiseCanvas.width = 256
      noiseCanvas.height = 256
      const noiseCtx = noiseCanvas.getContext("2d")
      if (noiseCtx) {
        const noiseImg = noiseCtx.createImageData(256, 256)
        for (let i = 0; i < noiseImg.data.length; i += 4) {
          const val = Math.random() * 255
          noiseImg.data[i] = val
          noiseImg.data[i + 1] = val
          noiseImg.data[i + 2] = val
          noiseImg.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        noiseCtx.putImageData(noiseImg, 0, 0)
      }
      needsDraw = true
    }

    const draw = (now: number) => {
      const state = stateRef.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = state.colors.background
      ctx.fillRect(0, 0, width, heightPx)

      const interactRadius =
        state.interactive && !prefersReducedMotion ? Math.max(0, state.radius) : 0
      const shockElapsed = shockwave.t < 0 ? 1e9 : now - shockwave.t
      const waveRadius = shockElapsed * 0.9

      let moving = false

      for (let i = 0; i < particleCount; i++) {
        const offset = i * 7
        let curX = particles[offset]
        let curY = particles[offset + 1]
        let vx = particles[offset + 2]
        let vy = particles[offset + 3]
        const origX = particles[offset + 4]
        const origY = particles[offset + 5]

        if (!prefersReducedMotion) {
          if (shockElapsed < 900) {
            const dx = origX - shockwave.x
            const dy = origY - shockwave.y
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
            const waveInfluence = 1 - Math.min(1, Math.abs(dist - waveRadius) / 26)
            if (waveInfluence > 0) {
              const push = waveInfluence * 3.2 * (1 - shockElapsed / 900)
              vx += (dx / dist) * push
              vy += (dy / dist) * push
            }
          }

          const stepResult = physicsStep(
            curX,
            curY,
            vx,
            vy,
            origX,
            origY,
            pointerX,
            pointerY,
            interactRadius
          )
          curX = stepResult[0]
          curY = stepResult[1]
          vx = stepResult[2]
          vy = stepResult[3]

          if (
            Math.abs(vx) + Math.abs(vy) > 0.02 ||
            Math.abs(curX - origX) + Math.abs(curY - origY) > 0.05
          ) {
            moving = true
          } else {
            curX = origX
            curY = origY
            vx = 0
            vy = 0
          }

          particles[offset] = curX
          particles[offset + 1] = curY
          particles[offset + 2] = vx
          particles[offset + 3] = vy
        }

        const warmth = calculateWarmth(curX, curY, origX, origY, 28)
        if (warmth > 0.02) {
          const r = Math.round(inkRgb[0] + (warmRgb[0] - inkRgb[0]) * warmth)
          const g = Math.round(inkRgb[1] + (warmRgb[1] - inkRgb[1]) * warmth)
          const b = Math.round(inkRgb[2] + (warmRgb[2] - inkRgb[2]) * warmth)
          ctx.fillStyle = `rgb(${r},${g},${b})`
        } else {
          ctx.fillStyle = state.colors.ink
        }

        ctx.beginPath()
        ctx.arc(curX, curY, particles[offset + 6], 0, Math.PI * 2)
        ctx.fill()
      }

      if (noiseCanvas && state.grain > 0) {
        ctx.globalAlpha = Math.min(1, state.grain) * 0.09
        ctx.globalCompositeOperation = "overlay"
        const pattern = ctx.createPattern(noiseCanvas, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, width, heightPx)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }

      needsDraw = moving || shockElapsed < 900 || pointerX > -1e4
    }

    const loop = (now: number) => {
      animFrame = 0
      if (isIntersecting) {
        draw(now)
        if (needsDraw) {
          animFrame = requestAnimationFrame(loop)
        }
      }
    }

    const wake = () => {
      needsDraw = true
      if (!animFrame && isIntersecting) {
        animFrame = requestAnimationFrame(loop)
      }
    }

    const toLocal = (e: PointerEvent): [number, number] => {
      const rect = canvasEl.getBoundingClientRect()
      return [e.clientX - rect.left, e.clientY - rect.top]
    }

    const onMove = (e: PointerEvent) => {
      if (!stateRef.current.interactive) return
      const [lx, ly] = toLocal(e)
      pointerX = lx
      pointerY = ly
      wake()
    }

    const onLeave = () => {
      pointerX = -1e5
      pointerY = -1e5
      wake()
    }

    const onDown = (e: PointerEvent) => {
      if (!stateRef.current.interactive || prefersReducedMotion) return
      const [lx, ly] = toLocal(e)
      shockwave = { x: lx, y: ly, t: performance.now() }
      wake()
    }

    layout()
    draw(performance.now())
    wake()

    rootEl.addEventListener("pointermove", onMove)
    rootEl.addEventListener("pointerleave", onLeave)
    rootEl.addEventListener("pointerdown", onDown)

    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(rootEl)

    const io = new IntersectionObserver((entries) => {
      isIntersecting = entries[0] ? entries[0].isIntersecting : true
      if (isIntersecting) wake()
    })
    io.observe(rootEl)

    let alive = true
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) {
          layout()
          wake()
        }
      })
    }

    return () => {
      alive = false
      cancelAnimationFrame(animFrame)
      ro.disconnect()
      io.disconnect()
      rootEl.removeEventListener("pointermove", onMove)
      rootEl.removeEventListener("pointerleave", onLeave)
      rootEl.removeEventListener("pointerdown", onDown)
    }
  }, [cacheKey])

  return (
    <div
      ref={rootRef}
      className={`interactive-halftone-wordmark ${className}`}
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        cursor: interactive ? "crosshair" : "default",
        userSelect: "none",
        ...style,
      }}
      role="img"
      aria-label={text}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {/* Accessible visually-hidden text for screen readers */}
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {text}
      </span>
    </div>
  )
}

export default InteractiveHalftoneWordmark
