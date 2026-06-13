import React from "react";
import { JournalEntry } from "@/src/types";
import { EXAM_OPTIONS } from "@/src/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Calendar, Award, Flame, Tag, AlertCircle, Sparkles, TrendingUp, Compass } from "lucide-react";

interface AnalyticsTrendsProps {
  entries: JournalEntry[];
  examType: string;
  examDate: string;
}

export default function AnalyticsTrends({ entries, examType, examDate }: AnalyticsTrendsProps) {
  // 1. Calculate active journaling consistency streak
  const calculateStreak = (): number => {
    if (entries.length === 0) return 0;
    
    // Sort entries descending to loop back
    const sorted = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let lastDate = new Date();
    // Normalize last date to midnight
    lastDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const entryDate = new Date(sorted[i].date);
      entryDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(lastDate.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || (i === 0 && diffDays === 1)) {
        streak++;
        lastDate = entryDate;
      } else if (diffDays === 1) {
        streak++;
        lastDate = entryDate;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    return streak || 1;
  };

  // 2. Count triggers aggregated frequency of occurrences
  const getAggregatedTriggers = () => {
    const counts: Record<string, number> = {};
    entries.forEach((entry) => {
      if (entry.analysis?.triggers) {
        entry.analysis.triggers.forEach((t) => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  // 3. Count countdown days
  const getCountdownDays = (): { days: number; text: string } => {
    if (!examDate) return { days: 0, text: "No exam date picked yet" };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(examDate);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let advice = "";
    if (days < 0) {
      advice = "Hope your papers went excellently! Take mandatory rest.";
    } else if (days <= 7) {
      advice = "Exam represents final stretch! Maximize sleep, avoid learning new heavy topics, revised short formula cards.";
    } else if (days <= 30) {
      advice = "Under 4 weeks to go. Focus heavily on solving mock papers and analyzing mistakes calmly without panic.";
    } else {
      advice = "Good baseline timeline. Build consistent hours, clear backlogs segmentally, and preserve your sleep hours.";
    }

    return { days, text: advice };
  };

  const streak = calculateStreak();
  const topTriggers = getAggregatedTriggers();
  const cdown = getCountdownDays();

  // 4. Prepare Recharts source mapping data (Last 7 entries)
  const getChartData = () => {
    const historical = [...entries]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    if (historical.length === 0) {
      // Dummy data showing a flat baseline line
      return [
        { name: "Day 1", mood: 5, stress: 5 },
        { name: "Day 2", mood: 6, stress: 4 },
        { name: "Day 3", mood: 5, stress: 5 }
      ];
    }

    return historical.map((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString([], {
        month: "short",
        day: "numeric"
      });
      return {
        name: formattedDate,
        emotion: item.analysis?.emotion || item.moodLabel,
        mood: item.analysis ? (11 - item.analysis.stressLevel) : item.moodEmoji === "😔" ? 2 : item.moodEmoji === "😰" ? 4 : item.moodEmoji === "😐" ? 5 : item.moodEmoji === "🙂" ? 7 : 9,
        stress: item.analysis ? item.analysis.stressLevel : 5
      };
    });
  };

  const chartData = getChartData();
  const activeExamName = EXAM_OPTIONS.find((e) => e.id === examType)?.name || examType;

  return (
    <div className="w-full space-y-6" id="analytics-scroller">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4" id="trends-header">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Insights & Mood Telemetry
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Track key physiological triggers and mental consistency over your study calendar.
          </p>
        </div>
      </div>

      {/* Top micro highlights panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="metrics-trio">
        {/* Habit Streak */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden" id="streak-metric-card">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/[0.02] rounded-full blur-xl"></div>
          <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Consistency Streak</span>
            <span className="block text-2xl font-extrabold text-white font-display mt-0.5">{streak} Days</span>
            <span className="block text-[10px] text-slate-400 mt-1 italic">
              {streak > 2 ? "Flawless progress! Keep going." : "Log entries daily to track patterns."}
            </span>
          </div>
        </div>

        {/* Total Logs */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden" id="total-logs-metric-card">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-400/[0.02] rounded-full blur-xl"></div>
          <div className="w-12 h-12 bg-teal-400/10 text-teal-400 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Total journal Entries</span>
            <span className="block text-2xl font-extrabold text-white font-display mt-0.5">{entries.length} Logs</span>
            <span className="block text-[10px] text-slate-400 mt-1 italic">
              {entries.length > 5 ? "Ample data points for AI analysis" : "Write more to power companion knowledge."}
            </span>
          </div>
        </div>

        {/* Target Countdown */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden" id="countdown-metric-card">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/[0.02] rounded-full blur-xl"></div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{activeExamName} countdown</span>
            <span className="block text-2xl font-extrabold text-white font-display mt-0.5">
              {cdown.days >= 0 ? `${cdown.days} Days` : "Finished"}
            </span>
            <span className="block text-[10px] text-slate-450 mt-1 truncate max-w-[15rem] leading-none text-slate-400 italic font-mono font-bold">
              Target: {examDate}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown syllabus advice full-width banner */}
      {examDate && cdown.days >= 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-xl flex items-start gap-3" id="prep-advice-card">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: "10s" }} />
          <div>
            <span className="block text-xs font-bold font-display text-slate-200">Timeline Reflection Tips:</span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{cdown.text}</p>
          </div>
        </div>
      )}

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-visuals">
        {/* Recharts chart block */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="chart-panel">
          <div className="mb-4 flex items-center justify-between" id="chart-legend-header">
            <div>
              <h3 className="text-white text-xs uppercase tracking-wider font-extrabold">Stress & Mood Trends (Last 7 Logs)</h3>
              <span className="text-[10px] text-slate-500">Lower stress is better. Higher mood score represents focus.</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-sans" id="chart-legend">
              <span className="flex items-center gap-1.5 text-teal-400">
                <span className="w-2.5 h-2.5 bg-teal-400 rounded-full inline-block"></span> Mood (Calmness)
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span> Stress level
              </span>
            </div>
          </div>

          <div className="w-full relative h-[16rem]" id="chart-box-container">
            {entries.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500" id="blank-chart-state">
                <TrendingUp className="w-10 h-10 text-slate-700 mb-2" />
                <span className="text-xs">Once you write your first journal entry,</span>
                <span className="text-[10px] text-slate-600 mt-1">visual trends will populate here.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradientStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#fff"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#2dd4bf"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientMood)"
                    name="Calm Factor"
                  />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#gradientStress)"
                    name="Stress Intesity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Dynamic Aggregated Triggers Frequency (Right column) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between" id="triggers-tall-card">
          <div className="space-y-4 w-full" id="triggers-analytics-box">
            <div>
              <h3 className="text-white text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-400" />
                Trigger Radar
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Recurring pressures detected across your written sessions.</p>
            </div>

            <div className="space-y-2 max-h-[11rem] overflow-y-auto" id="tracked-frequent-tags">
              {entries.length === 0 ? (
                <div className="py-8 text-center text-slate-650" id="empty-triggers-analytics">
                  <span className="text-xs text-slate-500 italic">No triggers captured yet</span>
                </div>
              ) : topTriggers.length === 0 ? (
                <div className="py-8 text-center text-slate-550" id="no-tags-found">
                  <span className="text-[11px] text-slate-500 italic">No triggers parsed. Maintain continuous check-ins.</span>
                </div>
              ) : (
                topTriggers.map((trig) => {
                  const maxOccur = topTriggers[0]?.count || 1;
                  const percent = Math.max(10, Math.min(100, (trig.count / maxOccur) * 100));
                  return (
                    <div key={trig.name} className="space-y-1" id={`gauge-item-${trig.name}`}>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-300 font-sans tracking-wide">🚨 {trig.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{trig.count} hits</span>
                      </div>
                      <div className="w-full bg-slate-900 border border-slate-850 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-400 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 text-slate-200 mt-2" id="trigger-coping-nudge">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-2 text-[10px] leading-relaxed text-slate-400" id="mini-recs">
              <Compass className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: "15s" }} />
              <span>
                Tip: If academic triggers dominate your radar above, use the <strong>Mindfulness breathing coach</strong> or draft <strong>pomodoro sprints</strong> inside companion chat.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
