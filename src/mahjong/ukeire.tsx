import { calculateShanten } from "./shanten"

export const calculateUkeire = (tiles: number[], remaining: number[], currentShanten: number) => {
	let ukeire = 0

	for (let i = 0; i < tiles.length; i++) {
		tiles[i]++
		if (calculateShanten(tiles) < currentShanten) ukeire += remaining[i]
		tiles[i]--
	}

	return ukeire
}
