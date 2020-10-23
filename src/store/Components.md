# Components Module
Components Moduleは、存在しているComponentに関しての機能を集約したVuex StoreのModuleです。  

## state
### allComponents
存在している全てのコンポーネントをObject形式で保持します。  

#### Component
```json
{
  "componentUniqueKey": {
    "blocks": [
      { "blockType": "String", "value": {} },
      { "blockType": "String", "value": {} },
      { "blockType": "String", "value": {} }
    ]
  }
}
```

componentUniqueKeyは各コンポーネントごとに固有の値を持ちます。  
blocksは、ブロックの種類であるblockTypeと、そのパラメータの値のObjectであるvalueを持つオブジェクトを要素にもつ配列です。  
componentsではblocks/blockが利用されないので（componentに座標情報や親子関係は必要ないため）、blockUniqueKeyが利用されることはありません。  
しかし、componentUniqueKeyはTimeline Moduleで再利用されるので注意しなければなりません。
