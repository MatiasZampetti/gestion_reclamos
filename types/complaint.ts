export interface Complaint {
  id: string
  title: string
  entity: string
  category: string
  subcategory: string
  description: string
  location: string
  photo?: string
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
  status: "open" | "closed"
  votes: {
    positive: number
    negative: number
    userVotes: { [userId: string]: "positive" | "negative" }
  }
}

export interface Vote {
  complaintId: string
  userId: string
  type: "positive" | "negative"
}
