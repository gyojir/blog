import React from "react"
import { Link, useStaticQuery } from "gatsby"
import { css } from "@emotion/core"

import { rhythm, scale } from "../utils/typography"
import Sidebar from "./sidebar"

const Layout = ({ location, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div css={styles.root}>
      <header>
        <h1 css={styles.header}>
          <Link css={styles.header_link} to={`/`}>
            {data.site.siteMetadata.title}
          </Link>
        </h1>
      </header>
      <div css={styles.container}>
        <main css={styles.main}>
          {children}
        </main>
        <nav css={styles.sidebar}>
          <Sidebar/>
        </nav>
      </div>
      <footer>
        Â© {new Date().getFullYear()} gyojir
      </footer>
    </div>
  )
}

const media_max = `768px`;

const styles = {
  header: {
    ...scale(1.2),
    marginBottom: rhythm(1.5),
    marginTop: 0,
    paddingBottom: rhythm(1),
  },
  header_link: {
      boxShadow: `none`,
      color: `inherit`,
  },
  root: {
    marginLeft: `auto`,
    marginRight: `auto`,
    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
    maxWidth: rhythm(40),
  },
  container: [
    {display: `flex`},
    css`
    @media (max-width: ${media_max}) {
      flex-direction: column;
    }`
  ],
  main: {
    flexBasis: rhythm(30),
    minWidth: 0, // defaultのautoだと小さくならない
    minHeight: 0,
    flexShrink: 1,
  },
  sidebar: [{
      flexBasis: rhythm(8),
      flexGrow: 0,
      flexShrink: 0,
      marginLeft: rhythm(1)
    },    
    css`
    @media (max-width: ${media_max}) {
      margin-left: 0
    }`
  ]
}

export default Layout
