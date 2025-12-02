import React, { useState } from "react";

interface ChannelDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { websiteEnabled: boolean; posEnabled: boolean }) => void;
  selectedCount: number;
}

const ChannelDisplayModal: React.FC<ChannelDisplayModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}) => {
  const [websiteEnabled, setWebsiteEnabled] = useState(false);
  const [posEnabled, setPosEnabled] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!websiteEnabled && !posEnabled) {
      alert("Vui lòng chọn ít nhất một kênh");
      return;
    }

    onConfirm({
      websiteEnabled,
      posEnabled,
    });
  };

  const handleReset = () => {
    setWebsiteEnabled(false);
    setPosEnabled(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Hiển thị trên kênh</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Website Section */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="website-checkbox"
                checked={websiteEnabled}
                onChange={(e) => setWebsiteEnabled(e.target.checked)}
                className="w-4 h-4 text-[#E04D30] bg-gray-100 border-gray-300 rounded focus:ring-[#E04D30] focus:ring-2 accent-[#E04D30]"
              />
              <label htmlFor="website-checkbox" className="ml-2 text-sm font-medium text-gray-700">
                Website
              </label>
            </div>
          </div>

          {/* POS Section */}
          <div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="pos-checkbox"
                checked={posEnabled}
                onChange={(e) => setPosEnabled(e.target.checked)}
                className="w-4 h-4 text-[#E04D30] bg-gray-100 border-gray-300 rounded focus:ring-[#E04D30] focus:ring-2 accent-[#E04D30]"
              />
              <label htmlFor="pos-checkbox" className="ml-2 text-sm font-medium text-gray-700">
                POS
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="px-4 py-2 border border-[#E04D30] text-[#E04D30] rounded-lg hover:bg-[#E04D30] hover:bg-opacity-10 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#E04D30] text-white rounded-lg hover:bg-[#c93d26] transition-colors"
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelDisplayModal;

