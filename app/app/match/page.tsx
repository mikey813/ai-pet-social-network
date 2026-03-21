"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Sparkles, Info, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"

export default function MatchPage() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleSwipe = (dir: number) => {
    setDirection(dir)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setDirection(0)
    }, 300)
  }

  const currentPet = t.match.pets[currentIndex % t.match.pets.length]
  const distance = ["1.2km", "0.5km", "0.8km", "1.5km"][currentIndex % 4]
  const matchScore = [98, 85, 92, 88][currentIndex % 4]
  const image = currentPet.image

  return (
    <div className="p-4 max-w-md mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-stone-800">{t.match.title}</h1>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1">
          <Sparkles className="h-3 w-3" />
          {t.match.aiOptimized}
        </Badge>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            exit={{ x: direction * 500, rotate: direction * 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Card className="h-full overflow-hidden rounded-3xl border-0 shadow-xl bg-white flex flex-col">
              {/* Image Section */}
              <div className="relative h-3/5 bg-stone-200">
                <img src={image || "/placeholder.svg"} alt={currentPet.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="text-sm font-bold text-orange-600">
                    {matchScore}
                    {t.match.matchPercent}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    {currentPet.name}, {currentPet.age}
                    <BadgeCheck className="h-6 w-6 text-blue-400" />
                  </h2>
                  <p className="text-stone-200 font-medium">
                    {currentPet.breed} • {distance}
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                {/* AI Insight Card */}
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex gap-3 items-start">
                  <div className="bg-indigo-500 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                      {t.match.aiAnalysis}
                    </span>
                    <p className="text-sm text-indigo-900 leading-snug mt-0.5">{currentPet.aiAnalysis}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentPet.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-stone-300 text-stone-600 font-normal py-1 px-3"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">{currentPet.bio}</p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="h-24 flex items-center justify-center gap-6 mt-4">
        <Button
          onClick={() => handleSwipe(-1)}
          className="h-14 w-14 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-rose-500 hover:border-rose-200 shadow-sm hover:shadow-md transition-all"
        >
          <X className="h-8 w-8" />
        </Button>
        <Button className="h-12 w-12 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 shadow-none border border-transparent">
          <Info className="h-6 w-6" />
        </Button>
        <Button
          onClick={() => handleSwipe(1)}
          className="h-14 w-14 rounded-full bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Heart className="h-7 w-7 fill-current" />
        </Button>
      </div>
    </div>
  )
}
