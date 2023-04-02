import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"

const TagList = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        group(field: {frontmatter: {tags: SELECT}}){   
          name: fieldValue
          totalCount
        }
      }
    }
  `)

  const tags = data.allMarkdownRemark.group

  return (
    <ul>
      {tags.map(tag=>(
        <li key={tag.name}>
          <Link to={`/tags/${tag.name}/`}>
            {`${tag.name} (${tag.totalCount})`}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default TagList
