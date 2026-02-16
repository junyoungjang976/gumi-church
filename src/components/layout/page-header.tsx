interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-b from-church-cream-dark to-church-cream py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-church-brown sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base text-church-brown-light sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
