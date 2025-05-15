import { useState, useEffect, useRef } from "react";

interface DeviceInfo {
  deviceId: string;
  label: string;
}

const DeviceSelectionModal: React.FC<{
  onJoin: (
    audioEnabled: boolean,
    videoEnabled: boolean,
    audioDeviceId?: string,
    videoDeviceId?: string
  ) => void;
  initialAudioEnabled: boolean;
  initialVideoEnabled: boolean;
}> = ({ onJoin, initialAudioEnabled, initialVideoEnabled }) => {
  const [audioDevices, setAudioDevices] = useState<DeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<DeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [audioEnabled, setAudioEnabled] =
    useState<boolean>(initialAudioEnabled);
  const [videoEnabled, setVideoEnabled] =
    useState<boolean>(initialVideoEnabled);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const deviceInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    const getDevices = async () => {
      if (deviceInitializedRef.current) return;
      deviceInitializedRef.current = true;

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        // Get all devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = devices
          .filter((device) => device.kind === "audioinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label:
              device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
          }));

        const videoInputs = devices
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`,
          }));

        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);

        if (audioInputs.length > 0) {
          setSelectedAudioDevice(audioInputs[0].deviceId);
        }

        if (videoInputs.length > 0) {
          setSelectedVideoDevice(videoInputs[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting media devices:", err);
        // If permission denied, still allow the user to join without selecting devices
      }
    };

    getDevices();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const startVideoPreview = async () => {
      try {
        // Stop any existing tracks
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
          setVideoStream(null);
        }

        if (videoEnabled && selectedVideoDevice && videoPreviewRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedVideoDevice } },
          });

          videoPreviewRef.current.srcObject = stream;
          setVideoStream(stream);
        }
      } catch (err) {
        console.error("Error starting video preview:", err);
      }
    };

    startVideoPreview();
  }, [selectedVideoDevice, videoEnabled]);

  const handleJoin = () => {
    // Stop the preview stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    onJoin(audioEnabled, videoEnabled);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Join Meeting</h2>

        {/* Audio Device Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Audio</label>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={() => setAudioEnabled((prev) => !prev)}
                className="sr-only"
                id="toggle-audio"
              />
              <label
                htmlFor="toggle-audio"
                className={`block h-6 rounded-full cursor-pointer transition-colors ${
                  audioEnabled ? "bg-brand-accent-2" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    audioEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {audioEnabled && (
            <select
              value={selectedAudioDevice}
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={!audioEnabled}
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
              {audioDevices.length === 0 && (
                <option value="">No microphones available</option>
              )}
            </select>
          )}
        </div>

        {/* Video Device Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Video</label>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={videoEnabled}
                onChange={() => setVideoEnabled((prev) => !prev)}
                className="sr-only"
                id="toggle-video"
              />
              <label
                htmlFor="toggle-video"
                className={`block h-6 rounded-full cursor-pointer transition-colors ${
                  videoEnabled ? "bg-brand-accent-2" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    videoEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {videoEnabled && (
            <>
              <select
                value={selectedVideoDevice}
                onChange={(e) => setSelectedVideoDevice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                disabled={!videoEnabled}
              >
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
                {videoDevices.length === 0 && (
                  <option value="">No cameras available</option>
                )}
              </select>

              {/* Video Preview */}
              <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
                {videoEnabled ? (
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Camera off</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-brand-accent-2 text-white rounded "
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectionModal;