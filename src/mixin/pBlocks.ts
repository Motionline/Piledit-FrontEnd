import Vue from 'vue'
import {
  PBlock,
  PBlockKind,
  PPosition,
  TBlurFilterBlock,
  TDebugBlock,
  TDefineComponentBlock,
  TGrayScaleFilterBlock,
  TMovieLoadingBlock,
  TPropBlock,
  TPropsBlock, TVariableBlock
} from '@/@types/piledit'

function getPBlockInit () {
  return {
    topUuid: '',
    parentUuid: '',
    childUuid: '',
    shadow: false
  }
}

export class PBlocksMixin extends Vue {
  static newPBlock ({ name, uuid, position, componentUuid, projectUuid, kind, isSample }: {
    name: string;
    uuid: string;
    position: PPosition;
    componentUuid: string;
    projectUuid: string;
    kind: PBlockKind;
    isSample: boolean;
  }): PBlock {
    const { topUuid, parentUuid, childUuid, shadow } = getPBlockInit()
    const init = {
      name, kind, uuid, topUuid, parentUuid, childUuid, shadow, position, componentUuid, projectUuid, isSample
    }
    if (kind === PBlockKind.DebugBlock) {
      return new TDebugBlock(init)
    } else if (kind === PBlockKind.DefineComponentBlock) {
      return new TDefineComponentBlock(init)
    } else if (kind === PBlockKind.MovieLoadingBlock) {
      return new TMovieLoadingBlock(init)
    } else if (kind === PBlockKind.GrayScaleFilterBlock) {
      return new TGrayScaleFilterBlock(init)
    } else if (kind === PBlockKind.BlurFilterBlock) {
      return new TBlurFilterBlock(init)
    } else if (kind === PBlockKind.PropBlock) {
      return new TPropBlock(init)
    } else if (kind === PBlockKind.PropsBlock) {
      return new TPropsBlock(init)
    } else if (kind === PBlockKind.VariableBlock) {
      return new TVariableBlock(init)
    } else {
      throw new Error('登録されていないブロックです')
    }
  }
}
