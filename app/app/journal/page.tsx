"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Calendar, TrendingUp, Sparkles, Plus, Camera, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JournalPage() {
  const { t } = useLanguage()
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)

  return (
    <div className="min-h-full bg-gradient-to-br from-stone-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 px-5 py-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{t.journal.title}</h1>
            <p className="text-orange-100 text-sm">{t.journal.subtitle}</p>
          </div>
          <Button className="bg-white text-orange-500 hover:bg-orange-50 rounded-full shadow-lg">
            <Plus className="h-4 w-4 mr-1" />
            {t.journal.addEntry}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{t.journal.stats.totalDays}</div>
            <div className="text-xs text-orange-100">{t.journal.stats.tracked}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{t.journal.stats.milestones}</div>
            <div className="text-xs text-orange-100">{t.journal.stats.achieved}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{t.journal.stats.growthScore}</div>
            <div className="text-xs text-orange-100">{t.journal.stats.score}</div>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="mx-5 my-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">{t.journal.aiInsight.title}</h3>
            <p className="text-white/90 text-xs leading-relaxed">{t.journal.aiInsight.message}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-orange-500" />
          <h2 className="font-semibold text-stone-800">{t.journal.timeline}</h2>
        </div>

        <div className="space-y-4">
          {t.journal.entries.map((entry: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedEntry(selectedEntry === index ? null : index)}
            >
              {/* Entry Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                      {entry.date}
                    </span>
                    {entry.milestone && <Award className="h-4 w-4 text-amber-500" />}
                  </div>
                  <h3 className="font-bold text-stone-800">{entry.title}</h3>
                  <p className="text-sm text-stone-600 mt-1">{entry.description}</p>
                </div>
                {entry.image && (
                  <img
                    src={entry.image || "/placeholder.svg"}
                    alt={entry.title}
                    className="w-20 h-20 rounded-xl object-cover ml-3"
                  />
                )}
              </div>

              {/* Personality Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {entry.traits.map((trait: string, i: number) => (
                  <span key={i} className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>

              {/* AI Analysis (Expandable) */}
              {selectedEntry === index && (
                <div className="mt-4 pt-4 border-t border-stone-200 animate-in slide-in-from-top duration-300">
                  <div className="flex items-start gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-stone-800 mb-1">{t.journal.aiAnalysisLabel}</h4>
                      <p className="text-sm text-stone-600 leading-relaxed">{entry.aiAnalysis}</p>
                    </div>
                  </div>

                  {/* Growth Indicators */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {entry.growthAreas.map((area: any, i: number) => (
                      <div key={i} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-2">
                        <div className="text-xs text-stone-600 mb-1">{area.label}</div>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 bg-stone-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${area.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-orange-500">{area.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Entry CTA */}
        <div className="mt-6 bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl p-6 text-center border-2 border-dashed border-stone-300">
          <Camera className="h-12 w-12 text-stone-400 mx-auto mb-3" />
          <h3 className="font-semibold text-stone-700 mb-2">{t.journal.addFirstEntry}</h3>
          <p className="text-sm text-stone-500 mb-4">{t.journal.addFirstEntryDesc}</p>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            {t.journal.startTracking}
          </Button>
        </div>
      </div>
    </div>
  )
}
