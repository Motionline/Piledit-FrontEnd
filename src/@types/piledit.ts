export type Position = {
  x: number
  y: number
}

export type Block = {
  position: Position
  blockType: string
  showShadow: boolean
  childBlockUniqueKey: string
  blockUniqueKey: string
  parentBlockUniqueKey: string
  topBlockUniqueKey: string
}

export type BlockComponent = {
  componentUniqueKey: string
}

export type ComponentObject = {
  componentObjectUniqueKey: string
  componentUniqueKey: string
  position: Position
  width: number
}
