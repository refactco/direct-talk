export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-4xl font-bold">About Carrot</h1>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            Carrot is your gateway to curated knowledge and meaningful conversations. We bring together the best
            resources across various topics and enable AI-powered discussions to help you learn and grow.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Curated Resources</h3>
              <p className="text-sm text-muted-foreground">
                Access a handpicked collection of high-quality books, articles, and podcasts.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">AI-Powered Chat</h3>
              <p className="text-sm text-muted-foreground">
                Engage in meaningful conversations about your selected resources with our AI assistant.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">
                Find exactly what you're looking for with our powerful search and filter system.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Resource Management</h3>
              <p className="text-sm text-muted-foreground">
                Easily organize and manage your selected resources for quick access.
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
                <p className="font-semibold text-foreground">Browse and Select Resources</p>
                <p>Explore our curated collection and select the resources that interest you.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-semibold text-foreground">Start a Conversation</p>
                <p>Begin chatting with our AI about your selected resources to gain deeper insights.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-semibold text-foreground">Learn and Discover</p>
                <p>Get cited responses and explore connections between different resources.</p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}

