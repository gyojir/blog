import Typography from "typography"
import githubTheme from 'typography-theme-github'

githubTheme.overrideThemeStyles = () => {
  return {
    "h1": {
      borderBottom: `none`,
    },
    "h2": {
      padding: ".25em 0 .25em .5em",
      borderLeft: "6px solid #ccc"
    },
    "h3": {
      padding: ".25em 0 .25em .5em",
      borderLeft: "6px solid #ccc"
    },
    "h4": {
      padding: ".25em 0 .25em .5em",
      borderLeft: "6px solid #ccc"
    },
    "h5": {
      padding: ".25em 0 .25em .5em",
      borderLeft: "6px solid #ccc"
    },
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    'td,th': {
        textAlign: null,
    },
  }
}

delete githubTheme.googleFonts

const typography = new Typography(githubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
