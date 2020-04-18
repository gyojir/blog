import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import TagList from "./tag-list"
import { scale } from "../utils/typography"

const Sidebar = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 5) {
        edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date
              title
            }
          }
        }
      }
    }
  `)
  const posts = data.allMarkdownRemark.edges

  return (
    <div style={{...scale(-1/5)}}>
      <div>
        <h3>最近の投稿</h3>
        <ul>
          {posts.map(({node}) => (
            <li key={node.fields.slug}>
              <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                {node.frontmatter.title || node.fields.slug}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>タグ</h3>
        <TagList/>
      </div>
    </div>
  )
}

export default Sidebar