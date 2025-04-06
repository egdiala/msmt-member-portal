import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScreenShare, Image, FileText, Presentation } from "lucide-react";
import { useVideoSDKMeeting } from "@/hooks/use-videosdk";

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal = ({ onClose }: ShareModalProps) => {
  const meeting = useVideoSDKMeeting();
  
  const shareOptions = [
    { title: "Your Entire Screen", icon: <ScreenShare className="h-6 w-6" /> },
    { title: "Application Window", icon: <Presentation className="h-6 w-6" /> },
    { title: "Browser Tab", icon: <FileText className="h-6 w-6" /> },
    { title: "Image/Document", icon: <Image className="h-6 w-6" /> }
  ];

  const handleShareSelect = (option: string) => {
    // Use VideoSDK to share content
    if (meeting && meeting.enableScreenShare) {
      meeting.enableScreenShare();
    }
    console.log(`Selected share option: ${option}`);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Content</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {shareOptions.map((option, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              onClick={() => handleShareSelect(option.title)}
            >
              {option.icon}
              <span className="mt-2 text-sm text-center">{option.title}</span>
            </div>
          ))}
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;