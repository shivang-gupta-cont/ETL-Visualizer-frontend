import { useEffect, useState } from "react"
import PieChart from "./PieChart"
import DocIdList from "./DocIdList"
import WholeDocView from "./WholeDocView"
import "../styles/BucketAnalytics.css"

// ── Navigation Stack ──────────────────────────────────────────────────────────
// stack shape:
//   [0] { view: "chart" }
//   [1] { view: "docList", key: "dsaType", value: "TypeA" }
//   [2] { view: "docDetail", docId: "abc123" }

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ stack, dataSource, onPopTo }) {
    return (
        <nav className="ba-breadcrumb">
            {stack.map((item, i) => {
                const isLast = i === stack.length - 1

                const label =
                    item.view === "chart" ? dataSource :
                        item.view === "docList" ? `${item.key} : ${item.value}` :
                            item.view === "docDetail" ? item.docId :
                                item.view

                return (
                    <span key={i} className="ba-breadcrumb-segment">
                        {i > 0 && <span className="ba-breadcrumb-sep">›</span>}
                        <button
                            className={`ba-breadcrumb-btn ${isLast ? "active" : ""}`}
                            onClick={() => !isLast && onPopTo(i)}
                            disabled={isLast}
                            title={isLast ? "Current view" : `Go back to ${label}`}
                        >
                            {item.view === "chart" && <span className="ba-bc-icon">◉</span>}
                            {item.view === "docList" && <span className="ba-bc-icon">≡</span>}
                            {item.view === "docDetail" && <span className="ba-bc-icon">□</span>}
                            {label}
                        </button>

                        {/* Independent close — visible on every non-root segment */}
                        {i > 0 && (
                            <button
                                className="ba-breadcrumb-close"
                                onClick={() => onPopTo(i - 1)}
                                title={`Close ${label}`}
                            >
                                ×
                            </button>
                        )}
                    </span>
                )
            })}
        </nav>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BucketAnalytics({ dataSource }) {
    const [stack, setStack] = useState([{ view: "chart" }])

    // Push a new view onto the stack (sequential open)
    const push = (view, data = {}) => {
        if (view === "chart") return;
        else if (view === "docList") {
            popTo(0)
            setStack(prev => [...prev, { view, ...data }])
        } else if (view === "docDetail") {
            popTo(1)
            setStack(prev => [...prev, { view, ...data }])
        }
        return;
    }

    // Pop back to any index (independent close)
    const popTo = (index) =>
        setStack(prev => prev.slice(0, index + 1))

    useEffect(() => {
        // runs whenever dataSource changes
        setStack([{ view: "chart" }])   // reset stack back to chart view
    }, [dataSource])

    return (
        <div className="bucket-analytics">

            {/* Breadcrumb nav */}
            <Breadcrumb
                stack={stack}
                dataSource={dataSource}
                onPopTo={popTo}
            />

            {/* View renderer */}
            <div className="ba-view">
                {stack.map((item, i) => (
                    <div key={i}>
                        {item.view === "chart" && (
                            <PieChart
                                dataSource={dataSource}
                                onSliceClick={(key, value) =>
                                    push("docList", { key, value })
                                }
                            />
                        )}

                        {item.view === "docList" && (
                            <DocIdList
                                dataSource={dataSource}
                                filterKey={item.key}
                                filterValue={item.value}
                                onDocClick={(docId) =>
                                    push("docDetail", { docId })
                                }
                            />
                        )}

                        {item.view === "docDetail" && (
                            <WholeDocView
                                dataSource={dataSource}
                                docId={item.docId}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}