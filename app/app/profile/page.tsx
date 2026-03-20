"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Share2, Trophy, Heart, Calendar, LogOut, Edit3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, logout, refreshUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    pet_name: "",
    pet_breed: "",
    pet_age: "",
    pet_bio: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const startEditing = () => {
    setEditData({
      pet_name: user?.pet_name || "",
      pet_breed: user?.pet_breed || "",
      pet_age: user?.pet_age || "",
      pet_bio: user?.pet_bio || "",
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })
      if (res.ok) {
        await refreshUser()
        setIsEditing(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const petName = user?.pet_name || t.profile?.petName || "Max"
  const petBreed = user?.pet_breed || t.profile?.breed || "Golden Retriever"
  const petAge = user?.pet_age || t.profile?.age || "3 yrs"
  const petBio = user?.pet_bio || t.profile?.bio || "Loves playing fetch and making new friends at the park."

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      {/* User Info */}
      {user && (
        <Card className="p-4 rounded-2xl border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-stone-900">{user.username}</p>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Header */}
      <Card className="p-6 space-y-4 rounded-2xl border-stone-100 bg-white">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src="/golden-retriever.png"
              className="h-20 w-20 rounded-2xl object-cover border-2 border-orange-200"
              alt="Pet"
            />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 p-1.5 rounded-full border-2 border-white">
              <Heart className="h-4 w-4 text-white fill-current" />
            </div>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editData.pet_name}
                  onChange={(e) => setEditData({ ...editData, pet_name: e.target.value })}
                  placeholder={t.auth?.petNamePlaceholder || "Pet name"}
                  className="h-8 text-sm"
                />
                <Input
                  value={editData.pet_breed}
                  onChange={(e) => setEditData({ ...editData, pet_breed: e.target.value })}
                  placeholder={t.auth?.petBreedPlaceholder || "Breed"}
                  className="h-8 text-sm"
                />
                <Input
                  value={editData.pet_age}
                  onChange={(e) => setEditData({ ...editData, pet_age: e.target.value })}
                  placeholder={t.auth?.petAgePlaceholder || "Age"}
                  className="h-8 text-sm"
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-stone-900">{petName}</h2>
                <p className="text-stone-500 text-sm">
                  {petBreed} &bull; {petAge}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                    {t.profile?.energy || "High Energy"}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-stone-300">
                    {t.profile?.verified || "Verified"}
                  </Badge>
                </div>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={startEditing}>
            <Settings className="h-5 w-5 text-stone-600" />
          </Button>
        </div>

        {isEditing ? (
          <Input
            value={editData.pet_bio}
            onChange={(e) => setEditData({ ...editData, pet_bio: e.target.value })}
            placeholder={t.auth?.petBioPlaceholder || "Pet bio"}
            className="text-sm"
          />
        ) : (
          <p className="text-stone-600 text-sm leading-relaxed">{petBio}</p>
        )}

        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full h-10"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1 border-stone-300 rounded-full h-10 bg-transparent"
              >
                {t.auth?.back || "Cancel"}
              </Button>
            </>
          ) : (
            <>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full h-10">
                <Share2 className="h-4 w-4 mr-2" />
                {t.profile?.share || "Share Profile"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-stone-300 rounded-full h-10 bg-transparent"
                onClick={startEditing}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {t.profile?.edit || "Edit Profile"}
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Heart className="h-5 w-5 text-rose-500" />}
          value="24"
          label={t.profile?.matches || "Matches"}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          value="12"
          label={t.profile?.playdates || "Playdates"}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
          value="5"
          label={t.profile?.badges || "Badges"}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-4 space-y-2 rounded-2xl border-stone-100 bg-white">
        <h3 className="font-bold text-stone-900 mb-2">{t.profile?.settings || "Settings"}</h3>
        <MenuItem label={t.profile?.notifications || "Notifications"} />
        <MenuItem label={t.profile?.privacy || "Privacy"} />
        <MenuItem label={t.profile?.help || "Help & Support"} />
        <MenuItem label={t.profile?.about || "About WePet"} />
        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors text-rose-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">{t.profile?.logout || "Log Out"}</span>
          </button>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Card className="p-4 space-y-2 text-center rounded-2xl border-stone-100 bg-white">
      <div className="flex justify-center">{icon}</div>
      <div className="text-2xl font-bold text-stone-900">{value}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </Card>
  )
}

function MenuItem({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors">
      <span className="font-medium text-sm text-stone-700">{label}</span>
      <span className="text-stone-400">&rsaquo;</span>
    </button>
  )
}
