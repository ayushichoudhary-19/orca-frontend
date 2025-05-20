"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { axiosClient } from "@/lib/axiosClient";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mantine/core";

interface CampaignDetail {
  _id: string;
  campaignName: string;
  elevatorPitch: string;
  qualifiedLeadPrice: number;
  industry: string[];
  logoImageUrl: string;
  companyLocation: string[];
  businessName: string;
  campaignTag: string;
  // Additional fields that might be in the detailed view
  description?: string;
  requirements?: string[];
  idealPersonas?: string[];
  benefits?: string[];
}

export default function CampaignDetail({ params }: { params: { id: string } }) {
  const campaignId = usePathname().split("/").pop();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/api/campaign/${campaignId}`);
        const campaignData = response.data;

        if (campaignData) {
          campaignData.description = `Our client is a rapidly growing SaaS company focused on streamlining operations for high-volume e-commerce sellers, particularly those leveraging multi-channel fulfillment platforms. Their platform offers a unified dashboard for order management, content management, customer support, inventory tracking, and performance analytics—all designed to help sellers scale efficiently and profitably.`;
          campaignData.requirements = [
            "3+ years of experience in sales development, cold calling, and prospecting",
            "Familiarity with B2B SaaS and technology sales",
            "Prior experience selling into e-commerce, retail, or operations personas (Amazon/e-commerce experience a plus)",
            "Ability to quickly understand and communicate technical product value",
            "Passion for sales as a craft, with a desire to always be learning and improving",
            "Self-motivated, organized, and comfortable working remotely",
          ];
          campaignData.idealPersonas = [
            "Owners, Founders, and CEOs of e-commerce brands",
            "VPs/Heads of Operations, E-commerce Managers, Channel Managers",
            "Decision makers responsible for operational efficiency, order management, and customer support",
          ];
          campaignData.benefits = [
            "Work with a fast-growing SaaS company in the e-commerce enablement space",
            "Help brands solve real operational challenges and unlock growth",
            "Flexible, remote, and results-driven environment",
          ];
        }

        setCampaign(campaignData || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch campaign details:", error);
        setIsLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D57FC]"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
        <Link href="/">
          <Button className="flex items-center gap-2">
            <IconArrowLeft size={18} />
            Back to campaigns
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/campaigns">
        <div
          className="inline-flex gap-2 justify-center items-center text-tinteddark6 hover:text-tinteddark8">
            <IconArrowLeft size={18} />
            Back
            </div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">{campaign.campaignName}</h1>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">
                Remote (Global) - Commission-based per qualified meeting
              </span>
            </div>
            <Button
              className="rounded-md font-normal text-[16px]"
              onClick={ () => router.push(`/campaigns/${campaignId}/training`)}
              size="lg"
              rightSection = {  <IconArrowRight size={18}  stroke={1.5}/>}
              >
                Start Training
              
              </Button>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            This post was created on behalf of one of Orca's clients
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-gray-700 mb-4">{campaign.description}</p>
              <p className="text-gray-700 mb-4">
                The solution is purpose-built for businesses that sell on major online marketplaces
                and are seeking to centralize their operations, reduce manual processes, and improve
                customer experience. With a user-friendly interface and a focus on operational
                clarity, the platform is trusted by fast-scaling brands to protect margins and
                unlock growth.
              </p>
              <p className="text-gray-700 mb-4">
                As a fractional Sales Development Representative (SDR), you will play a critical
                role in generating top-of-funnel opportunities for a growing sales team. You'll be
                reaching out to decision makers and influencers within e-commerce brands, helping
                them discover how this platform can solve their operational pain points and
                accelerate their growth.
              </p>
              <p className="text-gray-700 mb-4">
                This is a commission-only SDR role, with compensation per qualified meeting.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">What you'll need to succeed:</h2>
              <ul className="list-disc pl-5 space-y-2">
                {campaign.requirements?.map((req, index) => (
                  <li key={index} className="text-gray-700">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Ideal personas you'll be targeting:</h2>
              <ul className="list-disc pl-5 space-y-2">
                {campaign.idealPersonas?.map((persona, index) => (
                  <li key={index} className="text-gray-700">
                    {persona}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Why this opportunity?</h2>
              <ul className="list-disc pl-5 space-y-2">
                {campaign.benefits?.map((benefit, index) => (
                  <li key={index} className="text-gray-700">
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="text-gray-700 mt-4">
                If you're passionate about sales and want to help e-commerce brands scale smarter,
                we'd love to hear from you!
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">What you'll do:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-700">
                  Grow top of sales funnel through cold outbound campaigns
                </li>
                <li className="text-gray-700">
                  Call into mobile-enriched leads who fit the target persona
                </li>
                <li className="text-gray-700">Pitch and qualify those leads</li>
                <li className="text-gray-700">
                  Generate sales-ready meetings and opportunities for Account Executives using
                  qualification criteria
                </li>
                <li className="text-gray-700">
                  Utilize your active listening skills to understand and uncover customer needs and
                  business problems to effectively communicate how the Client can solve them
                </li>
                <li className="text-gray-700">Develop strong sales and product knowledge</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">You'll receive access to:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-700">
                  An deep pool of highly targeted, mobile enriched leads
                </li>
                <li className="text-gray-700">
                  Best-of-breed power dialer technology, which leverages smart algorithms to
                  optimize the number of conversations you can have each hour
                </li>
                <li className="text-gray-700">
                  Easy to use, personal CRM for tracking the accounts you work
                </li>
                <li className="text-gray-700">AI-assisted email tools</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">You should check out this role if:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-700">
                  You're excited to work as a freelance SDR, and have the autonomy to work flexible
                  hours
                </li>
                <li className="text-gray-700">
                  You're based in the US and desire to work remotely
                </li>
                <li className="text-gray-700">
                  You have a laptop or desktop computer and stable internet connection
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">How sales reps earn with Orca</h2>

              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">About ORCA</h3>
                <p className="text-gray-700 mb-4">
                  ORCA is a next-generation concept, here today. Think of it as an Uber for B2B
                  sales development work. Whether you are actively seeking a new kind of sales work,
                  live coaching, or an opportunity to improve your skills by actually doing, ORCA is
                  your ultimate resource for everything sales.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">
                  Why can't I see the name of this specific company?
                </h3>
                <p className="text-gray-700 mb-4">
                  ORCA works with a variety of companies specifically seeking to grow their sales
                  teams, but we also prioritize privacy, safety, and trust for everyone in our
                  network, and data security is important to us. Once you join our community using
                  the "Apply now" button, you will be shown all available job opportunities that
                  match your profile.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Why do I have to join ORCA to apply?</h3>
                <p className="text-gray-700 mb-4">
                  Sales professionals often get the short end of the stick, but Orca is here to
                  change that. Our onboarding process focuses on highlighting your unique sales
                  skills and our internal algorithm will match you with the most relevant active job
                  opportunities. Essentially, by applying to this one position through us, you will
                  be considered for all others in the same job title category as well.
                </p>
                <p className="text-gray-700">
                  <Link href="#" className="text-[#6D57FC] hover:underline">
                    Learn more about ORCA sales jobs
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
              <Button
              className="rounded-md font-normal text-[16px]"
              onClick={ () => router.push(`/campaigns/${campaignId}/training`)}
              size="lg"
              rightSection = {  <IconArrowRight size={18}  stroke={1.5}/>}
              >
                Start Training
              
              </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
