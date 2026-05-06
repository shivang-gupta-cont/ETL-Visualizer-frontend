import { useEffect, useState } from "react"
import { getDocumentById } from "../../services/BucketAnalyticsService"
import "../styles/WholeDocView.css"

// ── Data fetcher ──────────────────────────────────────────────────────────────
const fetchDocument = async (bucket, source, collection, docId) => {
    try {
        const res = await getDocumentById(bucket, source, collection, docId)
        return res.data   // raw JSON object
    } catch {
        console.log("error fetching document")
        return null
    }
}

// ── JSON Renderer (recursive) ─────────────────────────────────────────────────
function JsonNode({ data, depth = 0 }) {
    const [collapsed, setCollapsed] = useState(depth > 2)   // auto-collapse deep nodes
    const indent = depth * 16

    if (data === null) return <span className="json-null">null</span>
    if (data === undefined) return <span className="json-null">undefined</span>

    if (typeof data === "boolean")
        return <span className="json-bool">{data.toString()}</span>

    if (typeof data === "number")
        return <span className="json-number">{data}</span>

    if (typeof data === "string")
        return <span className="json-string">"{data}"</span>

    if (Array.isArray(data)) {
        if (data.length === 0) return <span className="json-bracket">[]</span>
        return (
            <span>
                <button className="json-toggle" onClick={() => setCollapsed(p => !p)}>
                    {collapsed ? "▶" : "▼"}
                </button>
                <span className="json-bracket">[</span>
                {collapsed ? (
                    <span
                        className="json-collapsed-hint"
                        onClick={() => setCollapsed(false)}
                    >
                        {data.length} items…
                    </span>
                ) : (
                    <div style={{ marginLeft: indent + 16 }}>
                        {data.map((item, i) => (
                            <div key={i} className="json-row">
                                <span className="json-index">{i}</span>
                                <span className="json-colon">: </span>
                                <JsonNode data={item} depth={depth + 1} />
                                {i < data.length - 1 && <span className="json-comma">,</span>}
                            </div>
                        ))}
                    </div>
                )}
                <span className="json-bracket">]</span>
            </span>
        )
    }

    if (typeof data === "object") {
        const keys = Object.keys(data)
        if (keys.length === 0) return <span className="json-bracket">{"{}"}</span>
        return (
            <span>
                <button className="json-toggle" onClick={() => setCollapsed(p => !p)}>
                    {collapsed ? "▶" : "▼"}
                </button>
                <span className="json-bracket">{"{"}</span>
                {collapsed ? (
                    <span
                        className="json-collapsed-hint"
                        onClick={() => setCollapsed(false)}
                    >
                        {keys.length} keys…
                    </span>
                ) : (
                    <div style={{ marginLeft: indent + 16 }}>
                        {keys.map((key, i) => (
                            <div key={key} className="json-row">
                                <span className="json-key">"{key}"</span>
                                <span className="json-colon">: </span>
                                <JsonNode data={data[key]} depth={depth + 1} />
                                {i < keys.length - 1 && <span className="json-comma">,</span>}
                            </div>
                        ))}
                    </div>
                )}
                <span className="json-bracket">{"}"}</span>
            </span>
        )
    }

    return <span>{String(data)}</span>
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function WholeDocView({ dataSource, docId }) {
    const [doc, setDoc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setDoc(null); setLoading(true); setError(null)
            ; (async () => {
                try {
                    const data = await fetchDocument(dataSource, "_default", "_default", docId)
                    if (data) setDoc(data)
                    else setError("Document not found.")
                } catch {
                    setError("Failed to load document.")
                } finally {
                    setLoading(false)
                }
            })()
    }, [dataSource, docId])

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(doc, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="wdv-card">

            {/* Header */}
            <div className="wdv-header">
                <div className="wdv-title-row">
                    <h2 className="wdv-title">View Document With Id :
                        <span className="wdv-doc-id">{docId}</span>
                    </h2>
                    {doc && (
                        <button className="wdv-copy-btn" onClick={handleCopy}>
                            {copied ? "✓ Copied" : "⎘ Copy JSON"}
                        </button>
                    )}
                </div>
                <div className="wdv-underline" />
            </div>

            {loading ? (
                <div className="wdv-loading">Loading…</div>
            ) : error ? (
                <div className="wdv-error">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            ) : (
                <div className="wdv-body">
                    <pre className="wdv-json">
                        <JsonNode data={doc} depth={0} />
                    </pre>
                </div>
            )}

        </div>
    )
}