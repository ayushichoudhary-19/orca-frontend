"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { IconBuilding, IconCash, IconChartBar, IconUsers, IconReceipt } from '@tabler/icons-react'

const settingsOptions = [
  {
    title: "Basic Details",
    description: "Manage your organization's basic information and settings",
    path: "/settings/basic-details",
    icon: IconBuilding
  },
  {
    title: "Pricing & Qualifications",
    description: "Configure pricing models and qualification criteria",
    path: "/settings/pricing-qualifications",
    icon: IconCash
  },
  {
    title: "Campaign Controls",
    description: "Set up and manage campaign parameters and controls",
    path: "/settings/campaign-controls",
    icon: IconChartBar
  },
  {
    title: "Account Executives",
    description: "Manage account executives and their permissions",
    path: "/settings/account-executives",
    icon: IconUsers
  },
  {
    title: "Billing",
    description: "View and manage billing information and invoices",
    path: "/settings/billing",
    icon: IconReceipt
  }
]

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsOptions.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="cursor-pointer"
            onClick={() => router.push(option.path)}
          >
            <div 
              className="border border-[#E8E4FF] rounded-lg p-5 h-full bg-white hover:bg-[#F8F6FF] transition-colors duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#F0EDFF] p-2 rounded-md">
                  <option.icon size={24} className="text-[#6D57FC]" stroke={1.5} />
                </div>
                <h2 className="text-lg font-semibold">{option.title}</h2>
              </div>
              <p className="text-gray-600 text-sm">{option.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
