"use client"

import { MapPin, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ExplorePage() {
  const { t } = useLanguage()

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">{t.explore.title}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
          <Input placeholder={t.explore.search} className="pl-9 bg-white border-stone-200 rounded-xl h-11" />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <Badge
            variant="secondary"
            className="bg-stone-900 text-white hover:bg-stone-800 px-4 py-2 h-auto text-sm rounded-full"
          >
            {t.explore.filters.all}
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300 text-stone-600 bg-white px-4 py-2 h-auto text-sm rounded-full whitespace-nowrap"
          >
            {t.explore.filters.walkingBuddies}
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300 text-stone-600 bg-white px-4 py-2 h-auto text-sm rounded-full whitespace-nowrap"
          >
            {t.explore.filters.petCafes}
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300 text-stone-600 bg-white px-4 py-2 h-auto text-sm rounded-full whitespace-nowrap"
          >
            {t.explore.filters.events}
          </Badge>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="h-48 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=01awz')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all"></div>
        <div className="relative z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-800">12 {t.explore.friendsNearby}</span>
        </div>
      </div>

      {/* Events List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">{t.explore.upcomingEvents}</h2>
          <Button variant="link" className="text-orange-500 text-sm h-auto p-0">
            {t.explore.viewAll}
          </Button>
        </div>

        {t.explore.events.map((event, idx) => (
          <EventCard
            key={idx}
            title={event.title}
            date={event.date}
            location={event.location}
            attendees={event.attendees}
            image={event.image}
            type={event.type}
            goingText={t.explore.going}
          />
        ))}
      </section>

      {/* Trending Spots */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-stone-800">{t.explore.popularSpots}</h2>
        <div className="grid grid-cols-2 gap-4">
          {t.explore.spots.map((spot, idx) => (
            <SpotCard key={idx} name={spot.name} rating={spot.rating} type={spot.type} />
          ))}
        </div>
      </section>
    </div>
  )
}

function EventCard({ title, date, location, attendees, image, type, goingText }: any) {
  return (
    <Card className="flex p-3 gap-3 rounded-2xl border-stone-100 shadow-sm hover:shadow-md transition-shadow">
      <img src={image || "/placeholder.svg"} className="h-20 w-20 rounded-xl object-cover bg-stone-200" alt={title} />
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {type}
            </span>
          </div>
          <h3 className="font-bold text-stone-900 mt-1 line-clamp-1">{title}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {attendees} {goingText}
          </span>
        </div>
      </div>
    </Card>
  )
}

function SpotCard({ name, rating, type }: any) {
  return (
    <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
      <div className="h-24 bg-stone-100 rounded-lg mb-3 relative overflow-hidden">
        <img
          src={`/.jpg?height=100&width=200&query=${type.toLowerCase()}`}
          className="w-full h-full object-cover"
          alt={name}
        />
        <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
          ⭐ {rating}
        </div>
      </div>
      <h4 className="font-bold text-stone-800 text-sm">{name}</h4>
      <p className="text-xs text-stone-500">{type}</p>
    </div>
  )
}
