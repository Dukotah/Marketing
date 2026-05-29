"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { SendCampaignModal } from "./SendCampaignModal";

interface SendEmailButtonProps {
  campaignId: string;
  campaignName: string;
  subject: string;
  fromAddress: string;
}

export function SendEmailButton({
  campaignId,
  campaignName,
  subject,
  fromAddress,
}: SendEmailButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
      >
        <Send className="w-4 h-4" />
        Send Email Campaign
      </button>

      {open && (
        <SendCampaignModal
          campaignId={campaignId}
          campaignName={campaignName}
          subject={subject}
          fromAddress={fromAddress}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
