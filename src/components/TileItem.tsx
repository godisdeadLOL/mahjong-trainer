import { useDarkMode } from "@/hooks/useDarkMode"
import { useTileWidth } from "@/hooks/useTileWidth"
import type { Tile } from "@/mahjong/core"

type TileItemProps = {
	tile: Tile
	onInteract?: (tile: Tile) => void
	offset?: boolean
	className?: string
}
export const TileItem = ({ tile, onInteract = undefined, className="" }: TileItemProps) => {
	const width = useTileWidth()
	const { isDarkMode } = useDarkMode()

	const imageTheme = isDarkMode ? "Regular" : "Black"

	return (
		<div
			style={{ maxWidth: `${width}px` }}
			class={`relative transition-transform hover:-translate-y-1 active:scale-90 duration-300 cursor-pointer select-none ${className}`}
			onClick={() => onInteract?.(tile)}
		>
			<img class="pointer-events-none w-full" src={`${imageTheme}/Front.svg`} />
			<img class="pointer-events-none absolute left-[9%] top-[9%] w-[82%]" src={`${imageTheme}/${tile.getImage()}.svg`} />

			<div class="absolute top-0 right-[5%] text-white font-bold text-stroke stroke">{tile.hint}</div>
			<div class="absolute top-0 right-[5%] text-red-500 font-bold">{tile.hint}</div>
		</div>
	)
}
