import { getStaticPropsForTina } from 'tinacms'
import { Layout } from '../../components/Layout'
export default function Home(props) {
  return (
    <Layout>
      <code>
        <pre
          style={{
            backgroundColor: 'lightgray',
          }}
        >
          {JSON.stringify(props.data.getPostDocument.data, null, 2)}
        </pre>
      </code>
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const tinaProps = await staticRequest({
    query: `{
        getPostList{
          edges {
            node {
              sys {
                filename
              }
            }
          }
        }
      }`,
    variables: {},
  })
  const paths = tinaProps.getPostList.edges.map((x) => {
    return { params: { slug: x.node.sys.filename } }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}
export const getStaticProps = async (ctx) => {
  const tinaProps = await getStaticPropsForTina({
    query: `query getPost($relativePath: String!) {
        getPostDocument(relativePath: $relativePath) {
          data {
            title
            body
          }
        }
      }
      `,
    variables: {
      relativePath: ctx.params.slug + '.md',
    },
  })

  return {
    props: {
      ...tinaProps,
    },
  }
}
