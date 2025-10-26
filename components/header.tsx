export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">AQI</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AeroSense</h1>
            <p className="text-muted-foreground text-sm">Your city’s air, decoded in real-time.</p>
              <p className="text-xs text-muted-foreground mt-1 italic">
              Made & Designed by <span className="font-semibold text-primary">DEVANSHU</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
