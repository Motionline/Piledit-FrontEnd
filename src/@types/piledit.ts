export type PPosition = {
  x: number;
  y: number;
}

export interface PBlockIF {
  name: string;
  kind: PBlockKind;
  uuid: string;
  topUuid: string;
  parentUuid: string;
  childUuid: string;
  shadow: boolean;
  position: PPosition;
  tabUuid: string;
  path: string;
  shadowPath: string;
  strokeColor: string;
  fillColor: string;
  isSample: boolean;
}

export enum PBlockKind {
  DebugBlock,
  DefineComponentBlock
}

export class PBlock implements PBlockIF {
  public name: string
  public kind: PBlockKind
  public uuid: string
  public topUuid: string
  public parentUuid: string
  public childUuid: string
  public shadow: boolean
  public position: PPosition
  public tabUuid: string
  public path: string
  public shadowPath: string
  public strokeColor: string
  public fillColor: string
  public isSample: boolean

  constructor (
    name: string,
    uuid: string,
    topUuid: string,
    parentUuid: string,
    childUuid: string,
    shadow: boolean,
    position: PPosition,
    tabUuid: string,
    isSample: boolean,
    kind: PBlockKind
  ) {
    this.name = name
    this.kind = kind
    this.uuid = uuid
    this.topUuid = topUuid
    this.parentUuid = parentUuid
    this.childUuid = childUuid
    this.shadow = shadow
    this.position = position
    this.tabUuid = tabUuid
    this.isSample = isSample
    this.shadowPath = ''

    switch (kind) {
      case PBlockKind.DebugBlock:
        this.path = 'm 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 350 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z'
        this.strokeColor = '#c53d43'
        this.fillColor = '#e83929'
        break

      case PBlockKind.DefineComponentBlock:
        this.path = 'm 0,0 c 25,-22 71,-22 96,0 H 300 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z'
        this.strokeColor = '#e9bc00'
        this.fillColor = '#fcc800'
        break

      default:
        throw new Error('登録されていないBlockです')
    }
  }
}

export type PBlocks = {
  [key: string]: PBlock;
}

export interface PComponentIF {
  uuid: string;
  blocks: PBlocks;
}

export class PComponent implements PComponentIF {
  public uuid: string
  public blocks: PBlocks

  constructor (uuid: string, blocks: PBlocks) {
    this.uuid = uuid
    this.blocks = blocks
  }
}

export type PComponents = {
  [key: string]: PComponent;
}

export interface ClipIF {
  uuid: string;
  name: string;
  componentUuid: string;
  position: PPosition;
  width: number;
}

export class PClip implements ClipIF {
  public uuid: string
  public name: string
  public componentUuid: string
  public position: PPosition
  public width: number

  constructor (uuid: string, name: string, componentUuid: string, position: PPosition, width: number) {
    this.uuid = uuid
    this.name = name
    this.componentUuid = componentUuid
    this.position = position
    this.width = width
  }
}

export type PClips = {
  [key: string]: PClip;
}

export interface PTabIF {
  name: string;
  uuid: string;
}

export class PTab implements PTabIF {
  public name: string
  public uuid: string

  constructor (name: string, uuid: string) {
    this.name = name
    this.uuid = uuid
  }
}

export type PTabs = {
  [key: string]: PTab;
}
