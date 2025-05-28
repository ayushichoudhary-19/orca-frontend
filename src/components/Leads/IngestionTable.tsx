import { Table, ActionIcon } from "@mantine/core"
import Image from "next/image"
import CustomBadge from "./CustomBadge"

export default function IngestionTable({
  ingestions,
}: {
  ingestions: {
    fileName: string
    uploadedAt: string
    totalLeads: number
    called?: number
    meetings?: number
    status: string
  }[]
}) {
  return (
    <Table highlightOnHover className="border rounded-md overflow-hidden">
      <thead className="bg-gray-50"
      >
        <tr
        style={{
          borderBottom: "1px solid #E7E7E9",
          borderTop: "1px solid #E7E7E9",
        }}
        >
          <th className="py-4 px-6 text-sm font-medium text-gray-600">Uploaded</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600">CSV/ CRM Name</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600">Status</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600">Connection Rate</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600">Qualified Meeting Rate</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600">Total Leads</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600">Available to Call</th>
          <th className="py-4 px-6 text-sm font-medium text-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        {ingestions.map((row, i) => {
          const total = row.totalLeads ?? 0
          const called = row.called ?? 0
          // const meetings = row.meetings ?? 0

          const connectionRate = "0/0"
          const meetingRate = "0/0"
          const availableToCall = total - called

          const date = new Date(row.uploadedAt)
          const formattedDate = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
          const formattedTime =
            `${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}`.toLowerCase()

          return (
            <tr key={i} className="border-t border-gray-200">
              <td className="py-4 px-6">
                <div className="flex flex-col">
                  <span>{formattedDate}</span>
                  <span className="text-gray-500 text-sm">{formattedTime}</span>
                </div>
              </td>
              <td className="py-4 px-6">{row.fileName}</td>
              <td className="py-4 px-6">
                <CustomBadge value={row.status} />
              </td>
              <td className="py-4 px-6">{connectionRate}</td>
              <td className="py-4 px-6">{meetingRate}</td>
              <td className="py-4 px-6">{total}</td>
              <td className="py-4 px-6">{availableToCall}</td>
              <td className="py-4 px-6">
                <ActionIcon variant="subtle" color="gray">
                  <Image
                    src="/icons/more-options.svg"
                    alt="More"
                    width={16}
                    height={16}
                  />
                </ActionIcon>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
