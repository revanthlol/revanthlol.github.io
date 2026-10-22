"use client"

import * as React from "react"

export type FooterLink = {
  label: string
  href?: string
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

export type Palette = {
  background?: string
  ink?: string
  warm?: string
}

export type HalftoneCanvasWordmarkProps = {
  wordmark?: string
  palette?: Palette
  dotGap?: number
  radius?: number
  crop?: number
  grain?: number
  interactive?: boolean
  fontFamily?: string
  fontWeight?: number | string
  height?: string | number
  className?: string
  style?: React.CSSProperties
}

export type HalftoneWordmarkFooterProps = {
  wordmark?: string
  label?: string
  meta?: string
  columns?: FooterColumn[]
  backToTop?: boolean
  preset?: "night" | "paper" | "ember" | "cobalt"
  palette?: Palette
  dotGap?: number
  radius?: number
  crop?: number
  grain?: number
  interactive?: boolean
  fontFamily?: string
  fontWeight?: number | string
  monoFamily?: string
  height?: string
  className?: string
}

const PRESETS: Record<string, { background: string; ink: string; warm: string }> = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Work", links: [{ label: "Index" }, { label: "Archive" }, { label: "Journal" }] },
  { title: "Studio", links: [{ label: "About" }, { label: "Process" }, { label: "Careers" }] },
  { title: "Contact", links: [{ label: "hello@halden.co" }, { label: "+47 22 00 41 00" }] },
]

const DEFAULT_FONT = '"Gabarito", "Inter Tight", "Helvetica Neue", Arial, system-ui, sans-serif'
const DEFAULT_MONO = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace'

function hwfHex(hex?: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!match) return null
  const full = match[1].length === 3 ? match[1].split("").map((c) => c + c).join("") : match[1]
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function hwfRadius(density: number, gap: number): number {
  const clamped = density < 0 ? 0 : density > 1 ? 1 : density
  return Math.sqrt(clamped) * gap * 0.56
}

function hwfStep(
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
  vx = (vx + (origX - curX) * 0.05) * 0.84
  vy = (vy + (origY - curY) * 0.05) * 0.84
  return [curX + vx, curY + vy, vx, vy]
}

function hwfWarmth(curX: number, curY: number, origX: number, origY: number, maxDist: number): number {
  const dist = Math.hypot(curX - origX, curY - origY)
  return Math.min(1, dist / maxDist)
}

function hwfFitSize(measured100: number, targetWidth: number): number {
  return measured100 > 0 ? (targetWidth / measured100) * 100 : 0
}

/**
 * Dedicated Interactive Halftone Wordmark Canvas Component
 * Renders the brand wordmark in responsive halftone dots with spring physics,
 * pointer repulsion, warmth color shifting, and shockwave click ripple.
 */
