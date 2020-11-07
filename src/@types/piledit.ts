export type Position = {
  x: number
  y: number
}

// Block-type
// name: string ブロック名, Debug, DefinitionComponent など
// uuid: 固有ID
// topUuid: 親子関係の頂点Blockの固有ID
// parentUuid: 直上Blockの固有ID
// childUuid: 直下Blockの固有ID
// shadow: Block-Shadowの表示有無
// position: 座標
// tabUuid: そのBlockが存在しているTabの固有ID
export type Block = {
  name: string
  uuid: string
  topUuid: string
  parentUuid: string
  childUuid: string
  shadow: boolean
  position: Position
  tabUuid: string
}

export type Component = {
  uuid: string
  blocks: { [key: string]: Block }
}

export type Clip = {
  uuid: string
  name: string
  componentUuid: string
  position: Position
  width: number
}

export type Tab = {
  name: string
  uuid: string
}
