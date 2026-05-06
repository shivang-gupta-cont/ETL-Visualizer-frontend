import { useEffect, useState } from "react"
import { getDistributionDataByKey, getDocumentsCount, getValidKeys } from "../../services/BucketAnalyticsService"
import "../styles/PieChart.css"

// ── Data fetchers ─────────────────────────────────────────────────────────────
const fetchTotalDocuments = async (bucket, source, collection) => {
    try {
        const res = await getDocumentsCount(bucket, source, collection)
        return res.data
    } catch { console.log("error fetching documents count") }
}

const fetchData = async (bucket, source, collection, key) => {
    try {
        const res = await getDistributionDataByKey(bucket, source, collection, key)
        return res.data.map((item) => {
            const type_name = Object.keys(item)[0]
            return { type_name, count: item[type_name] }
        })
    } catch { console.log("error fetching dsa type data") }
}

const fetchValidKeys = async () => {
    try {
        const res = await getValidKeys()
        return res.data
    } catch { console.log("error in fetching valid keys.") }
}

// ── Palette (sky blue tones — matches app theme) ──────────────────────────────
const PALETTE = [
    "#38bdf8", // sky blue
    "#7dd3fc", // sky light
    "#0ea5e9", // sky medium
    "#1d4ed8", // dark blue
    "#60a5fa", // blue-400
    "#93c5fd", // blue-300
]

// ── Math helpers ──────────────────────────────────────────────────────────────
const polarToXY = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const buildSlices = (data) => {
    const total = data.reduce((s, d) => s + d.count, 0)
    let cursor = 0
    return data.map((d, i) => {
        const pct = d.count / total
        const start = cursor
        cursor += pct * 360
        return { ...d, pct, startAngle: start, endAngle: cursor, color: PALETTE[i % PALETTE.length] }
    })
}

