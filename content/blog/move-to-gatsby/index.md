---
id: 91sCekmFE
title: Gatsbyでブログを作り直しました
date: "2020-04-19T01:35:21.992+09:00"
description: ""
tags: ["gatsby"]
---

livedoorブログをやめて Gatsby + github pages にブログを移行しました。  

候補としてはGatsbyのほかにHexo,Hugo,jekyll等があったのですが、
使い慣れたnode.js環境で作りたいという点と、Reactが多少分かること、GatsbyのGraphQLを使ったアプローチが
ユニークであったことからGatsbyを選択しました。

Gatsbyについての解説は調べればいくらでもあるので自分は説明しません。  
以下のページが参考になりました。
- [Gatsby + Markdownでブログを作り直しました](https://diff001a.netlify.com/gatsby-blog-with-markdown/)
- [Gatsby で gatsby-theme-blog を使うときの tips](https://gotohayato.com/content/502/)

## やったこと

自分のブログでは[gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog.git)を使いました。

### マークダウンのfront-matterにidとtagsを追加

マークダウンは以下のようになりました。

```yml
---
id: 91sCekmFE
title: Gatsbyでブログを作り直しました
date: "2020-04-18T14:43:03.573Z"
description: ""
tags: ["gatsby"]
---
```

<br>

マークダウンを扱えるようにするgatsby-transformer-remarkプラグインは、Nodeの作成時に全てのfront-matterから項目を取り出して
GraphQLスキーマを作成しているようなのですが、全てのtagsが空の配列であったりtagsが書いてあるmdが1つもない場合などは型推論ができず、
スキーマに登録されません。  
スキーマに登録されていない項目をGraphQLで取得しようとするとcreatePages()でエラーになってしまいます。  
そのため https://www.gatsbyjs.org/docs/schema-customization/#nested-types を参考にして、gatsby-node.jsに以下のコードを追記しました。

```js
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions

  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      tags: [String!]!
    }
  `
  createTypes(typeDefs)
}
```

<br>

### タグページの追加

以下のページを参考にしました。  
[Gatsby で gatsby-theme-blog を使うときの tips](https://gotohayato.com/content/502/#tips-06-タグページ（タグ別の投稿一覧ページ）を作りたい)

<br>

### 記事URL(スラッグ)の変更

gatsby-starter-blogのデフォルトでは /path/to/post という感じのURLだったのですが、これだと
- 記事を管理するためのファイル名がURLになってしまう
- ファイル構成を変更するとURLが変わってしまう
- 記事の日本語タイトルとURL用英語タイトルを考える必要がある
- 後々変な英語が気になっても直しにくい

という点から、front-matterに設定したidとdateを使って /YYYY/MM/DD/id　という形式に変更しました。  
これでファイル名に関してはある程度自由に管理しやすいように決めることができます。

```js
const { DateTime } = require('luxon');

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const date = DateTime.fromISO(node.frontmatter.date).toFormat("yyyy/MM/dd")
    const id = node.frontmatter.id
    const value = `/${date}/${id}`
    
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

```

<br>

### 記事ファイルの自動生成

front-matterのidをURLに使っているので、記事を新しく作るときには必ず一意なidを設定する必要があります。
また、記事を作成したときの日付も自動で入力したいです。

テンプレートから自動でファイルを生成する方法はいろいろあります。
- [Yeoman](https://yeoman.io/), [generator-generator](https://github.com/yeoman/generator-generator)
  - Yeoman用の自作generatorをgenerator-generatorで作成する
- [scaffdog](https://github.com/cats-oss/scaffdog)
  - 1つのマークダウンファイルで複数ファイルのテンプレートを定義できる
- 自作する

初めはscaffdogが良さそうだと思い試したのですが、テンプレート内でevalは使えるものの、
id生成のように外部ライブラリを使いたい場合には向いていないようなので選択肢から外しました。

yeomanにしようかとも思ったのですが、ちょっとしたテンプレートエンジンくらいなら割と手軽に作れそうなので自作することにしました。  
↓のページ  
[うんざりするような下準備をJavaScriptで自動化してラクをする方法](https://www.webprofessional.jp/scaffolding-tool-caporal-js/)  
がとても参考になりました。

仕様自体はscaffdogを参考にして、templateフォルダに置いた以下のようなyamlファイルからファイルを生成するようにしました。
[ソースはこんな感じ](https://github.com/gyojir/blog/blob/2e460f68d23eaeee48fd5ea28587ffdd284c8242/scaffold/create.js)

```yml
variables:
  - name
files:
  - path: content/blog/%name%/index.md
    content: |
      ---
      id: %__id%
      title: %name%
      date: "%__date%"
      description: ""
      tags: []
      ---
```

<br>
<br>

今のところそれなりに満足しています。  
以上です。