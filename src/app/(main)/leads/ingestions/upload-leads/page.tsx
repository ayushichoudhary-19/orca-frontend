"use client"

import { useState } from "react"
import LeadUploadOptions from "@/components/Leads/LeadUploadOptions"
import FieldMappingStep from "@/components/Leads/FieldMappingStep"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function UploadLeadsPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<any[] | null>(null)
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId)

  const handleCsvReady = (file: File, data: any[]) => {
    setCsvFile(file)
    setParsedRows(data)
  }
  if(!campaignId) return null

  return (
    <>
      {!csvFile || !parsedRows ? (
        <LeadUploadOptions onNext={handleCsvReady} />
      ) : (
        <FieldMappingStep file={csvFile} csvRows={parsedRows} campaignId={campaignId} />
      )}
    </>
  )
}
