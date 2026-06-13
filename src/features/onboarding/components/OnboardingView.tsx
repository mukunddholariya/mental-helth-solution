import React from "react";
import { useForm } from "react-hook-form";
import { UserProfile } from "@/src/types";
import { EXAM_OPTIONS } from "@/src/data";
import { Card } from "@/src/components/shared/Card";
import { Button } from "@/src/components/shared/Button";
import { InputField } from "@/src/components/shared/InputField";
import { BookOpen, Calendar, User, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

interface OnboardingInputs {
  name: string;
  examType: string;
  examDate: string;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<OnboardingInputs>({
    defaultValues: {
      name: "",
      examType: "JEE",
      examDate: ""
    },
    mode: "onChange"
  });

  const onSubmit = (data: OnboardingInputs) => {
    onComplete({
      name: data.name.trim(),
      examType: data.examType,
      examDate: data.examDate,
      onboardingCompleted: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-teal-500 selection:text-slate-900" id="onboarding-root">
      <Card variant="glowing" glowColor="emerald" className="w-full max-w-xl p-8" id="onboarding-card">
        <div className="text-center mb-8 relative" id="onboarding-header">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center p-3 text-slate-900 shadow-lg shadow-emerald-500/20 mb-4" id="onboarding-icon">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Meet Manas</h1>
          <p className="mt-2 text-slate-350 text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Your empathetic AI wellness guide through the high-stakes journey of competitive and board exams. Let's customize your companion space.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative" id="onboarding-form">
          <InputField
            label="What should we call you?"
            id="onboarding-name-input"
            type="text"
            placeholder="e.g., Mukund, Priya, Rohan"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register("name", {
              required: "Please share your name so Manas can refer to you.",
              minLength: {
                value: 2,
                message: "Name must possess at least 2 characters."
              },
              maxLength: {
                value: 30,
                message: "Name is too long."
              }
            })}
          />

          <div id="input-group-exam" className="space-y-1.5 w-full font-sans">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Which exam are you focusing on?
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                <BookOpen className="w-4 h-4" />
              </div>
              <select
                id="onboarding-exam-select"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm py-2.5 pl-11 pr-10 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/15 appearance-none cursor-pointer"
                {...register("examType", { required: "Please pick an exam option." })}
              >
                {EXAM_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900">
                    {opt.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400"></div>
            </div>
          </div>

          <div>
            <InputField
              label="Expected Date of Exam"
              id="onboarding-date-input"
              type="date"
              icon={<Calendar className="w-4 h-4" />}
              error={errors.examDate?.message}
              {...register("examDate", {
                required: "Please pick a target exam date.",
                validate: (value) => {
                  const picked = new Date(value);
                  const minimumDate = new Date();
                  minimumDate.setFullYear(minimumDate.getFullYear() - 1); // Allow recently passed for review, but warn if far in past
                  return picked instanceof Date && !isNaN(picked.getTime()) || "Please enter a valid calendars date.";
                }
              })}
            />
            <p className="mt-1.5 text-slate-500 text-[11px] leading-normal font-sans">
              We use this to build a warm countdown and help prioritize stress mitigation tools early.
            </p>
          </div>

          <Button
            id="onboarding-complete-btn"
            type="submit"
            variant="gradient"
            className="w-full py-4 uppercase tracking-wider text-xs font-bold font-sans"
          >
            Enter Wellness sanctuary
          </Button>
        </form>

        <div className="mt-8 text-center text-[11px] text-slate-400 py-2 border-t border-slate-800" id="onboarding-privacy-footer">
          🔒 <strong>Privacy Guard:</strong> All journal entries, mood records, and conversation logs are stored 100% locally on your device browser state.
        </div>
      </Card>
    </div>
  );
}
