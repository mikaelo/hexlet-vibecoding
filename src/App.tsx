import { CalorieCalculator } from '@/components/CalorieCalculator';
import { ThemeToggle } from '@/components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen w-full bg-background px-4 py-8 transition-colors sm:py-12">
      <ThemeToggle />
      <CalorieCalculator />
    </div>
  );
}

export default App;
