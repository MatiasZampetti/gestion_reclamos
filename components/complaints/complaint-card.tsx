"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MapPin, Calendar, Edit, Trash2, Eye } from "lucide-react"
import type { Complaint } from "@/types/complaint"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import Link from "next/link"

interface ComplaintCardProps {
  complaint: Complaint
  showActions?: boolean
  onVote?: (complaintId: string, voteType: "positive" | "negative") => void
  onEdit?: (complaint: Complaint) => void
  onDelete?: (complaintId: string) => void
}

export function ComplaintCard({ complaint, showActions = false, onVote, onEdit, onDelete }: ComplaintCardProps) {
  const { user } = useAuth()
  const [userVote, setUserVote] = useState<"positive" | "negative" | null>(
    user ? complaint.votes.userVotes[user.id] || null : null,
  )

  const isOwnComplaint = user?.id === complaint.authorId
  const canVote = user && !isOwnComplaint && onVote

  const handleVote = (voteType: "positive" | "negative") => {
    if (!canVote) return

    const newVote = userVote === voteType ? null : voteType
    setUserVote(newVote)
    onVote(complaint.id, voteType)
  }

  const getStatusColor = (status: string) => {
    return status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{complaint.entity}</Badge>
              <Badge variant="secondary">{complaint.category}</Badge>
              <Badge variant="outline" className="text-xs">
                {complaint.subcategory}
              </Badge>
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status === "open" ? "Abierto" : "Cerrado"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{complaint.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{complaint.authorName}</span>
          <Calendar className="h-4 w-4 ml-2" />
          <span>{complaint.createdAt.toLocaleDateString()}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 mb-3 line-clamp-3">{complaint.description}</p>

        {complaint.location && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{complaint.location}</span>
          </div>
        )}

        {complaint.photo && (
          <div className="mb-4">
            <img
              src={complaint.photo || "/placeholder.svg"}
              alt="Foto del reclamo"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {canVote && (
              <>
                <Button
                  variant={userVote === "positive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVote("positive")}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {complaint.votes.positive}
                </Button>
                <Button
                  variant={userVote === "negative" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleVote("negative")}
                  className="flex items-center gap-1"
                >
                  <ThumbsDown className="h-4 w-4" />
                  {complaint.votes.negative}
                </Button>
              </>
            )}

            {!canVote && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {complaint.votes.positive}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4" />
                  {complaint.votes.negative}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/complaints/${complaint.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            {showActions && isOwnComplaint && (
              <>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(complaint)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(complaint.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
