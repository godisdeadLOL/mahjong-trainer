import { useEffect, useState } from "preact/hooks"
import type { PlayerTurn } from "@/types"
import { LineBreak } from "@/components/LineBreak"

type TenpaiFeedbackProps = {
	turns: PlayerTurn[]
}
export const TenpaiFeedback = ({ turns }: TenpaiFeedbackProps) => {
	const [score, setScore] = useState<number>()

	useEffect(() => {
		let current = 0
		let best = 0

		turns.forEach((turn) => {
			current += turn.discardResults.choices.find((entry) => entry.tile === turn.discarded)!.ukeire
			best += turn.discardResults.bestUkeire
		})

		setScore(Math.round((100.0 * current) / best))
	}, [turns])

	return (
		<>
			Вы достигли тенпая за {turns.length} сбросов.
			<LineBreak />
			Ваш счет: {score}%.
		</>
	)
}
