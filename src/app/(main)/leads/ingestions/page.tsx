"use client";

import { useEffect, useState } from "react";
import LeadAnalyticsTabs from "@/components/Leads/LeadAnalyticsTabs";
import { axiosClient } from "@/lib/axiosClient";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

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
  _id: string;
  total: number;
  phoneCount: number;
  mobileCount: number;
  enrichedCount: number;
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
  quality: {
    phoneCount: number;
    mobileCount: number;
    enrichedCount: number;
    total: number;
  };
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
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        if (!campaignId) {
          setLoading(false);
          return;
        }

        const res = await axiosClient.get(`/api/leads/metrics/${campaignId}`);
        const raw = res.data;

        const healthStats: HealthStats[] = raw.healthStats || [];
        const performanceStats: PerformanceStats[] = raw.performanceStats || [];
        const qualityStats: QualityStats[] = raw.qualityStats || [];
        const ingestionFiles: string[] = raw.ingestionFiles || [];

        const health = {
          statusCounts: healthStats.reduce(
            (acc, s) => {
              acc[s._id] = s.count;
              return acc;
            },
            {} as Record<string, number>
          ),
          total: healthStats.reduce((sum, s) => sum + s.count, 0),
        };

        const performance = {
          total: performanceStats.reduce((sum, s) => sum + s.total, 0),
          called: performanceStats.reduce((sum, s) => sum + (s.called || 0), 0),
          meetings: performanceStats.reduce((sum, s) => sum + (s.meetings || 0), 0),
        };

        const quality = qualityStats[0] || {
          phoneCount: 0,
          mobileCount: 0,
          enrichedCount: 0,
          total: 0,
        };

        const ingestions = ingestionFiles.map((file) => {
          const perf: PerformanceStats = performanceStats.find((p) => p._id === file) ?? {
            _id: file,
            total: 0,
            called: 0,
            meetings: 0,
          };

          return {
            uploadedAt: new Date().toISOString(),
            fileName: file,
            status: Math.random() > 0.3 ? "Uploaded" : "Draft",
            totalLeads: perf.total,
            called: perf.called ?? 0,
            meetings: perf.meetings ?? 0,
          };
        });

        setMetrics({
          health,
          performance,
          quality,
          ingestions,
        });
      } catch (err) {
        console.error("Error loading analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [campaignId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading lead data...</div>;
  }

  return <LeadAnalyticsTabs data={metrics} />;
}
