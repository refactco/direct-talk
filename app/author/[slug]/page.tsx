import Layout from "@/components/Layout"
import AuthorPage from "@/components/AuthorPage"

export default function Author({ params }: { params: { slug: string } }) {
  return (
    <Layout>
      <AuthorPage slug={params.slug} />
    </Layout>
  )
}

