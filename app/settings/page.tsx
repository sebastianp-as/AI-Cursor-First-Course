import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="container-page space-y-6">
      <h1 className="heading-1">Settings</h1>
      <div className="glass p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Appearance</div>
            <div className="muted text-sm">Switch between light and dark modes</div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

