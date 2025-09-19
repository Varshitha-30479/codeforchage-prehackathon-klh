import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Theme toggle:</span>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}