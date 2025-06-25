import { LuSun } from "react-icons/lu"
import { useDarkMode } from "@/hooks/useDarkMode"

export const AppBar = ({ onRestart }: any) => {
	const { isDarkMode, setIsDarkMode } = useDarkMode()

	return (
		<nav class="flex gap-2 px-4">
			<button class="button py-1 px-4" onClick={onRestart}>
				новая рука
			</button>

			<button class="ml-auto button p-2" onClick={() => setIsDarkMode(!isDarkMode)}>
				<LuSun />
			</button>
		</nav>
	)
}
