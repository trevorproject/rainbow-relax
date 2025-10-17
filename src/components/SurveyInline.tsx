// SurveyInline.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type MoodValue = "same" | "a_bit_better" | "more_relaxed" | "much_more_calm";

type Props = {
  onSkip?: () => void;
  className?: string;
};

export default function SurveyInline({ onSkip, className = "" }: Props) {
  const { t } = useTranslation(); // si usas namespaces, useTranslation('survey')
  type Step = "invite" | "survey" | "result";
  const [step, setStep] = useState<Step>("invite");
  const [mood, setMood] = useState<MoodValue | null>(null);

  const [open, setOpen] = useState(true);
  if (!open) return null;

  const handleAcceptInvite = () => setStep("survey");
  const handleSkip = () => {
    onSkip?.();
    setOpen(false);
  };
  const handleSelectMood = (value: MoodValue) => {
    setMood(value);
    setStep("result");
  };

  return (
    <section
      aria-live="polite"
      className={`w-full rounded-2xl border border-black/10 bg-[#F1E5CF] p-6 sm:p-7 shadow-md ${className}`}
    >
      {step === "invite" && (
        <Invite
          title={t("survey.invite.title")}
          yesLabel={t("survey.invite.yes")}
          skipLabel={t("survey.invite.skip")}
          onAccept={handleAcceptInvite}
          onSkip={handleSkip}
        />
      )}

      {step === "survey" && (
        <Survey
          title={t("survey.question.title")}
          labels={{
            same: t("survey.options.same"),
            a_bit_better: t("survey.options.a_bit_better"),
            more_relaxed: t("survey.options.more_relaxed"),
            much_more_calm: t("survey.options.much_more_calm"),
          }}
          onSelect={handleSelectMood}
        />
      )}

      {step === "result" && (
        <Result
          mood={mood}
          sameTitle={t("survey.result.same.title")}
          sameBody={t("survey.result.same.body")}
          positiveTitle={t("survey.result.positive.title")}
          positiveBody={t("survey.result.positive.body")}
        />
      )}
    </section>
  );
}

/* ---------- Subcomponentes ---------- */

function Invite({
  title,
  yesLabel,
  skipLabel,
  onAccept,
  onSkip,
}: {
  title: string;
  yesLabel: string;
  skipLabel: string;
  onAccept: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-semibold mb-4 text-[#2B2B2B]">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-1">
        <button
          className="min-w-[180px] min-h-[48px] rounded-2xl bg-[#2F5731] px-6 py-3 text-white text-lg font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30 transition"
          onClick={onAccept}
        >
          {yesLabel}
        </button>
        <button
          className="min-w-[180px] min-h-[48px] rounded-2xl bg-[#C75A19] px-6 py-3 text-white text-lg font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30 transition"
          onClick={onSkip}
        >
          {skipLabel}
        </button>
      </div>
    </div>
  );
}

function Survey({
  title,
  labels,
  onSelect,
}: {
  title: string;
  labels: Record<MoodValue, string>;
  onSelect: (m: MoodValue) => void;
}) {
  const options: { value: MoodValue; label: string; emoji: string }[] = [
    { value: "same", label: labels.same, emoji: "😔" },
    { value: "a_bit_better", label: labels.a_bit_better, emoji: "🙂" },
    { value: "more_relaxed", label: labels.more_relaxed, emoji: "😊" },
    { value: "much_more_calm", label: labels.much_more_calm, emoji: "😌" },
  ];

  return (
    <div className="text-center">
      <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[#2B2B2B]">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="rounded-2xl bg-[#2F5731] px-4 py-6 min-h-[56px] text-white text-lg font-semibold leading-tight hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30 transition"
            aria-label={opt.label}
          >
            <div className="text-2xl mb-1">{opt.emoji}</div>
            <div className="whitespace-pre-line">{opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Result({
  mood,
  sameTitle,
  sameBody,
  positiveTitle,
  positiveBody,
}: {
  mood: MoodValue | null;
  sameTitle: string;
  sameBody: string;
  positiveTitle: string;
  positiveBody: string;
}) {
  const isSame = mood === "same";

  if (isSame) {
    return (
      <div className="text-center">
        <h4 className="text-2xl font-semibold mb-2 text-[#2B2B2B]">{sameTitle}</h4>
        <p className="text-[18px] leading-relaxed text-[#2B2B2B] max-w-xl mx-auto">
          {/* Puedes envolver las frases clave en <strong> desde el JSX si quieres énfasis */}
          {sameBody}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h4 className="text-2xl font-semibold mb-2 text-[#2B2B2B]">{positiveTitle}</h4>
      <p className="text-[18px] leading-relaxed text-[#2B2B2B] max-w-xl mx-auto">
        {positiveBody}
      </p>
    </div>
  );
}
