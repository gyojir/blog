import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const TagsPage = ({ data, location }) => {
  const tags = data.allMarkdownRemark.group
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="tags"/>
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: rhythm(1/2),
            }}
          >
            タグ一覧
          </h1>
        </header>
        <ul>
          {tags.map(tag=>(
            <li key={tag.name}>
              <Link to={`/tags/${tag.name}/`}>
                {`${tag.name} (${tag.totalCount})`}
              </Link>
            </li>
          ))}
        </ul>
        
      <footer>
        <Bio />
      </footer>
      </article>
    </Layout>
  )
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      group(field: frontmatter___tags){   
        name: fieldValue
        totalCount
      }
    }
  }
`