// ── Pie Slice ─────────────────────────────────────────────────────────────────
function PieSlice({ cx, cy, r, slice, isHovered, onHover, onLeave, animate, index }) {
    const { startAngle, endAngle, color } = slice
    const sweepSpan = endAngle - startAngle
    const displayEnd = animate ? startAngle + sweepSpan : startAngle

    const start = polarToXY(cx, cy, r, startAngle)
    const end = polarToXY(cx, cy, r, displayEnd)
    const large = sweepSpan > 180 ? 1 : 0
    const pathD = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`

    const mid = startAngle + sweepSpan / 2
    const lp = polarToXY(cx, cy, r * 0.68, mid)
    const offset = polarToXY(cx, cy, 10, mid)

    return (
        <g
            style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
            transform={isHovered ? `translate(${offset.x - cx}, ${offset.y - cy})` : ""}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={onLeave}
        >
            <path
                d={pathD}
                fill={color}
                stroke="rgba(10,25,55,0.8)"
                strokeWidth="2"
                opacity={isHovered ? 1 : 0.82}
                style={{
                    filter: isHovered ? `drop-shadow(0 0 10px ${color})` : "none",
                    transition: "opacity 0.2s ease, filter 0.2s ease",
                }}
            />
            {animate && sweepSpan > 18 && (
                <>
                    <text x={lp.x} y={lp.y + 10} textAnchor="middle" dominantBaseline="middle"
                        fill="#0f172a" fontSize="10" fontFamily="monospace">
                        {(slice.pct * 100).toFixed(0)}%
                    </text>
                </>
            )}
        </g>
    )
}

// ── Legend Item ───────────────────────────────────────────────────────────────
function LegendItem({ slice, isHovered, onHover, onLeave, index, selectedKey, onSliceClick }) {
    // const [modalData, setModalData] = useState(null)
    // const [modalLoading, setModalLoading] = useState(false)
    // const [showModal, setShowModal] = useState(false)
    const handleClick = async () => {
        onSliceClick(selectedKey, slice.type_name)
    }
    return (
        <button
            className={`legend-item ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={onLeave}
            onClick={handleClick}
            title={`View details for ${slice.type_name}`}
        >
            <span
                className="legend-swatch"
                style={{
                    backgroundColor: slice.color,
                    boxShadow: isHovered ? `0 0 8px ${slice.color}` : "none",
                }}
            />
            <span className="legend-name">{slice.type_name}</span>
            <span
                className="legend-count"
                style={{
                    color: slice.color,
                    textShadow: isHovered ? `0 0 8px ${slice.color}` : "none",
                }}
            >
                {slice.count}
            </span>

            {/* Small arrow hint */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ marginLeft: 4, opacity: 0.5 }}>
                <path d="M4 2l4 4-4 4" stroke={slice.color}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PieChart({ dataSource, onSliceClick }) {
    const [totalDoc, setTotalDoc] = useState(null)
    const [slices, setSlices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hovered, setHovered] = useState(null)
    const [animate, setAnimate] = useState(false)
    const [selectedKey, setSelectedKey] = useState('dsaType')
    const [keys, setKeys] = useState([])

    useEffect(() => {
        setTotalDoc(null); setSlices([]); setLoading(true); setError(null); setAnimate(false)
            ; (async () => {
                try {
                    const [docs, distributionData, validKeys] = await Promise.all([
                        fetchTotalDocuments(dataSource, '_default', '_default'),
                        fetchData(dataSource, '_default', '_default', selectedKey),
                        fetchValidKeys()
                    ])
                    setTotalDoc(docs.count)
                    setSlices(buildSlices(distributionData))
                    setKeys(validKeys)
                    setTimeout(() => setAnimate(true), 80)
                } catch { setError("Failed to load chart data.") }
                finally { setLoading(false) }
            })()
    }, [dataSource, selectedKey])

    const cx = 150, cy = 150, r = 120

    const handleChange = (e) => {
        if (e.target.value) setSelectedKey(e.target.value)
    }

    return (
        // pie chart
        <div className="pie-card">

            {/* Header */}
            <div className="pie-header">
                <h2 className="pie-title">
                    <label>Data Distribution by</label>
                    <select
                        value={selectedKey}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        {/* Loading / placeholder state */}
                        <option value="">
                            {loading ? "Loading..." : "--select a key--"}
                        </option>

                        {/* Populated options from API */}
                        {keys.map((key_) => (
                            <option key={key_} value={key_}>{key_}</option>
                        ))}
                    </select>
                </h2>
                <div className="pie-underline" />
            </div>

            {loading ? (
                <div className="pie-loading">Loading…</div>
            ) : error ? (
                <div className="pie-error">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            ) : (
                <>
                    {/* Chart + Legend */}
                    <div className="pie-body">
                        <div className="pie-svg-wrap">
                            <svg width={300} height={300} viewBox="0 0 300 300">
                                {/* Outer ring */}
                                <circle cx={cx} cy={cy} r={r + 4} fill="none"
                                    stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
                                {slices.map((slice, i) => (
                                    <PieSlice
                                        key={slice.type_name}
                                        cx={cx} cy={cy} r={r}
                                        slice={slice} index={i}
                                        isHovered={hovered === i}
                                        onHover={setHovered}
                                        onLeave={() => setHovered(null)}
                                        animate={animate}
                                    />
                                ))}
                                {/* Donut hole */}
                                <circle cx={cx} cy={cy} r={40} fill="rgba(10,25,55,0.9)" />
                                <circle cx={cx} cy={cy} r={40} fill="none"
                                    stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
                                <text x={cx} y={cy - 8} textAnchor="middle"
                                    fill="#fff" fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif">
                                    {totalDoc}
                                </text>
                                <text x={cx} y={cy + 12} textAnchor="middle"
                                    fill="#7dd3fc" fontSize="9" fontFamily="monospace" letterSpacing="0.1em">
                                    TOTAL
                                </text>
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="pie-legend">
                            {slices.map((slice, i) => (
                                <LegendItem
                                    key={slice.type_name}
                                    slice={slice} index={i}
                                    isHovered={hovered === i}
                                    onHover={setHovered}
                                    onLeave={() => setHovered(null)}
                                    selectedKey={selectedKey}
                                    onSliceClick={onSliceClick}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pie-footer">
                        <span className="pie-footer-label">
                            <span className="pie-footer-dot" />
                            Total Documents
                        </span>
                        <span className="pie-footer-total">{totalDoc}</span>
                    </div>
                </>
            )}
        </div>
    )
}