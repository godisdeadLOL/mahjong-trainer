import type { Tile, DiscardResults } from "@/mahjong/core"

export type PlayerTurn = {
	prevPulled: Tile
	discarded: Tile
	pulled: Tile
	discardResults: DiscardResults
}

export type GameState = "ongoing" | "tenpai" | "empty_wall"
