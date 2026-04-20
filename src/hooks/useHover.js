import { useState } from "react"

export const useHover = () => {
    const [hovered, setHovered] = useState(false)
    return {
        hovered,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
    }
}