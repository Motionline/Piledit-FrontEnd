# Blocks Module
Blocks Moduleは、存在しているBlockに関しての機能を集約したVuex StoreのModuleです。  

## state
### allBlocks
存在している全てのブロックをObject形式で保持します。

#### Block
```json
{
  "blockUniqueKey": {
    "position": {
      "x": "Number",
      "y": "Number"
    },
    "showShadow": "Boolean",
    "topBlockUniqueKey": "String",
    "parentBlockUniqueKey": "String",
    "blockUniqueKey": "String",
    "childBlockUniqueKey": "String",
    "blockType": "String"
  }
}
```

## getters
### allBlocks
state `allBlocks` を返します。

## mutations
### addBlock
ブロックを追加します。

### removeBlock
ブロックを削除します。

### updateBlock
ブロックを更新します。

### addChild
ブロックに親子関係を追加します。

### removeChild
ブロックの親子関係を削除します。

### showShadow
ブロックのconnectAbleを表示します。

### hideShadow
ブロックのconnectAbleを非表示にします。

## actions
### add
blockName, positionを受け取って新しいブロックを追加します。

### remove
blockUniqueKeyを受け取って指定したブロックを削除します。

### update
blockUniqueKeyと更新する要素を受け取って指定したブロックを更新します。

### stopDragging
マウスイベントが停止された時に呼ばれ、親子関係とconnectAbleを処理します。
