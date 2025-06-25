import { useEffect, useState } from "preact/hooks"
import { generateWall, sortTiles, calculateDiscardResults, Tile, isHandTenpai } from "@/mahjong/core"
import { pullTilesFromString } from "@/mahjong/helper"
import { LuRotateCcw } from "react-icons/lu"
import { AppBar } from "@/page/AppBar"
import type { GameState, PlayerTurn } from "@/types"
import { TileGroup } from "@/components/TileGroup"
import { TurnFeedback } from "@/page/TurnFeedback"
import { TenpaiFeedback } from "@/page/TenpaiFeedback"

export function App() {
	const [wall, setWall] = useState<Tile[]>(generateWall(false))
	const [hand, setHand] = useState<Tile[]>([])
	const [discard, setDiscard] = useState<Tile[]>([])

	const [turns, setTurns] = useState<PlayerTurn[]>([])
	const [gameState, setGameState] = useState<GameState>("ongoing")

	const handString = new URLSearchParams(window.location.search).get("hand")

	const discardTile = (tile: Tile) => {
		if (gameState !== "ongoing") return

		// проверить руку на тенпай после сброса
		const currentHand = hand.filter((t) => t !== tile)
		if (isHandTenpai(currentHand)) {
			setGameState("tenpai")
			setHand(sortTiles(currentHand))
			return
		}

		const prevPulled = hand[hand.length - 1]
		const pulled = wall[0]

		const discardResults = calculateDiscardResults(hand, discard)

		// сбросил tile (удалил с руки, добавил в сброс)
		// достал pulled (удалил со стены, добавил в руку)

		setWall((tiles) => tiles.slice(1))
		setDiscard((tiles) => [...tiles, tile])
		setHand((tiles) => [...sortTiles(tiles.filter((t) => t !== tile)), pulled])

		const turn: PlayerTurn = { discarded: tile, prevPulled, pulled, discardResults }
		setTurns((turns) => [...turns, turn])
	}

	const cancelLastTurn = () => {
		const turn = turns[turns.length - 1]

		// вернуть сброшенный тайл на руку, удалить полученный тайл с руки, удалить предыдущий полученный тайл и поместить его поверх руки
		setHand((tiles) => [...sortTiles([...tiles, turn.discarded].filter((t) => t !== turn.pulled && t !== turn.prevPulled)), turn.prevPulled])

		setWall((tiles) => [turn.pulled, ...tiles]) // вернуть сброшенный тайл на стену
		setDiscard((tiles) => tiles.slice(0, -1)) // удалить последний тайл из сброса

		setTurns((turns) => turns.slice(0, -1))

		setGameState("ongoing")
	}

	const restartHand = () => {
		const wall = generateWall(false)

		const pulled = wall.slice(0, 14)
		setHand([...sortTiles(pulled.slice(0, -1)), pulled[pulled.length - 1]])
		setWall(wall.slice(14))

		setGameState("ongoing")
		setTurns([])
		setDiscard([])
	}

	useEffect(() => {
		if (wall.length === 0) setGameState("empty_wall")
	}, [wall])

	// начальная рука
	useEffect(() => {
		if (hand.length > 0) return

		if (!!handString) {
			const pulled = pullTilesFromString(handString!, wall)
			setHand([...sortTiles(pulled.slice(0, -1)), pulled[pulled.length - 1]])
			setWall((tiles) => tiles.filter((t) => pulled.indexOf(t) == -1))
		} else restartHand()
	}, [])

	return (
		<>
			<div class="min-h-1/2 pt-4">
				<AppBar onRestart={restartHand} />
				<TileGroup className="flex-wrap mt-8 px-8 max-w-lg mx-auto" tiles={discard} />
			</div>

			<div class="pt-8">
				<TileGroup className="px-2 justify-center" tiles={hand} onInteract={discardTile} lastTileOffset={true} />

				<section class="text-center mt-4">
					{turns.length == 0 && "Выберите тайл для сброса."}
					{gameState === "ongoing" && turns.length > 0 && <TurnFeedback playerTurn={turns[turns.length - 1]} />}
					{gameState === "empty_wall" && "Стена пуста."}
					{gameState === "tenpai" && <TenpaiFeedback turns={turns} />}

					{gameState !== "tenpai" && turns.length > 0 && (
						<button onClick={cancelLastTurn} class="block mx-auto mt-4 p-2 button">
							<LuRotateCcw />
						</button>
					)}
				</section>
			</div>
		</>
	)
}
