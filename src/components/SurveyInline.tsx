  import { useRef, useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import { getCookieConsentValue } from "react-cookie-consent";
  import ReactGA from "react-ga4";


  const track = (name: string, params:  {[key: string]:string | number }) => {
    ReactGA.gtag("event", name, {
      ...params,
      debug_mode: true,
      transport_type: "beacon",
      event_callback: () => console.log("📨 GA4 ACK:", name),
    });
  };

  type MoodValue = "same" | "a_bit_better" | "more_relaxed" | "much_more_calm";

  type Props = {
    onSkip?: () => void;
    className?: string;
  };

  const SURVEY_COMPLETED_KEY = "survey_completed";
  const SURVEY_COMPLETION_DATE_KEY = "survey_completion_date";

  export default function SurveyInline({ onSkip, className = "" }: Props) {
    const { t, i18n } = useTranslation();
    type Step = "invite" | "survey" | "result";
    const [step, setStep] = useState<Step>("invite");
    const [mood, setMood] = useState<MoodValue | null>(null);
    const [open, setOpen] = useState(false);

    const exercise_id = "4-7-8";
    const locale = i18n.language?.startsWith("es") ? "es" : "en";
    const consent_state = "granted";

    const questionStartRef = useRef<number | null>(null);

    useEffect(() => {
      const checkSurveyVisibility = () => {
        const cookiesAccepted = getCookieConsentValue("cookie1") === "true";

        if (!cookiesAccepted) {
          setOpen(false);
          return;
        }

        const surveyCompleted = localStorage.getItem(SURVEY_COMPLETED_KEY) === "true";
        const completionDate = localStorage.getItem(SURVEY_COMPLETION_DATE_KEY);


        if (surveyCompleted && completionDate) {
          const now = new Date();
          const completedDate = new Date(completionDate);
          const daysSinceCompletion = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));


          if (daysSinceCompletion >= 7) {
            setOpen(true);
            localStorage.removeItem(SURVEY_COMPLETED_KEY);
            localStorage.removeItem(SURVEY_COMPLETION_DATE_KEY);
          } else {
            setOpen(false);
          }
          return;
        }

        setOpen(true);
      };

      checkSurveyVisibility();
    }, []);

    useEffect(() => {
      if (!open || step !== "invite") return;
      track("survey_invite_shown", { exercise_id, locale});
    }, [open, step, locale]);

    const handleAcceptInvite = () => {
      setStep("survey");
      questionStartRef.current = Date.now();
      track("survey_started", { exercise_id, locale});
    };

    const handleSkip = () => {
      onSkip?.();
      track("survey_invite_skipped", { exercise_id, locale});
      setOpen(false);
    };

    const handleSelectMood = (value: MoodValue) => {
      setMood(value);
      setStep("result");

      const startedAt = questionStartRef.current ?? Date.now();
      const time_to_submit_ms = Date.now() - startedAt;

      localStorage.setItem(SURVEY_COMPLETED_KEY, "true");
      localStorage.setItem(SURVEY_COMPLETION_DATE_KEY, new Date().toISOString());

      track("survey_submitted", {
        exercise_id,
        locale,
        consent_state,
        mood_now: value,
        time_to_submit_ms,
      });
    };

    if (!open) return null;

    return (
      <section
        aria-live="polite"
        className={`w-full rounded-2xl border border-black/10 bg-[#2a77d3] p-6 sm:p-7 shadow-md ${className}`}
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
        <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-1">
          <button
            className="min-w-[180px] min-h-[48px] rounded-2xl bg-[var(--gradient-1-1)] px-6 py-3 text-white text-lg font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30 transition cursor-pointer"
            onClick={onAccept}
          >
            {yesLabel}
          </button>
          <button
            className="min-w-[180px] min-h-[48px] rounded-2xl bg-[#C75A19] px-6 py-3 text-white text-lg font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30 transition cursor-pointer"
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
        <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-white">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="rounded-2xl bg-[var(--gradient-1-1)] px-4 py-6 min-h-[56px] text-white text-lg font-semibold leading-tight hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30 transition cursor-pointer"
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
          <h4 className="text-2xl font-semibold mb-2 text-white">{sameTitle}</h4>
          <p className="text-[18px] leading-relaxed text-white max-w-xl mx-auto">
            {sameBody}
          </p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h4 className="text-2xl font-semibold mb-2 text-white">{positiveTitle}</h4>
        <p className="text-[18px] leading-relaxed text-white max-w-xl mx-auto">
          {positiveBody}
        </p>
      </div>
    );
  }