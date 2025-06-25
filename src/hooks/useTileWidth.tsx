import { useEffect, useState } from "preact/hooks"

export const useTileWidth = () => {
	const calculateWidth = () => {
		const gap = 2
		const bigGap = 12
		const p = 8
		const maxWidth = 48

		return Math.min(maxWidth, (window.innerWidth - p * 2 - gap * 13 - bigGap) / 14)
	}

	const [width, setWidth] = useState(calculateWidth())

	const recalculate = () => setWidth(calculateWidth())

	useEffect(() => {
		recalculate()
		addEventListener("resize", recalculate)
		return () => removeEventListener("resize", recalculate)
	}, [])

	return width
}
