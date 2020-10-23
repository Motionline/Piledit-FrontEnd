# components
Atomic Designを採用して要素を分割する。ただし、ソフトウェアの性質上、一般的な規約とは異なる規約を設定することがある。  
開発上の注意のために、各レベルのコンポーネントの実装上の留意点をまとめる。

## Atoms
- これ以上分割できない要素を実装する。
- Vuex Storeと接続することを禁止する。

## Molecules
- Atomsを含む、分子的な要素を実装する。
- Vuex Storeと接続することを禁止する。
- **Blockの実装のためにのみ、slotの利用を許容する。**

## Organisms
- Atoms, Moleculesを含む要素を複合的な機能を実装する。
- Vuex Storeと接続することを禁止する。

## Templates
- デスクトップアプリケーションではWebページのように共通レイアウトを持つことが稀であるため、TemplatesをOrganismsを組み合わせた複合的な機能の実装に用いる。
- Vuex Storeとは、**dispatchを行うことのみ**許容する。
- propsを用いてデータを受け取ることを禁止する。

## views (Pages)
- Organisms, Templateを用いた各ページの実装に用いる。
- Vuex Storeを利用可能。
