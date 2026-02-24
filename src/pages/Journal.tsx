import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookHeart, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MoodBadge from '@/components/MoodBadge';
import { getJournals, addJournal, generateId, JournalEntry } from '@/lib/storage';
import { analyzeSentiment } from '@/lib/sentiment';
import { format, parseISO } from 'date-fns';

export default function Journal() {
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>(getJournals());
  const [lastResult, setLastResult] = useState<{ score: number; emotion: string; riskFlag: boolean } | null>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const result = analyzeSentiment(content);
    const entry: JournalEntry = {
      id: generateId(),
      content: content.trim(),
      sentimentScore: result.score,
      emotionLabel: result.emotion,
      riskFlag: result.riskFlag,
      createdAt: new Date().toISOString(),
    };
    addJournal(entry);
    setEntries([entry, ...entries]);
    setLastResult(result);
    setContent('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <BookHeart className="w-6 h-6 text-accent" />
          Journal
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Express your thoughts. Your entries are analyzed for mood patterns.</p>
      </div>

      {/* New entry */}
      <div className="bg-card rounded-2xl p-5 card-shadow space-y-3">
        <Textarea
          placeholder="How are you feeling today?"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="min-h-[120px] resize-none border-input bg-background/50 focus-visible:ring-primary"
        />
        <div className="flex items-center justify-between">
          <div>
            <AnimatePresence>
              {lastResult && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <MoodBadge score={lastResult.score} emotion={lastResult.emotion} riskFlag={lastResult.riskFlag} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button onClick={handleSubmit} disabled={!content.trim()} className="gap-2">
            <Send className="w-4 h-4" />
            Submit
          </Button>
        </div>
        {lastResult?.riskFlag && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              If you're struggling, please reach out. <strong>988 Suicide & Crisis Lifeline:</strong> call or text 988.
            </span>
          </motion.div>
        )}
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-card rounded-xl p-4 card-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-xs text-muted-foreground">
                {format(parseISO(entry.createdAt), 'MMM d, yyyy · h:mm a')}
              </p>
              <MoodBadge score={entry.sentimentScore} emotion={entry.emotionLabel} riskFlag={entry.riskFlag} />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{entry.content}</p>
          </motion.div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm">No journal entries yet. Start writing above!</p>
        )}
      </div>
    </div>
  );
}
