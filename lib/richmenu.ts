import data from "@/line/richmenu.tiles.json";

/**
 * リッチメニューの定義。実体は line/richmenu.tiles.json にあり、
 * 原画ページ(app/line-richmenu)と登録スクリプト(line/setup.mjs)が同じものを読む。
 */
export type RichMenuTile = {
  key: string;
  icon: string;
  accent?: boolean;
  label: string;
};

export const RICH_MENU_SIZE = data.size;
export const RICH_MENU_TILES: RichMenuTile[] = data.tiles;
