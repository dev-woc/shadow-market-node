import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, Users } from 'lucide-react';
import { verifyMajoritySolution } from '@/lib/votePuzzleGenerator';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PREVIEW_COUNT = 50;

export const SellerProgram = () => {
  const { votePuzzle, isVerifiedSeller, verifySeller } = useStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  if (!votePuzzle) return null;

  const handleDownloadBallots = () => {
    const blob = new Blob([JSON.stringify(votePuzzle.votes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ballot_log.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitted.trim()) {
      setFeedback({ ok: false, message: 'ENTER A SELLER ID' });
      return;
    }

    const isCorrect = verifyMajoritySolution(votePuzzle, submitted);
    setFeedback({
      ok: isCorrect,
      message: isCorrect ? 'MAJORITY CONFIRMED' : 'NOT THE MAJORITY — RECOUNT AND TRY AGAIN',
    });

    if (isCorrect) {
      verifySeller();
      toast({
        title: 'VERIFIED SELLER',
        description: `${votePuzzle.sellerAlias} confirmed as Seller of the Month`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground neon-text"
          >
            SELLER PROGRAM
          </motion.h2>
          <p className="text-sm text-muted-foreground font-mono mt-2">
            VOTE // VERIFY // DOMINATE
          </p>
        </div>

        <Button
          onClick={handleDownloadBallots}
          className="bg-secondary hover:bg-secondary/80 text-foreground font-mono gap-2"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD FULL BALLOT LOG (n={votePuzzle.votes.length})
        </Button>
      </div>

      {/* Identity Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">YOUR SELLER ID</p>
              <h3 className="font-mono text-xl text-primary neon-text">{votePuzzle.sellerAlias}</h3>
            </div>
          </div>

          {/* Raw ballot feed preview — deliberately not aggregated/counted */}
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2">
            Live Ballot Feed (showing {Math.min(PREVIEW_COUNT, votePuzzle.votes.length)} of {votePuzzle.votes.length})
          </p>
          <div className="h-40 overflow-y-auto bg-background/50 border border-border/50 rounded-lg p-3 font-mono text-xs text-muted-foreground space-y-1 mb-4">
            {votePuzzle.votes.slice(0, PREVIEW_COUNT).map((vote, i) => (
              <div key={i}>ballot #{i + 1} → {vote}</div>
            ))}
          </div>

          <div className="p-3 bg-neon-red/10 border border-neon-red/30 rounded-lg mb-6">
            <p className="text-xs text-neon-red font-mono">
              ⚠ INTEL: "Seller of the Month" requires a strict majority (&gt;50%) of all votes. The
              feed is too large to eyeball — download the full log and count for real.
            </p>
          </div>

          {isVerifiedSeller ? (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary neon-text">
                VERIFIED SELLER — MAJORITY CONFIRMED
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  Enter Majority Seller ID
                </label>
                <Input
                  value={submitted}
                  onChange={(e) => setSubmitted(e.target.value)}
                  placeholder={votePuzzle.sellerAlias}
                  className="font-mono"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-mono">
                CLAIM VERIFICATION
              </Button>
              {feedback && (
                <p className={`text-xs font-mono ${feedback.ok ? 'text-primary neon-text' : 'text-neon-red'}`}>
                  {feedback.ok ? '✔' : '⚠'} {feedback.message}
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