export function HalftoneCanvasWordmark({
  wordmark = "malnadu",
  palette = { background: "#762326", ink: "#f4dfb8", warm: "#f2a93b" },
  dotGap = 6,
  radius = 90,
  crop = 0.18,
  grain = 0.45,
  interactive = true,
  fontFamily = DEFAULT_FONT,
  fontWeight = 800,
  height = "clamp(240px, 22vw, 380px)",
  className = "",
  style = {},
}: HalftoneCanvasWordmarkProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const stateRef = React.useRef({
    colors: palette,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  })

  stateRef.current = {
    colors: palette,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  }

  const cacheKey = [
    wordmark,
    dotGap,
    crop,
    grain,
    fontFamily,
    fontWeight,
    palette.background,
    palette.ink,
    palette.warm,
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

    const inkRgb = hwfHex(stateRef.current.colors.ink) || [244, 223, 184]
    const warmRgb = hwfHex(stateRef.current.colors.warm) || [242, 169, 59]

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
      const text = state.wordmark || " "
      const measured100 = offCtx.measureText(text).width
      const targetFontSize = hwfFitSize(measured100, width * 1.02)
      offCtx.font = `${state.fontWeight} ${targetFontSize}px ${state.fontFamily}`

      const metrics = offCtx.measureText(text)
      const ascent = metrics.actualBoundingBoxAscent || targetFontSize * 0.72
      const clampedCrop = Math.max(0, Math.min(0.6, state.crop))

      offCtx.fillStyle = "#000"
      offCtx.textBaseline = "alphabetic"
      offCtx.fillText(text, (width - metrics.width) / 2, heightPx + ascent * clampedCrop)

      const imgData = offCtx.getImageData(0, 0, width, heightPx).data
      const gap = Math.max(3, state.dotGap)
      const cols = Math.ceil(width / gap)
      const rows = Math.ceil(heightPx / gap)
      const particleData: number[] = []

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
          particleData.push(dotX, dotY, 0, 0, dotX, dotY, hwfRadius(density, gap))
        }
      }

      particles = new Float32Array(particleData)
      particleCount = particleData.length / 7

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
      ctx.fillStyle = state.colors.background || "#762326"
      ctx.fillRect(0, 0, width, heightPx)

      const interactRadius = state.interactive && !prefersReducedMotion ? Math.max(0, state.radius) : 0
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

          const stepResult = hwfStep(curX, curY, vx, vy, origX, origY, pointerX, pointerY, interactRadius)
          curX = stepResult[0]
          curY = stepResult[1]
          vx = stepResult[2]
          vy = stepResult[3]

          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(curX - origX) + Math.abs(curY - origY) > 0.05) {
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

        const warmth = hwfWarmth(curX, curY, origX, origY, 28)
        if (warmth > 0.02) {
          const r = Math.round(inkRgb[0] + (warmRgb[0] - inkRgb[0]) * warmth)
          const g = Math.round(inkRgb[1] + (warmRgb[1] - inkRgb[1]) * warmth)
          const b = Math.round(inkRgb[2] + (warmRgb[2] - inkRgb[2]) * warmth)
          ctx.fillStyle = `rgb(${r},${g},${b})`
        } else {
          ctx.fillStyle = state.colors.ink || "#f4dfb8"
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
      if (!stateRef.current.interactive || prefersReducedMotion || (e.target as Element).closest("a,button")) return
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
      className={`hwf-wordmark-container ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        cursor: "crosshair",
        ...style,
      }}
      role="img"
      aria-label={wordmark}
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
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
        }}
      >
        {wordmark}
      </span>
    </div>
  )
}

const CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.hwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
  gap: 24px; padding: clamp(22px, 3.4vw, 40px) clamp(20px, 3.4vw, 44px) 0;
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; line-height: 1.75;
}
.hwf-brand strong { display: block; font-weight: 500; }
.hwf-brand span { opacity: .45; }
.hwf-col h3 { margin: 0; font: inherit; opacity: .4; font-weight: 500; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .78; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 1; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: clamp(18px, 2.6vw, 30px) clamp(20px, 3.4vw, 44px) 0; padding-top: 12px;
  border-top: 0.5px solid color-mix(in srgb, var(--hwf-ink) 16%, transparent);
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 720px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 18px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "halden",
  label = "Halden Studio",
  meta = "©2026 · Oslo / Lisbon",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  preset = "night",
  palette,
  dotGap = 6,
  radius = 80,
  crop = 0.2,
  grain = 0.5,
  interactive = true,
  fontFamily = DEFAULT_FONT,
  fontWeight = 800,
  monoFamily = DEFAULT_MONO,
  height = "560px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const activePalette = {
    ...(PRESETS[preset] || PRESETS.night),
    ...(palette || {}),
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      className={`hwf-root ${className}`}
      style={{
        position: "relative",
        minHeight: height,
        display: "flex",
        flexDirection: "column",
        ["--hwf-bg" as any]: activePalette.background,
        ["--hwf-ink" as any]: activePalette.ink,
        ["--hwf-mono" as any]: monoFamily,
      }}
    >
      <style>{CSS}</style>
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>{label}</strong>
          <span>{meta}</span>
        </div>
        {columns.map((col) => (
          <nav key={col.title} className="hwf-col" aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href || "#"}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hwf-rule">
        {backToTop && (
          <button type="button" className="hwf-up" onClick={scrollToTop}>
            Back to top ↑
          </button>
        )}
      </div>
      <div style={{ marginTop: "auto", width: "100%" }}>
        <HalftoneCanvasWordmark
          wordmark={wordmark}
          palette={activePalette}
          dotGap={dotGap}
          radius={radius}
          crop={crop}
          grain={grain}
          interactive={interactive}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          height="clamp(220px, 24vw, 360px)"
        />
      </div>
    </footer>
  )
}
