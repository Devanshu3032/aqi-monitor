export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">AQI</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Air Quality Monitor</h1>
            <p className="text-muted-foreground text-sm">Real-time AQI tracking for your health</p>
          </div>
        </div>
      </div>
    </header>
  )
}
