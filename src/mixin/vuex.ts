import Vue from 'vue'
import {
  PBlock,
  PBlockKind,
  PBlocks,
  PPosition
} from '@/@types/piledit'

export class VuexMixin extends Vue {
  static generateUuid (): string {
    const material = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
    for (let i = 0, len = material.length; i < len; i++) {
      if (material[i] === 'x') {
        material[i] = Math.floor(Math.random() * 16).toString(16)
      } else if (material[i] === 'y') {
        material[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
      }
    }
    return material.join('')
  }

  static isNearbyBlocks (position1: PPosition, position2: PPosition): boolean {
    const isNearbyX1 = (position1.x - position2.x) <= 80
    const isNearbyX2 = (position1.x - position2.x) >= -160
    const isNearbyY1 = (position2.y - position1.y) <= 65
    const isNearbyY2 = (position2.y - position1.y) >= 30
    return isNearbyX1 && isNearbyX2 && isNearbyY1 && isNearbyY2
  }

  static calcHeight (kind: PBlockKind): number {
    return 38
  }

  // 子Blocksを全て返す
  static searchChildrenOfBlock (topBlock: PBlock, blocks: PBlocks): PBlocks {
    const blocksFamily: PBlocks = {}
    let searchedBlock: PBlock = topBlock
    while (true) {
      blocksFamily[searchedBlock.uuid] = searchedBlock
      if (searchedBlock.childUuid === '') break
      searchedBlock = blocks[searchedBlock.childUuid]
    }
    return blocksFamily
  }
}
