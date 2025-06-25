import type { Tile } from "@/mahjong/core";
import { TileItem } from "@/components/TileItem";


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
				<TileItem className={`${lastTileOffset && index == 13 && "ml-[12px]"}`} onInteract={onInteract} key={tile.id} tile={tile} />
			))}
		</div>
	)
}
