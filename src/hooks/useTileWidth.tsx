import { useEffect, useState } from "preact/hooks"

export const useTileWidth = () => {
	const [width, setWidth] = useState(48)

	const recalculate = () => {
		const gap = 2
		const bigGap = 12
		const p = 8
		const maxWidth = 48

		const value = Math.min(maxWidth, (window.innerWidth - p * 2 - gap * 13 - bigGap) / 14)
		setWidth(value)
	}

	useEffect(() => {
		recalculate()
		addEventListener("resize", recalculate)
		return () => removeEventListener("resize", recalculate)
	}, [])

	return width
}
