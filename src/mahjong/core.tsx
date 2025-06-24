import { tilesToAmounts } from "./helper"
import { calculateShanten } from "./shanten"
import { calculateUkeire } from "./ukeire"

export class Tile {
	id?: number
	suit: string
	index: number
	dora: boolean
	hint: string
	isHonor: boolean

	constructor(suit: string, index: number, dora: boolean, isHonor: boolean, hint: string) {
		this.suit = suit
		this.index = index
		this.dora = dora
		this.isHonor = isHonor
		this.hint = hint
	}

	getImage() {
		return this.suit + (this.isHonor ? "" : this.index.toString()) + (this.dora ? "-Dora" : "")
	}

	getName() {
		if (this.isHonor) {
			const names = ["Восток", "Юг", "Запад", "Север", "Белый Дракон", "Зеленый Дракон", "Красный Дракон"]
			return names[this.index - 1]
		} else {
			const names: { [id: string]: string } = { Man: "Ман", Sou: "Соу", Pin: "Пин" }

			return `${this.index} ${names[this.suit]}`
		}
	}
}

export const generateWall = (includeHonors = true) => {
	const wall: Tile[] = []

	const addTile = (tile: Tile) => {
		tile.id = wall.length
		wall.push(tile)
	}

	// 1-9 Man + dora
	// 1-9 Sou + dora
	// 1-9 Pin + dora
	const suits = ["Man", "Sou", "Pin"]
	suits.forEach((suit) => {
		for (var i = 1; i <= 9; i++) {
			for (var t = 1; t <= 4; t++) {
				const tile = new Tile(suit, i, i == 5 && t == 4, false, i.toString())
				addTile(tile)
			}
		}
	})

	// Ton (East)
	// Nan (South)
	// Shaa (West)
	// Pei (North)

	// Chun (Red)
	// Hatsu (Green)
	// Haku (White)

	const honors = ["Ton", "Nan", "Shaa", "Pei", "Haku", "Hatsu", "Chun"]
	const honorHints = ["R", "Wh", "G", "E", "S", "W", "N"]

	if (includeHonors)
		honors.forEach((honor, index) => {
			for (var t = 1; t <= 4; t++) {
				const tile = new Tile(honor, index + 1, false, true, honorHints[index])
				addTile(tile)
			}
		})

	// Перемешать стену
	for (let i = wall.length - 1; i > 0; i--) {
		const random = Math.floor(Math.random() * i)
		;[wall[i], wall[random]] = [wall[random], wall[i]]
	}

	return wall
}

export const sortTiles = (tiles: Tile[]) => {
	const order = ["Man", "Sou", "Pin", "Ton", "Nan", "Shaa", "Pei", "Haku", "Hatsu", "Chun"]

	return tiles.sort((a, b) => {
		const entryA = order.findIndex((entry) => entry == a.suit)
		const entryB = order.findIndex((entry) => entry == b.suit)

		if (entryA != entryB) return entryA - entryB
		else if (!a.index) return 0
		else return a.index - b.index!
	})
}

export type DiscardChoice = {
	ukeire: number
	tile: Tile
}
export type DiscardResults = {
	bestUkeire: number
	choices: DiscardChoice[]
	bestChoices: DiscardChoice[]
}

export const calculateDiscardResults = (hand: Tile[], discard: Tile[]) => {
	const currentShanten = calculateShanten(tilesToAmounts(hand))

	const choices: { ukeire: number; tile: Tile }[] = []

	for (let i = 0; i < hand.length; i++) {
		const discardedTile = hand[i]
		const remaining = tilesToAmounts([...discard, ...hand, discardedTile]).map((value) => 4 - value)

		const testedHand = tilesToAmounts(hand.filter((_value, index) => index != i))

		const ukeire = calculateUkeire(testedHand, remaining, currentShanten)

		choices.push({ tile: discardedTile, ukeire })
	}

	choices.sort((a, b) => b.ukeire - a.ukeire)

	const bestUkeire = choices[0].ukeire
	const bestChoices = choices.filter((choice) => choice.ukeire === bestUkeire)

	return {
		bestUkeire,
		choices,
		bestChoices,
	} as DiscardResults
}

export const isHandTenpai = (hand: Tile[]) => {
	const amounts = tilesToAmounts(hand)
	const shanten = calculateShanten(amounts)
	return shanten <= 0
}
