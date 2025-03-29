export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">AnilistX</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Your personal anime tracker and discovery platform
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
