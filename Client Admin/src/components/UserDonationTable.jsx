import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';

const UserDonationTable = ({ donations }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleShowModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowModal(true);
  };

  return (
    <div className="relative">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-800 bg-opacity-50"
            style={{ zIndex: 1000 }}
          >
            <div className="relative bg-white p-5 rounded flex flex-col items-center">
              <img
                src={currentImage}
                alt="Verification"
                className="mb-4"
                style={{
                  width: '40%',
                  // height: '40%',
                  objectFit: 'contain',
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-0 right-0 m-3 text-gray-900"
              >
                <GrClose size={18} />
              </button>
            </div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Donatur
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Campaign Donasi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Donasi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image Verify
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status Verify
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.User.Profile.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.Post.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.amountDonated}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                  {donation.isVerified ? (
                    <button
                      onClick={() => handleShowModal(donation?.verifyProofImg)}
                    >
                      <FaRegEye size={24} className="text-cyan-700" />
                    </button>
                  ) : (
                    <span>Not Verified</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.isVerified ? 'Verified' : 'Not Verified'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDonationTable;
