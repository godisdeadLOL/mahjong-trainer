import { LuCircleCheck, LuCircleX, LuCircleAlert } from "react-icons/lu"
import { TooltipText } from "@/components/TooltipText"
import type { DiscardChoice } from "@/mahjong/core"
import type { PlayerTurn } from "@/types"
import { LineBreak } from "@/components/LineBreak"

const DiscardChoice = ({ choice, showUkeire = true }: { choice: DiscardChoice; showUkeire?: boolean }) => {
	return (
		<>
			{choice.tile.getName()}
			{showUkeire && (
				<>
					{" "}
					(<TooltipText tooltip="Число тайлов улучшающих руку">{choice.ukeire}</TooltipText>)
				</>
			)}
		</>
	)
}

const RatingBlock = ({ className, children }: any) => <div class={`flex items-center justify-center gap-2 ${className}`}>{children}</div>

const BestTurnRating = () => (
	<RatingBlock className="text-green-500">
		<LuCircleCheck /> Лучший ход
	</RatingBlock>
)

const AverageTurnRating = () => (
	<RatingBlock className="text-orange-500">
		<LuCircleAlert /> Не лучший ход
	</RatingBlock>
)

const WorstTurnRating = () => (
	<RatingBlock className="text-red-500">
		<LuCircleX /> Худший ход
	</RatingBlock>
)

export const TurnFeedback = ({ playerTurn }: { playerTurn: PlayerTurn }) => {
	const currentChoice = playerTurn.discardResults.choices.find((entry) => entry.tile === playerTurn.discarded)!

	type Rating = "best" | "worst" | "average"
	const rating: Rating = currentChoice.ukeire === playerTurn.discardResults.bestUkeire ? "best" : currentChoice.ukeire === 0 ? "worst" : "average"

	return (
		<>
			{/* Оценка хода */}
			{rating === "best" && <BestTurnRating />}
			{rating === "worst" && <WorstTurnRating />}
			{rating === "average" && <AverageTurnRating />}

			{/* Текущий сброс */}
			<div class="mt-4">
				Вы сбросили <DiscardChoice choice={currentChoice} showUkeire={rating !== "worst"} />.
				{rating === "worst" && (
					<>
						<LineBreak /> <TooltipText tooltip="Кол-во тайлов до тенпая">Шантен</TooltipText> руки увеличен.
					</>
				)}
			</div>

			{/* Лучшие сбросы */}
			{rating !== "best" && (
				<div class="mt-4 sm:mt-0">
					Лучшие сбросы:
					<LineBreak />
					{playerTurn.discardResults.bestChoices.map((choice, index) => (
						<>
							{index > 0 && ", "}
							<DiscardChoice choice={choice} />
						</>
					))}
					{"."}
				</div>
			)}
		</>
	)
}
