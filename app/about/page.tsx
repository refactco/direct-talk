export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-4xl font-bold">About Our AI Chatbot</h1>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            Our platform allows you to engage in lifelike conversations with
            authors, podcasters, and other creators. Using AI, we simulate
            interactions based on their content, making it feel like you're
            speaking directly with them.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">AI-Driven Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Chat with AI representations of your favorite creators, gaining
                insights and perspectives as if they were speaking to you
                directly.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Content-Based Interaction</h3>
              <p className="text-sm text-muted-foreground">
                Our AI uses the creator's content to provide accurate and
                meaningful responses.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Curated Creator Selection</h3>
              <p className="text-sm text-muted-foreground">
                Choose from a wide range of creators to interact with, each
                offering unique insights and knowledge.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Seamless User Experience</h3>
              <p className="text-sm text-muted-foreground">
                Enjoy a smooth and intuitive interface designed to enhance your
                conversational experience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">How It Works</h2>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  Select a Creator
                </p>
                <p>
                  Browse our curated list of creators and select the one whose
                  content you wish to explore.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  Engage in Conversation
                </p>
                <p>
                  Start a chat with our AI, which will respond based on the
                  creator's content, providing a unique conversational
                  experience.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  Discover and Learn
                </p>
                <p>
                  Gain new insights and explore the depth of the creator's work
                  through interactive dialogue.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              Email:{' '}
              <a href="mailto:hi@refact.co" className="text-primary">
                hi@refact.co
              </a>
            </li>
            <li>
              Website:{' '}
              <a href="https://refact.co" className="text-primary">
                https://refact.co
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
