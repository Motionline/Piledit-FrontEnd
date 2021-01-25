import Vue from 'vue'
import crypto from 'crypto'

export class SignaturesMixin extends Vue {
  static base64 (json: any) {
    const jsonStr = JSON.stringify(json)
    const jsonB64 = Buffer.from(jsonStr).toString('base64')
    return jsonB64.replace(/={1,2}$/, '')
  }

  static HMAC_SHA256 (key: any, data: any) {
    const hash = crypto.createHmac('sha256', key).update(data).digest('base64')
    return hash.replace(/={1,2}$/, '')
  }
}
