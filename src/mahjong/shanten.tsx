export const calculateShanten = (tiles: number[]) => {
	return Math.min(calculateAllPairsShanten(tiles), calculateAllTerminalsShanten(tiles), calculateStandardShanten(tiles))
}

const calculateAllPairsShanten = (tiles: number[]) => {
	let pairs = 0
	let unique = 0

	for (let i = 0; i < tiles.length; i++) {
		if (tiles[i] == 0) continue
		unique++
		if (tiles[i] >= 2) pairs++
	}

	let shanten = 6 - pairs
	if (unique < 7) shanten += 7 - unique

	return shanten
}

const calculateAllTerminalsShanten = (tiles: number[]) => {
	let unique = 0
	let pair = 0

	for (let i = 0; i < tiles.length; i++) {
		if (tiles[i] == 0) continue

		if (i % 9 == 0 || i % 9 == 8 || i >= 27) {
			unique++

			if (tiles[i] >= 2) pair = 1
		}
	}

	return 13 - unique - pair
}

type ShantenCalculationContext = {
	tiles: number[] // 9 ман + 9 соу + 9 пин + 4 ветра + 3 драконы = 34

	completedSets: number
	partialSets: number
	pairs: number

	bestShanten: number
}
const calculateStandardShanten = (tiles: number[]) => {
	const context: ShantenCalculationContext = {
		tiles,
		completedSets: 0,
		partialSets: 0,
		pairs: 0,
		bestShanten: 8,
	}

	for (let i = 0; i < tiles.length; i++) {
		if (tiles[i] >= 2) {
			tiles[i] -= 2
			context.pairs++

			removeCompletedSets(context, 0)

			tiles[i] += 2
			context.pairs--
		}
	}

	removeCompletedSets(context, 0)

	return context.bestShanten
}

const removeCompletedSets = (context: ShantenCalculationContext, index: number) => {
	if (context.bestShanten <= -1) return

	while (index < context.tiles.length && context.tiles[index] == 0) index++

	if (index == context.tiles.length) {
		removePartialSets(context, 0)
		return
	}

	// пон
	if (context.tiles[index] >= 3) {
		context.completedSets++
		context.tiles[index] -= 3

		removeCompletedSets(context, index)

		context.completedSets--
		context.tiles[index] += 3
	}

	// чи
	if (index < 27 && index % 9 < 7 && context.tiles[index + 1] > 0 && context.tiles[index + 2] > 0) {
		context.completedSets++
		context.tiles[index]--
		context.tiles[index + 1]--
		context.tiles[index + 2]--

		removeCompletedSets(context, index)

		context.completedSets--
		context.tiles[index]++
		context.tiles[index + 1]++
		context.tiles[index + 2]++
	}

	removeCompletedSets(context, index + 1)
}

const removePartialSets = (context: ShantenCalculationContext, index: number) => {
	if (context.bestShanten <= -1) return

	while (index < context.tiles.length && context.tiles[index] == 0) index++

	if (index == context.tiles.length) {
		const shanten = 8 - context.completedSets * 2 - context.partialSets - context.pairs
		if (shanten < context.bestShanten) context.bestShanten = shanten

		return
	}

	if (context.completedSets + context.partialSets < 4) {
		// пара
		if (context.tiles[index] == 2) {
			context.partialSets++
			context.tiles[index] -= 2
			removePartialSets(context, index)
			context.partialSets--
			context.tiles[index] += 2
		}

		// открытое или крайнее ожидание
		if (index < 27 && index % 9 < 8 && context.tiles[index + 1] > 0) {
			context.partialSets++
			context.tiles[index]--
			context.tiles[index + 1]--
			removePartialSets(context, index)
			context.partialSets--
			context.tiles[index]++
			context.tiles[index + 1]++
		}

		// закрытое ожидание
		if (index < 27 && index % 9 < 7 && context.tiles[index + 2] > 0) {
			context.partialSets++
			context.tiles[index]--
			context.tiles[index + 2]--
			removePartialSets(context, index)
			context.partialSets--
			context.tiles[index]++
			context.tiles[index + 2]++
		}
	}

	removePartialSets(context, index + 1)
}
