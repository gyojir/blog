import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { DateTime } from "luxon"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <Layout location={location}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1 css={styles.title}>
            {post.frontmatter.title}
          </h1>
          <p css={styles.header_p}>
            <span css={styles.date}>
              {DateTime.fromISO(post.frontmatter.date).toFormat("yyyy/MM/dd")}
            </span>

            {post.frontmatter.tags &&
            post.frontmatter.tags.map(tag=> (
              <Link
                key={tag}
                to={`/tags/${tag}/`}
                css={styles.tag}
              >
                {tag}
              </Link>
            ))}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      
      <footer>
        <Bio />
      </footer>

      <nav>
        <ul css={styles.nav}>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        description
        tags
      }
    }
  }
`

const styles = {
  title: {
    marginTop: rhythm(1),
    marginBottom: 0,
  },
  header_p: {
    ...scale(-1 / 5),
    display: `block`,
    marginBottom: rhythm(1),
  },  
  date: {
    marginRight: rhythm(1/2)
  },
  tag: {
    marginRight: rhythm(1/5)
  },
  nav: {
    display: `flex`,
    flexWrap: `wrap`,
    justifyContent: `space-between`,
    listStyle: `none`,
    padding: 0,
  }
}