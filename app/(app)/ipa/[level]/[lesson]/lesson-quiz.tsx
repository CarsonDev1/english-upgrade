"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
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
  const passed = submitted && score >= Math.ceil(total * 0.8);

  function reset() {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
  }

  function submit() {
    if (answers.some((a) => a === null)) {
      toast.error("Please answer all questions.");
      return;
    }
    setSubmitted(true);
    if (score >= Math.ceil(total * 0.8) && !mastered) {
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
    <div className="space-y-4">
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Q{qIdx + 1}.</span>
            <span>How is</span>
            <strong>{q.word}</strong>
            <SpeakButton text={q.word} size="icon" className="h-7 w-7" />
            <span>pronounced?</span>
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
                    "rounded-md border p-3 text-left transition",
                    "ipa text-base",
                    !showResult && selected && "border-primary bg-primary/10",
                    !showResult && !selected && "hover:border-primary/50",
                    showResult && isCorrect && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                    showResult && selected && !isCorrect && "border-destructive bg-destructive/10",
                    submitted && "cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4" />}
                    {showResult && selected && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <div className="flex justify-end pt-2">
          <Button onClick={submit} disabled={answers.some((a) => a === null)}>
            Submit
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-md border p-4 flex items-center justify-between",
            passed ? "border-primary bg-primary/5" : "border-destructive/30 bg-destructive/5",
          )}
        >
          <div>
            <p className="font-semibold">
              {passed ? "🎉 Passed!" : "Try again"} — Score: {score}/{total}
            </p>
            <p className="text-sm text-muted-foreground">
              {passed
                ? mastered
                  ? "This lesson is marked as mastered."
                  : "Keep going to the next lesson."
                : `You need at least ${Math.ceil(total * 0.8)}/${total} to master this lesson.`}
            </p>
          </div>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Retry
          </Button>
        </div>
      )}
    </div>
  );
}
