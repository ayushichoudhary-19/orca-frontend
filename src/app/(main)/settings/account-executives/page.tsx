"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Button, Table, Modal, Divider } from "@mantine/core"
import { axiosClient } from "@/lib/axiosClient"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import CustomTextInput from "@/components/Utils/CustomTextInput"

export default function AccountExecutivesPage() {
  const [email, setEmail] = useState("")
  const [connected, setConnected] = useState<any[]>([])
  const [invited, setInvited] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string | null>("connected")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const fetchAEs = async () => {
    const res = await axiosClient.get(`/api/accountExecutive/${campaignId}/account-executives`)
    setConnected(res.data.connected)
    setInvited(res.data.invited)
  }

  const handleInvite = async () => {
    await axiosClient.post(`/api/accountExecutive/${campaignId}/invite-ae`, { email })
    setEmail("")
    setIsModalOpen(false)
    fetchAEs()
  }

  const handleRemove = async (userId: string) => {
    await axiosClient.delete(`/api/accountExecutive/${campaignId}/account-executives/${userId}`)
    fetchAEs()
  }

  useEffect(() => {
    fetchAEs()
  }, [])

  const EmptyState = () => (
    <div className="text-center py-16">
      <h3 className="text-xl font-medium mb-2">No Account Executives Yet</h3>
      <p className="text-tinteddark7 max-w-md mx-auto mb-8 text-sm">
        You don not have any activated AE yet. But that iss okay. Send invites to the AEs that you want to manage your
        campaigns qualified meetings.
      </p>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-2 rounded-lg font-normal"
        size="md"
      >
        Invite an AE to Join ORCA
      </Button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Account Executives</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6D57FC] hover:bg-[#5A48D6] text-white px-6 py-2 rounded-lg transition-colors"
        >
          Invite Account Executive
        </Button>
      </div>

      <div className="mb-8">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-200">
          <Button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "connected" ? "bg-[#6D57FC] text-white" : "bg-white text-darker"
            }`}
            onClick={() => setActiveTab("connected")}
            style={{
                borderLeft: "1px solid #B7B6BB",
                borderTop: "1px solid #B7B6BB",
                borderBottom: "1px solid #B7B6BB",
                borderRight: "0px",
            }}
            size="md"
          >
            Connected ({connected.length})
          </Button>
          <Button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "invited" ? "bg-[#6D57FC] text-white" : "bg-white text-darker"
            }`}
            size="md"
            style={{
                borderRight: "1px solid #B7B6BB",
                borderTop: "1px solid #B7B6BB",
                borderBottom: "1px solid #B7B6BB",
                borderLeft: "0",
            }}
            onClick={() => setActiveTab("invited")}
          >
            Invited ({invited.length})
          </Button>
        </div>
      </div>

      {activeTab === "connected" && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {connected.length > 0 ? (
            <Table>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Account Executive</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {connected.map((ae) => (
                  <tr key={ae._id} className="border-t border-gray-200">
                    <td className="px-6 py-4 text-sm">{ae.name}</td>
                    <td className="px-6 py-4 text-sm">Active</td>
                    <td className="px-6 py-4 text-sm">{ae.email}</td>
                    <td className="px-6 py-4 text-sm">{new Date().toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        size="md"
                        variant="filled"
                        color="red"
                        onClick={() => handleRemove(ae._id)}
                        className="bg-red-500 hover:bg-red-50"
                      >
                        Revoke access
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState />
          )}
        </div>
      )}

      {activeTab === "invited" && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {invited.length > 0 ? (
            <Table>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Invited</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invited.map((invite) => (
                  <tr key={invite._id} className="border-t border-gray-200">
                    <td className="px-6 py-4 text-sm">{invite.email}</td>
                    <td className="px-6 py-4 text-sm">{invite.status}</td>
                    <td className="px-6 py-4 text-sm">{new Date().toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                    <Button
                        size="sm"
                        radius={10}
                        variant="filled"
                        color="red"
                        onClick={() => handleRemove(invite._id)}
                        className="bg-red-500 hover:bg-red-200 hover:text-red-500"
                      >
                        Revoke access
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState />
          )}
        </div>
      )}

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        padding="xl"
        size="xl"
        radius="md"
        title={
          <span className="text-3xl font-bold text-[#0C0A1C] block text-center w-full mt-8">
            Invite Account Executive(s) to ORCA
          </span>
        }
        closeButtonProps={{
          className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
          style: { border: "1px solid #0C0A1C" },
          size: "sm",
        }}
        classNames={{
          body: "pb-0 pt-2 px-8",
          content: "rounded-2xl",
          header: "w-full flex justify-center pb-4 border-b border-[#E7E7E9]",
          title: "flex-1 text-center",
        }}
        styles={{ content: { height: "510px" } }}
      >
        <Divider className="mb-4" />
        <div className="py-4">
          <CustomTextInput
            placeholder="Enter email addresses to invite Account Executive(s). Separate each email address with a comma."
            multiline = {true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          <div className="text-sm text-gray-500 mb-8">400 characters remaining</div>
        

          <div className="sticky bottom-0 bg-white pt-4">
          <Divider color="#E7E7E9" />
          <div className="flex justify-end gap-3 py-6">
            <Button variant="outline"  onClick={() => setIsModalOpen(false)} size="md" radius="md">
              Cancel
            </Button>
            <Button
               onClick={handleInvite}
              size="md"
              radius="md"
            >
              Save
            </Button>
          </div>
        </div>

        </div>
      </Modal>
    </div>
  )
}