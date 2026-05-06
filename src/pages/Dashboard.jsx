import { useEffect, useState } from "react"
import BucketAnalytics from "../components/charts/BucketAnalytics"
import Navbar from "../components/common/Navbar"
import "../components/styles/Dashboard.css"

// ── Add or remove data sources here freely ────────────────────────────────────
const DATA_SOURCES = [
    { name: "Bucket_Source", icon: "📊" },
    { name: "Bucket_Loader", icon: "📦" },
    { name: "Bucket_Staging", icon: "🗄️" },
    // { name: "Bucket_New", icon: "🗄️" },  ← add more like this
]

function ChartCard({ dataSource, icon, isSelected, onClick }) {
    return (
        <div
            className={`chart-card ${isSelected ? "selected" : ""}`}
            onClick={() => onClick(dataSource)}
        >
            <div className="card-icon">{icon}</div>
            <div className="card-label">{dataSource}</div>
            {isSelected && <div className="card-badge">● Viewing</div>}
        </div>
    )
}

export default function Dashboard() {
    const [selectedBucket, setselectedBucket] = useState(null)

    const handleCardClick = (dataSource) => {
        setselectedBucket(prev => prev === dataSource ? null : dataSource)
    }

    return (
        <div className="dashboard-page">
            {/* Background blobs */}
            <div className="dashboard-blob dashboard-blob-1" />
            <div className="dashboard-blob dashboard-blob-2" />
            <div className="dashboard-blob dashboard-blob-3" />

            <Navbar />

            <div className="dashboard-content">

                {/* Page title */}
                <h1 className="dashboard-title">
                    ⚡ <span>Dashboard</span>
                </h1>

                {/* Chart selector cards */}
                <div className="cards-grid">
                    {DATA_SOURCES.map(({ name, icon }) => (
                        <ChartCard
                            key={name}
                            dataSource={name}
                            icon={icon}
                            isSelected={selectedBucket === name}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>

                {/* Chart display */}
                {selectedBucket && (
                    <div className="chart-section">
                        <div className="chart-section-header">
                            <div className="chart-section-dot" />
                            <span className="chart-section-title">
                                Viewing: {selectedBucket}
                            </span>
                        </div>
                        <BucketAnalytics dataSource={selectedBucket} />
                    </div>
                )}

            </div>
        </div>
    )
}