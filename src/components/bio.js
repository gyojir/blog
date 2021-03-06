/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/gyo.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div>      
      <hr style={{marginTop: rhythm(3)}}/>          
      <div style={{display: `flex`}}>
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author.name}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            minWidth: 50,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
        <p>
          <strong>{author.name}</strong>
          <br/>
          {author.summary}
          <br/>
          <a style={{marginRight: rhythm(1/2)}} href={`https://gyojir.com/`}>gyojir.com</a>
          <a style={{marginRight: rhythm(1/2)}} href={`https://twitter.com/${social.twitter}`}>twitter</a>
        </p>
      </div>
    </div>
  )
}

export default Bio
