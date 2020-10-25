import Vue from 'vue'

export class VuexMixin extends Vue {
  public test1 = 10
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
}
