import type { Tile } from "./core"
import { tilesToAmounts } from "./helper"
import { calculateShanten } from "./shanten"

export const testMahjong = (tiles: Tile[]) => {
	let start = Date.now()

	const amounts = tilesToAmounts(tiles)
	const shanten = calculateShanten(amounts)

	let diff = (Date.now() - start) / 1000.0
	console.log("value", shanten, "time", diff)
}
