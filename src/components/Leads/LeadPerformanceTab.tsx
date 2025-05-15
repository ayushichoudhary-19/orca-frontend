export default function LeadPerformanceTab({
  data,
}: {
  data: {
    total: number
    called: number
    meetings: number
  }
}) {
  const { total, called, meetings } = data

  const connectionRate = total > 0 ? ((called / total) * 100).toFixed(1) : "0.0"
  const meetingRate = total > 0 ? ((meetings / total) * 100).toFixed(1) : "0.0"

  return (
    <div>
      <div className="flex justify-end">
      <a href="#" className="text-primary font-semibold  hover:underline text-sm">
          How to read lead & ingestion data
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-3">Total Leads</h4>
          <p className="text-3xl font-bold text-primary">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-3">Called Leads</h4>
          <p className="text-3xl font-bold text-primary">{called}</p>
          <p className="text-sm text-gray-600 mt-2">{connectionRate}% connection rate</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-3">Meetings Booked</h4>
          <p className="text-3xl font-bold text-primary">{meetings}</p>
          <p className="text-sm text-gray-600 mt-2">{meetingRate}% meeting rate</p>
        </div>
      </div>
    </div>
  )
}
