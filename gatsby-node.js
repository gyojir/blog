const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { DateTime } = require('luxon');

const createBlogPost = async (graphql, actions) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}


const createTagPage = async (graphql, actions) => {
  const { createPage  } = actions
  
  const tagPage = path.resolve(`./src/templates/tag-page.js`)
  const result = await graphql(`
    {
      allMarkdownRemark {
        group(field: frontmatter___tags){   
          name: fieldValue
          totalCount
        }
      }
    }
  `)
  
  if (result.errors) {
    throw result.errors
  }

  const tags = result.data.allMarkdownRemark.group
  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag.name}/`,
      component: tagPage,
      context: {
        tag: tag.name,
      },
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  await createBlogPost(graphql, actions);
  await createTagPage(graphql, actions);
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const tags = node.frontmatter.tags
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

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions

  // https://www.gatsbyjs.org/docs/schema-customization/#nested-types
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