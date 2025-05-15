"use client"

import { useEffect, useState } from "react"
import LeadAnalyticsTabs from "@/components/Leads/LeadAnalyticsTabs"
import { axiosClient } from "@/lib/axiosClient"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface HealthStats {
  _id: string;
  count: number;
}

interface PerformanceStats {
  _id: string;
  total: number;
  called?: number;
  meetings?: number;
}

interface QualityStats {
  phone: number;
  mobile: number;
  enriched: number;
  enrichmentRate: number;
  total: number;
  viable: number;
}

interface Metrics {
  health: {
    statusCounts: Record<string, number>;
    total: number;
  };
  performance: {
    total: number;
    called: number;
    meetings: number;
  };
  quality: QualityStats;
  ingestions: Array<{
    uploadedAt: string;
    fileName: string;
    status: string;
    totalLeads: number;
    called: number;
    meetings: number;
  }>;
}

export default function LeadIngestionPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        if (!campaignId) {
          setLoading(false)
          return
        }

        const res = await axiosClient.get(`/api/leads/metrics/${campaignId}`)
        const raw = res.data

        const healthStats: HealthStats[] = raw.healthStats || []
        const performanceStats: PerformanceStats[] = raw.performanceStats || []
        const qualityStats: QualityStats[] = raw.qualityStats || []
        const ingestionFiles: string[] = raw.ingestionFiles || []

        const health = {
          statusCounts: healthStats.reduce((acc: Record<string, number>, s: HealthStats) => {
            acc[s._id] = s.count
            return acc
          }, {}),
          total: healthStats.reduce((sum: number, s: HealthStats) => sum + s.count, 0),
        }

        const performance = {
          total: performanceStats.reduce((sum: number, s: PerformanceStats) => sum + s.total, 0),
          called: performanceStats.reduce((sum: number, s: PerformanceStats) => sum + (s.called || 0), 0),
          meetings: performanceStats.reduce((sum: number, s: PerformanceStats) => sum + (s.meetings || 0), 0),
        }

        const quality = qualityStats[0] || {
          phone: 0,
          mobile: 0,
          enriched: 0,
          enrichmentRate: 0,
          total: 0,
          viable: 0,
        }

        const ingestions = ingestionFiles.map((file: string) => {
          const perf = performanceStats.find((p: PerformanceStats) => p._id === file) || {}
          return {
            uploadedAt: new Date().toISOString(),
            fileName: file,
            status: Math.random() > 0.3 ? "Uploaded" : "Draft",
            totalLeads: (perf as PerformanceStats).total || 0,
            called: (perf as PerformanceStats).called || 0,
            meetings: (perf as PerformanceStats).meetings || 0,
          }
        })

        setMetrics({
          health,
          performance,
          quality,
          ingestions,
        })
      } catch (err) {
        console.error("Error loading analytics", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [campaignId])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading lead data...</div>

  return <LeadAnalyticsTabs data={metrics} />
}
