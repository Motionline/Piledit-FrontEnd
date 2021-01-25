import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store/store'
import { PComponent } from '@/@types/piledit'
import { VuexMixin } from '@/mixin/vuex'
import { SignaturesMixin } from '@/mixin/signatures'

@Module({ store: store, name: 'SignaturesModule', namespaced: true })
export default class Signatures extends VuexModule {
  @Action({ rawError: true })
  public async giveComponentSignature ({ payload }: { payload: PComponent }) {
    const header = { alg: 'HS256', typ: 'JWT' }
    const key = VuexMixin.generateUuid()
    const unsignedToken = `${SignaturesMixin.base64(header)}.${SignaturesMixin.base64(payload)}`
    const signature = SignaturesMixin.HMAC_SHA256(key, unsignedToken)
    return `${unsignedToken}.${signature}`
  }

  @Action({ rawError: true })
  public async verifyComponentSignature ({ jwt, key }: { jwt: string; key: string }) {
    const splits = jwt.split('.')
    const unsignedToken = [splits[0], splits[1]].join('.')
    const signature = splits[2]
    return SignaturesMixin.HMAC_SHA256(key, unsignedToken) === signature
  }
}
