import type { Complaint } from "@/types/complaint"
import { mockComplaints } from "./mock-data"

const COMPLAINTS_KEY = "complaints_data"

export const getStoredComplaints = (): Complaint[] => {
  if (typeof window === "undefined") return mockComplaints

  try {
    const stored = localStorage.getItem(COMPLAINTS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return parsed.map((complaint: any) => ({
        ...complaint,
        createdAt: new Date(complaint.createdAt),
        updatedAt: new Date(complaint.updatedAt),
      }))
    }
  } catch (error) {
    console.error("Error loading complaints from storage:", error)
  }

  // Initialize with mock data if nothing stored
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(mockComplaints))
  return mockComplaints
}

export const saveComplaint = (complaint: Complaint): void => {
  if (typeof window === "undefined") return

  try {
    const existing = getStoredComplaints()
    const updated = [complaint, ...existing]
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving complaint:", error)
  }
}

export const updateComplaint = (complaintId: string, updates: Partial<Complaint>): void => {
  if (typeof window === "undefined") return

  try {
    const existing = getStoredComplaints()
    const updated = existing.map((complaint) =>
      complaint.id === complaintId ? { ...complaint, ...updates, updatedAt: new Date() } : complaint,
    )
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error updating complaint:", error)
  }
}

export const deleteComplaint = (complaintId: string): void => {
  if (typeof window === "undefined") return

  try {
    const existing = getStoredComplaints()
    const updated = existing.filter((complaint) => complaint.id !== complaintId)
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error deleting complaint:", error)
  }
}
