import { BookHeart, Pill, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import { getJournals, getFitnessLogs, getMedications, getMedLogs } from '@/lib/storage';
import { getWeeklyInsights } from '@/lib/insights';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const journals = getJournals();
  const fitness = getFitnessLogs();
  const meds = getMedications();
  const medLogs = getMedLogs();
  const insights = getWeeklyInsights();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayJournals = journals.filter(j => j.createdAt.startsWith(today));
  const todayFitness = fitness.filter(f => f.logDate === today);
  const todayMedsTaken = medLogs.filter(l => l.takenDate === today && l.taken).length;

  // Streak calculation
  const getStreak = () => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const day = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const hasEntry = journals.some(j => j.createdAt.startsWith(day)) ||
                       fitness.some(f => f.logDate === day) ||
                       medLogs.some(l => l.takenDate === day);
      if (hasEntry) streak++;
      else break;
    }
    return streak;
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-hero p-6 md:p-8 card-shadow"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg">
          {insights.summary || 'Start tracking your habits to unlock personalized behavioral insights.'}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <StatCard icon={TrendingUp} label="Day Streak" value={getStreak()} subtitle="Keep going!" variant="primary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard icon={BookHeart} label="Today's Entries" value={todayJournals.length} variant="accent" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard icon={Pill} label="Meds Taken" value={`${todayMedsTaken}/${meds.length}`} variant="success" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={Activity}
            label="Exercise Today"
            value={todayFitness.length > 0 ? `${todayFitness[0].minutesExercised}m` : '—'}
          />
        </motion.div>
      </motion.div>

      {/* Mood chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-5 card-shadow"
      >
        <h2 className="font-display text-lg font-semibold mb-4 text-foreground">Mood Trend (7 days)</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insights.moodTrend}>
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
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
