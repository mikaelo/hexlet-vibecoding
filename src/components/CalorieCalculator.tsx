import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Коэффициенты корректировки калорий в зависимости от цели
const GOAL_FACTORS: Record<string, number> = {
  lose: 0.85, // дефицит 15%
  maintain: 1, // поддержание
  gain: 1.15, // профицит 15%
};

// Распределение макронутриентов (доля от суточной нормы калорий)
const MACRO_SPLIT = { protein: 0.3, fat: 0.3, carbs: 0.4 };

// Калорийность 1 грамма макронутриента
const KCAL_PER_GRAM = { protein: 4, fat: 9, carbs: 4 };

type Gender = 'male' | 'female';

interface Result {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  target: number;
  protein: number;
  fat: number;
  carbs: number;
}

// Категория индекса массы тела (ВОЗ)
function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'недостаток веса';
  if (bmi < 25) return 'норма';
  if (bmi < 30) return 'избыточный вес';
  return 'ожирение';
}

export function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const [goal, setGoal] = useState('maintain');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);

    if (!ageNum || !weightNum || !heightNum) {
      setError('Пожалуйста, заполните возраст, вес и рост.');
      setResult(null);
      return;
    }

    if (
      ageNum < 1 ||
      ageNum > 120 ||
      weightNum < 20 ||
      weightNum > 400 ||
      heightNum < 80 ||
      heightNum > 250
    ) {
      setError('Проверьте корректность введённых данных.');
      setResult(null);
      return;
    }

    // Индекс массы тела
    const heightM = heightNum / 100;
    const bmi = weightNum / (heightM * heightM);

    // Базовый обмен веществ (BMR) по формуле Миффлина — Сан Жеора
    const base = 10 * weightNum + 6.25 * heightNum - 5 * ageNum;
    const bmr = gender === 'male' ? base + 5 : base - 161;

    const tdee = bmr * Number(activity);
    const target = tdee * (GOAL_FACTORS[goal] ?? 1);

    setError('');
    setResult({
      bmi,
      bmiCategory: bmiCategory(bmi),
      bmr,
      tdee,
      target,
      protein: (target * MACRO_SPLIT.protein) / KCAL_PER_GRAM.protein,
      fat: (target * MACRO_SPLIT.fat) / KCAL_PER_GRAM.fat,
      carbs: (target * MACRO_SPLIT.carbs) / KCAL_PER_GRAM.carbs,
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Калькулятор калорий и ИМТ</CardTitle>
          <CardDescription>
            Рассчитайте индекс массы тела и суточную норму калорий по формуле
            Миффлина — Сан Жеора.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Пол</Label>
              <RadioGroup
                value={gender}
                onValueChange={(v) => setGender(v as Gender)}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="male"
                  className="flex cursor-pointer items-center gap-2 rounded-md border p-3 font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value="male" id="male" />
                  Мужчина
                </Label>
                <Label
                  htmlFor="female"
                  className="flex cursor-pointer items-center gap-2 rounded-md border p-3 font-normal has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value="female" id="female" />
                  Женщина
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Возраст, лет</Label>
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Вес, кг</Label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  placeholder="72"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Рост, см</Label>
                <Input
                  id="height"
                  type="number"
                  inputMode="decimal"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Уровень активности</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">
                    Минимальный (сидячий образ жизни)
                  </SelectItem>
                  <SelectItem value="1.375">
                    Низкий (тренировки 1–3 раза в неделю)
                  </SelectItem>
                  <SelectItem value="1.55">
                    Средний (тренировки 3–5 раз в неделю)
                  </SelectItem>
                  <SelectItem value="1.725">
                    Высокий (тренировки 6–7 раз в неделю)
                  </SelectItem>
                  <SelectItem value="1.9">
                    Очень высокий (физическая работа)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Цель</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Похудение (дефицит 15%)</SelectItem>
                  <SelectItem value="maintain">Поддержание веса</SelectItem>
                  <SelectItem value="gain">
                    Набор массы (профицит 15%)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Рассчитать
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Результат</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl bg-accent p-4 text-center text-accent-foreground">
              <div className="text-sm opacity-90">Индекс массы тела</div>
              <div className="text-3xl font-bold">
                {result.bmi.toFixed(1)}
              </div>
              <div className="text-sm capitalize opacity-90">
                {result.bmiCategory}
              </div>
            </div>

            <div className="rounded-xl bg-primary p-4 text-center text-primary-foreground">
              <div className="text-sm opacity-90">Суточная норма калорий</div>
              <div className="text-3xl font-bold">
                {Math.round(result.target)} ккал
              </div>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Базовый обмен (BMR)</span>
                <span className="font-medium text-foreground">
                  {Math.round(result.bmr)} ккал
                </span>
              </div>
              <div className="flex justify-between">
                <span>Расход с активностью (TDEE)</span>
                <span className="font-medium text-foreground">
                  {Math.round(result.tdee)} ккал
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold">
                Рекомендуемые макронутриенты
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Белки</div>
                  <div className="font-semibold">
                    {Math.round(result.protein)} г
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Жиры</div>
                  <div className="font-semibold">
                    {Math.round(result.fat)} г
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Углеводы</div>
                  <div className="font-semibold">
                    {Math.round(result.carbs)} г
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
