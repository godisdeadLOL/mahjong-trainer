import { useEffect, useState } from "preact/hooks"
import { generateWall, sortTiles, calculateDiscardResults, type DiscardResults, Tile, type DiscardChoice, isHandTenpai } from "./mahjong/core"
import { pullTilesFromString } from "./mahjong/helper"
import { LuCircleAlert, LuCircleCheck, LuCircleX, LuRotateCcw, LuSun } from "react-icons/lu"
import { TileItem } from "./components/TileItem"
import { useDarkMode } from "./hooks/useDarkMode"

type TileGroupProps = {
	tiles: Tile[]
	onInteract?: (tile: Tile) => void
	lastTileOffset?: boolean
	className?: string
}
export const TileGroup = ({ className = "", tiles, onInteract, lastTileOffset = false }: TileGroupProps) => {
	return (
		<div class={`flex gap-0.5 ${className}`}>
			{tiles.map((tile, index) => (
				<TileItem offset={lastTileOffset && index == 13} onInteract={onInteract} key={tile.id} tile={tile} />
			))}
		</div>
	)
}

export const TooltipText = ({ text, message }: any) => {
	return (
		<span class="relative select-none underline group">
			{text}
			<div class="hidden text-center group-hover:block group-active:block absolute left-[50%] top-0 px-4 py-2 bg-background-elevate border-1 border-border rounded-xl -translate-y-[105%] -translate-x-[50%]">
				{message}
			</div>
		</span>
	)
}

export const AppBar = ({ onRestart }: any) => {
	const { isDarkMode, setIsDarkMode} = useDarkMode()

	return (
		<div class="flex gap-2 mx-4 mb-8">
			<button class="button py-1 px-4" onClick={onRestart}>
				новая рука
			</button>

			<button class="ml-auto button p-2" onClick={() => setIsDarkMode(!isDarkMode)}>
				<LuSun />
			</button>
		</div>
	)
}

const DiscardChoiceFeedback = ({ choice, showUkeire = true }: { choice: DiscardChoice; showUkeire?: boolean }) => {
	return (
		<>
			{choice.tile.getName()}
			{showUkeire && (
				<>
					{" ("}
					<TooltipText text={choice.ukeire} message="Число тайлов улучшающих руку" />
					{")"}
				</>
			)}
		</>
	)
}

const Feedback = ({ playerTurn }: { playerTurn: PlayerTurn }) => {
	const currentChoice = playerTurn.discardResults.choices.find((entry) => entry.tile === playerTurn.discarded)!

	type Rating = "best" | "worst" | "average"
	const rating: Rating = currentChoice.ukeire === playerTurn.discardResults.bestUkeire ? "best" : currentChoice.ukeire === 0 ? "worst" : "average"

	const RatingBlock = ({ className, children }: any) => <div class={`flex items-center justify-center gap-2 mb-2 ${className}`}>{children}</div>

	return (
		<>
			{rating === "best" && (
				<RatingBlock className="text-green-500">
					<LuCircleCheck /> Лучший ход
				</RatingBlock>
			)}

			{rating === "worst" && (
				<RatingBlock className="text-red-500">
					<LuCircleX /> Плохой ход
				</RatingBlock>
			)}

			{rating === "average" && (
				<RatingBlock className="text-orange-500">
					<LuCircleAlert /> Не лучший ход
				</RatingBlock>
			)}

			{/* Текущий сброс */}
			<div>
				Вы сбросили <DiscardChoiceFeedback choice={currentChoice} showUkeire={rating !== "worst"} />.
				<br class="sm:hidden" /> {/* {rating === "best" && "Это лучший ход."} */}
				{rating === "worst" && (
					<>
						<TooltipText text="Шантен" message="Кол-во тайлов до тенпая" /> руки увеличен.
					</>
				)}
			</div>

			{/* Лучшие сбросы */}
			{rating !== "best" && (
				<div class="mt-4 sm:mt-0">
					Лучшие сбросы: <br class="sm:hidden" />
					{playerTurn.discardResults.bestChoices.map((choice, index) => (
						<>
							{index > 0 && ", "}
							<DiscardChoiceFeedback choice={choice} />
						</>
					))}
					{"."}
				</div>
			)}
		</>
	)
}

type PlayerTurn = {
	prevPulled: Tile
	discarded: Tile
	pulled: Tile
	discardResults: DiscardResults
}

type GameState = "ongoing" | "tenpai" | "empty_wall"

export function App() {
	const [wall, setWall] = useState<Tile[]>(generateWall(false))
	const [hand, setHand] = useState<Tile[]>([])
	const [discard, setDiscard] = useState<Tile[]>([])

	const [turns, setTurns] = useState<PlayerTurn[]>([])
	const [gameState, setGameState] = useState<GameState>("ongoing")
	const [score, setScore] = useState<number | null>(null)

	const handString = new URLSearchParams(window.location.search).get("hand")

	const recalculateScore = () => {
		let current = 0
		let best = 0

		turns.forEach((turn) => {
			current += turn.discardResults.choices.find((entry) => entry.tile === turn.discarded)!.ukeire
			best += turn.discardResults.bestUkeire
		})

		setScore(Math.round((100.0 * current) / best))
	}

	const discardTile = (tile: Tile) => {
		if (gameState !== "ongoing") return

		// проверить руку на тенпай после сброса
		const currentHand = hand.filter((t) => t !== tile)
		if (isHandTenpai(currentHand)) {
			setGameState("tenpai")
			setHand(sortTiles(currentHand))
			recalculateScore()
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
		setScore(null)
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
				<TileGroup className="flex-wrap px-8 max-w-lg mx-auto" tiles={discard} />
			</div>
			<div class="pt-8">
				<TileGroup className="px-2 justify-center" tiles={hand} onInteract={discardTile} lastTileOffset={true} />

				<div class="mt-8 px-8 flex flex-col items-center font-mono text-center select-none">
					{turns.length > 0 ? (
						<>
							<div class="select-none">
								{gameState === "ongoing" && <Feedback playerTurn={turns[turns.length - 1]} />}
								{gameState === "empty_wall" && "Стена пуста."}
								{gameState === "tenpai" && `Вы достигли тенпая. Ваш счет: ${score}%.`}
							</div>

							{gameState !== "tenpai" && (
								<button onClick={cancelLastTurn} class="mt-4 p-2 button">
									<LuRotateCcw />
								</button>
							)}
						</>
					) : (
						"Выберите любой тайл для сброса."
					)}
				</div>
			</div>
		</>
	)
}
