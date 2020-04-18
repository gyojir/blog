import React from "react"

import TagList from "../components/tag-list"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const TagsPage = ({ data, location }) => {
  return (
    <Layout location={location}>
      <SEO title="tags"/>
      <article>
        <header>
          <h1>タグ一覧</h1>
        </header>
        <TagList/>
        
      <footer>
        <Bio />
      </footer>
      </article>
    </Layout>
  )
}

export default TagsPage
