import { Button, Text } from "@mantine/core";

export default function LeadQualityTab() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-white  p-6 py-4  rounded-lg"
         style={{
          border: "1px solid #E8E4FF",
          borderRadius: "0.5rem"
         }}
        >
          <Text className="text-md font-bold text-tinteddark7 mb-2">Numbers Composition</Text>

          <div className="mb-2">
            <div className="text-[32px] font-bold text-primary">0</div>
            <div className="text-sm text-tinteddark8"># of phone | (0.00%)</div>
          </div>

          <div className="mb-2">
            <div className="text-[32px] font-bold text-primary">1</div>
            <div className="text-sm text-tinteddark8"># of mobile | (100.00%)</div>
          </div>

          <div className="mb-2">
            <div className="text-[32px] font-bold text-primary">0</div>
            <div className="text-sm text-gray-500"># of enriched | (0.00%)</div>
          </div>

          <div>
            <div className="text-[32px] font-bold text-primary">1</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>

        <div className="col-span-4 bg-white  p-6 py-4  rounded-lg"
         style={{
          border: "1px solid #E8E4FF",
          borderRadius: "0.5rem"
         }}
         >
          <div className="flex justify-between items-center mb-1">
            <Text className="text-[14px] font-bold text-tinteddark7">Enrichment</Text>
            <a href="#" className="text-primary font-semibold hover:underline text-sm">
              What is enrichment
            </a>
          </div>

          <div className="mb-6">
            <div className="text-[32px] font-bold text-primary">0</div>
            <div className="text-sm text-tinteddark8"># of phone | (0.00%)</div>
          </div>

          <div className="mb-2">
          <Text className="text-[14px] font-bold text-tinteddark7">Improve Lead Quality</Text>
          
          <Text className="text-[14px] font-normal text-tinteddark7 mb-4">
         
              Increase the success of your campaign with ORCA data enrichment. Enrichment sources
              additional data points via mobile numbers to improve outreach efforts.
            </Text>
          </div>

          <Button  size="md"
          variant="primary" className="w-full rounded-lg font-normal">
           
            Lead Enrichment Requested
          </Button>
        </div>

        <div className="col-span-5 bg-white p-6 py-4 rounded-lg h-[130px]"
         style={{
          border: "1px solid #E8E4FF",
          borderRadius: "0.5rem"
         }}
         >
          <div className="flex justify-between items-center mb-1">
            <Text className="text-[14px] font-bold text-tinteddark7">Est. Viable Numbers</Text>
            <a href="#" className="text-primary font-semibold hover:underline text-sm">
              How to read lead & ingestion data
            </a>
          </div>

          <div className="mb-2">
            <div className="text-[32px] font-bold text-primary">0</div>
            <div className="text-sm text-tinteddark8"># of phone | (0.00%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
