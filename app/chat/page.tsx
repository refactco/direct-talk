import ChatInterface from '@/components/ChatInterface'
import Layout from '@/components/Layout'

export default function ChatPage() {
  return (
    <Layout>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chat Interface</h1>
        <ChatInterface />
      </main>
    </Layout>
  )
}

