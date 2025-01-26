import Layout from "@/components/Layout"
import TopicPage from "@/components/TopicPage"

export default function Topic({ params }: { params: { slug: string } }) {
  return (
    <Layout>
      <TopicPage slug={params.slug} />
    </Layout>
  )
}

