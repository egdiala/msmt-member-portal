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
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [deviceLoadingComplete, setDeviceLoadingComplete] =
    useState<boolean>(false);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const deviceInitializedRef = useRef<boolean>(false);

  // Function to safely get media devices
  const getDevices = async () => {
    if (deviceInitializedRef.current) return;
    deviceInitializedRef.current = true;
    setPermissionError(null);

    try {
      let devices = await navigator.mediaDevices.enumerateDevices();

      let audioPermissionGranted = false;
      let videoPermissionGranted = false;

      if (audioEnabled) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          audioPermissionGranted = true;
          setTimeout(() => {
            audioStream.getTracks().forEach((track) => track.stop());
          }, 500);
        } catch (e) {
          console.warn("Could not get audio permissions:", e);
        }
      }

      if (videoEnabled) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
          });
          videoPermissionGranted = true;
          setTimeout(() => {
            videoStream.getTracks().forEach((track) => track.stop());
          }, 500);
        } catch (e) {
          console.warn("Could not get video permissions:", e);
        }
      }

      if (audioPermissionGranted || videoPermissionGranted) {
        devices = await navigator.mediaDevices.enumerateDevices();
      }

      const audioInputs = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
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

      // Only show error if we needed permissions but didn't get them
      if (
        (audioEnabled && !audioPermissionGranted) ||
        (videoEnabled && !videoPermissionGranted)
      ) {
        setPermissionError(
          "Unable to access camera/microphone. Please grant permissions when prompted."
        );
      }
    } catch (err) {
      console.error("Error getting media devices:", err);
      setPermissionError(
        "Unable to access camera/microphone. Please check permissions."
      );
    } finally {
      setDeviceLoadingComplete(true);
    }
  };

  // Cleanup video stream when component unmounts
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initializeDevices = () => {
    deviceInitializedRef.current = false;
    getDevices();
  };

  // Handle video preview - Fix for the twitching issue
  useEffect(() => {
    // Only start video preview when all conditions are met
    const startVideoPreview = async () => {
      // Stop existing stream first
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }

      try {
        if (videoEnabled && selectedVideoDevice && videoPreviewRef.current) {
          let stream;
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: selectedVideoDevice } },
            });
          } catch (err) {
            console.log(
              "Failed with selected device, trying default camera",
              err
            );
            // If that fails, try with default camera
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
          }

          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
            setVideoStream(stream);
          }
        }
      } catch (err) {
        console.error("Error starting video preview:", err);
        setPermissionError(
          "Could not start camera preview. Please check permissions."
        );
      }
    };

    // Only re-run this effect when these dependencies change
    if (deviceLoadingComplete) {
      if (videoEnabled && selectedVideoDevice) {
        startVideoPreview();
      } else if (!videoEnabled && videoStream) {
        // Turn off video if disabled
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      }
    }
  }, [selectedVideoDevice, videoEnabled, deviceLoadingComplete]);

  const handleJoin = () => {
    // Stop the preview stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    onJoin(
      audioEnabled && audioDevices.length > 0,
      videoEnabled && videoDevices.length > 0,
      audioEnabled && audioDevices.length > 0 ? selectedAudioDevice : undefined,
      videoEnabled && videoDevices.length > 0 ? selectedVideoDevice : undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Join Meeting</h2>

        {!deviceLoadingComplete ? (
          <div className="mb-6 text-left">
            <p className="mb-4">
              To join with audio/video, your browser needs permission to access
              your camera and microphone.
            </p>
            <button
              onClick={initializeDevices}
              className="px-4 py-2 bg-brand-accent-2 text-white rounded hover:bg-opacity-80 transition"
            >
              Set Up Audio & Video
            </button>
          </div>
        ) : (
          <>
            {permissionError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                <p>{permissionError}</p>
                <button
                  onClick={initializeDevices}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Audio Device Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Audio</label>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none ${
                    audioEnabled ? "bg-brand-accent-2" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      audioEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {audioEnabled && (
                <select
                  value={selectedAudioDevice}
                  onChange={(e) => setSelectedAudioDevice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!audioEnabled}
                >
                  {audioDevices.length > 0 ? (
                    audioDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))
                  ) : (
                    <option value="">No microphones available</option>
                  )}
                </select>
              )}
            </div>

            {/* Video Device Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Video</label>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none ${
                    videoEnabled ? "bg-brand-accent-2" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      videoEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {videoEnabled && (
                <>
                  <select
                    value={selectedVideoDevice}
                    onChange={(e) => setSelectedVideoDevice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    disabled={!videoEnabled}
                  >
                    {videoDevices.length > 0 ? (
                      videoDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))
                    ) : (
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
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-brand-accent-2 text-white rounded hover:bg-opacity-80 transition"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectionModal;