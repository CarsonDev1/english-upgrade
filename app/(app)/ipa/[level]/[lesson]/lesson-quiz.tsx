"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpeakButton } from "@/components/speak-button";
import { markLessonMastered } from "../../actions";
import { toast } from "sonner";

interface QuizQuestion {
  word: string;
  prompt?: string;
  options: string[];
  answerIndex: number;
}

export function LessonQuiz({
  lessonId,
  questions,
  alreadyMastered,
}: {
  lessonId: string;
  questions: QuizQuestion[];
  alreadyMastered: boolean;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [, start] = useTransition();
  const [mastered, setMastered] = useState(alreadyMastered);

  const score = answers.reduce<number>((s, a, i) => (a === questions[i].answerIndex ? s + 1 : s), 0);
  const total = questions.length;
  const passingScore = Math.ceil(total * 0.8);
  const passed = submitted && score >= passingScore;
  const answered = answers.filter((a) => a !== null).length;

  function reset() {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
  }

  function submit() {
    if (answers.some((a) => a === null)) {
      toast.error("Hãy trả lời tất cả các câu.");
      return;
    }
    setSubmitted(true);
    if (score >= passingScore && !mastered) {
      start(async () => {
        const result = await markLessonMastered(lessonId);
        if (!result.error) {
          setMastered(true);
          toast.success("🎉 Lesson mastered!");
        }
      });
    }
  }

  return (
    <div className="space-y-5">
      {!submitted && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Đã trả lời <span className="font-medium text-foreground">{answered}</span>/{total}
          </span>
          <span>Cần đúng tối thiểu {passingScore}/{total} để pass</span>
        </div>
      )}

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-bold">
              {qIdx + 1}
            </span>
            <span className="text-sm">How is</span>
            <strong className="text-base">{q.word}</strong>
            <SpeakButton text={q.word} size="icon" className="h-6 w-6" />
            <span className="text-sm">pronounced?</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {q.options.map((opt, optIdx) => {
              const selected = answers[qIdx] === optIdx;
              const isCorrect = optIdx === q.answerIndex;
              const showResult = submitted;
              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers(answers.map((a, i) => (i === qIdx ? optIdx : a)))}
                  className={cn(
                    "rounded-xl border-2 p-3 text-left transition-all ipa text-base",
                    !showResult && "hover:-translate-y-0.5 hover:shadow-sm",
                    !showResult && selected && "border-primary bg-primary/10",
                    !showResult && !selected && "border-border/60 hover:border-primary/40 bg-card",
                    showResult && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    showResult && selected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                    showResult && !selected && !isCorrect && "border-border/40 bg-muted/30 opacity-60",
                    submitted && "cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4" />}
                    {showResult && selected && !isCorrect && <XCircle className="h-4 w-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <div className="flex justify-end pt-2">
          <Button onClick={submit} disabled={answers.some((a) => a === null)} size="lg">
            Submit answers
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-xl border-2 p-5 flex items-center justify-between gap-4 flex-wrap",
            passed
              ? "border-primary/40 bg-primary/5"
              : "border-destructive/30 bg-destructive/5",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 ring-1 ring-inset",
                passed
                  ? "bg-primary text-primary-foreground ring-primary/40"
                  : "bg-destructive/10 text-destructive ring-destructive/30",
              )}
            >
              {passed ? <Trophy className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-semibold">
                {passed ? "🎉 Passed!" : "Try again"} — Score:{" "}
                <span className="text-primary">{score}</span>/{total}
              </p>
              <p className="text-sm text-muted-foreground">
                {passed
                  ? mastered
                    ? "Bài học đã được đánh dấu là mastered."
                    : "Tiếp tục bài học tiếp theo."
                  : `Cần ít nhất ${passingScore}/${total} đúng để mastered.`}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={reset}>
            <RotateCcw /> Retry
          </Button>
        </div>
      )}
    </div>
  );
}
