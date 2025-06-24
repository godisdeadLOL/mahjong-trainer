import { useDarkMode } from "../hooks/useDarkMode"
import { useTileWidth } from "../hooks/useTileWidth"
import type { Tile } from "../mahjong/core"

type TileItemProps = {
	tile: Tile
	onInteract?: (tile: Tile) => void
	offset?: boolean
}
export const TileItem = ({ tile, onInteract = undefined, offset = false }: TileItemProps) => {
	const width = useTileWidth()
	const { isDarkMode } = useDarkMode()

	const imageTheme = isDarkMode ? "Regular" : "Black"

	return (
		<div
			style={{ maxWidth: `${width}px` }}
			class={`relative ${offset ? "ml-[12px]" : ""} transition-transform hover:-translate-y-1 active:scale-90 duration-300 cursor-pointer select-none`}
			onClick={() => onInteract?.(tile)}
		>
			<img class="pointer-events-none w-full" src={`${imageTheme}/Front.svg`} />
			<img class="pointer-events-none absolute left-[5%] top-[5%] w-[90%]" src={`${imageTheme}/${tile.getImage()}.svg`} />
			{/* <div style={{ position: "absolute", right: "5%", top: "2%", color: "red", fontWeight: "bold", fontFamily: "monospace", outline: "5px" }}>{tile.hint}</div> */}
		</div>
	)
}
