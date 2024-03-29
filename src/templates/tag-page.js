import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { rhythm } from "../utils/typography"

const TagPageTemplate = ({ data, pageContext, location }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location}>
      <Seo title={pageContext.tag}/>
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: rhythm(1/2),
            }}
          >
            タグ： {pageContext.tag}
          </h1>
        </header>
        <ul>
          {posts.map(post=>(
            <li key={post.node.id}>
              <Link to={post.node.fields.slug}>
                {post.node.frontmatter.title}
              </Link>
            </li>
          ))}
        </ul>
      </article>
      
      <footer>
        <Bio />
      </footer>
    </Layout>
  )
}

export default TagPageTemplate

export const pageQuery = graphql`
  query TagPageByTag($tag: String!) {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}, filter: {frontmatter: {tags: {eq: $tag}}}) {
      edges {
        node {
          id
          fields{
            slug
          }
          frontmatter {
            title
            description
            tags
          }
        }
      }
    }
  }
`
