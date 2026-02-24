import { motion } from 'framer-motion';
import { BarChart3, Brain, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { getWeeklyInsights } from '@/lib/insights';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const insights = getWeeklyInsights();

  const trendIcon = (val: number) => {
    if (val > 0.05) return <ArrowUpRight className="w-4 h-4 text-success" />;
    if (val < -0.05) return <ArrowDownRight className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const metrics = [
    { label: 'Average Mood', value: insights.avgMood.toFixed(2), icon: trendIcon(insights.avgMood) },
    { label: 'Fitness Correlation', value: `${Math.round(insights.fitnessCorrelation * 100)}%`, icon: trendIcon(insights.fitnessCorrelation) },
    { label: 'Medication Correlation', value: `${Math.round(insights.medicationCorrelation * 100)}%`, icon: trendIcon(insights.medicationCorrelation) },
    { label: 'Predicted Tomorrow', value: insights.predictedNextMood.toFixed(2), icon: trendIcon(insights.predictedNextMood) },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Behavioral Insights
        </h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered analysis of your habits and mood patterns.</p>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 card-shadow"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Weekly Summary</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{insights.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-4 card-shadow"
          >
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xl font-display font-bold text-foreground">{m.value}</p>
              {m.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mood chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-5 card-shadow"
      >
        <h2 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Mood Distribution
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.moodTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: 13,
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
