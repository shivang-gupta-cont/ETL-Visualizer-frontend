import { useEffect, useState } from "react"
import { getDocumentIdsList } from "../../services/BucketAnalyticsService"
import "../styles/DocIdList.css"

const fetchDocIds = async (bucket, source, collection, key, value) => {
    try {
        const res = await getDocumentIdsList(bucket, source, collection, key, value)
        console.log(key)
        console.log(value)
        console.log("fetched doc ids:", res)
        return res.data  // string[] → ["id1", "id2", ...]
    } catch {
        console.log("error fetching doc ids")
        return null
    }
}

function DocIdRow({ docId, onClick }) {
    return (
        <button className="docid-row" onClick={() => onClick(docId)}>
            <span className="docid-icon">⬡</span>
            <span className="docid-text">{docId}</span>
            <svg className="docid-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l4 4-4 4" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

export default function DocIdList({ dataSource, filterKey, filterValue, onDocClick }) {
    const [docIds, setDocIds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        setDocIds([]); setLoading(true); setError(null)
            ; (async () => {
                try {
                    const ids = await fetchDocIds(dataSource, "_default", "_default", filterKey, filterValue)
                    console.log(filterKey, filterValue)
                    if (ids) setDocIds(ids)
                    else setError("No documents found.")
                } catch {
                    setError("Failed to load document IDs.")
                } finally {
                    setLoading(false)
                }
            })()
    }, [dataSource, filterKey, filterValue])

    const filtered = docIds.filter(id =>
        id.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="docid-card">

            {/* Header */}
            <div className="docid-header">
                <h2 className="docid-title">
                    List of Ids Where
                    <span className="docid-filter-key">{filterKey}</span>
                    <span className="docid-filter-sep"> : </span>
                    <span className="docid-filter-value">{filterValue}</span>
                </h2>
                <div className="docid-underline" />
            </div>

            {loading ? (
                <div className="docid-loading">Loading…</div>
            ) : error ? (
                <div className="docid-error">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            ) : (
                <>
                    {/* Search */}
                    <div className="docid-search-wrap">
                        <span className="docid-search-icon">⌕</span>
                        <input
                            className="docid-search"
                            type="text"
                            placeholder="Search document IDs…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="docid-search-clear" onClick={() => setSearch("")}>×</button>
                        )}
                    </div>

                    {/* List */}
                    <div className="docid-list">
                        {filtered.length === 0 ? (
                            <div className="docid-empty">No results for "{search}"</div>
                        ) : (
                            filtered.map(id => (
                                <DocIdRow key={id} docId={id} onClick={onDocClick} />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="docid-footer">
                        <span className="docid-footer-dot" />
                        <span className="docid-footer-label">
                            {filtered.length} of {docIds.length} documents
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}