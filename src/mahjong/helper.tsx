import type { Tile } from "./core"

export const pullTilesFromString = (line: string, wall: Tile[]) => {
	const tiles: Tile[] = []

	let mode: string = ""
	for (let i = line.length - 1; i >= 0; i--) {
		const ch = line[i]

		const modeIndex = "mspz".indexOf(ch)
		if (modeIndex != -1) mode = ["Man", "Sou", "Pin", "Honor"][modeIndex]
		else {
			const index = parseInt(ch)

			if (mode === "Honor") {
				const tile = wall.find((t) => tiles.indexOf(t) == -1 && t.isHonor && t.index == index)
				// if(!tile) нет тайла

				tiles.push(tile!)
			} else {
				const tile = wall.find((t) => tiles.indexOf(t) == -1 && t.suit == mode && t.index == index)
				// if(!tile) нет тайла

				tiles.push(tile!)
			}
		}
	}

	return tiles.reverse()
}

export const tilesToAmounts = (tiles: Tile[]) => {
	const amounts: number[] = Array(34).fill(0)

	tiles.forEach((tile) => {
		let index = 0

		if (tile.suit == "Man") index = 0
		else if (tile.suit == "Sou") index = 9
		else if (tile.suit == "Pin") index = 18
		else index = 27

		index += tile.index - 1
		amounts[index]++
	})

	return amounts
}
