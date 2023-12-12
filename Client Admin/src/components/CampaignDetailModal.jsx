import { GrClose } from 'react-icons/gr';

const CampaignDetailModal = ({ campaign, onClose }) => {
  const formatDate = (date) => {
    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];

    const dateObj = new Date(date);

    const day = days[dateObj.getDay()];
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    return `${day}, ${dd}-${mm}-${yyyy}`;
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 text-center mb-3"
                  id="modal-title"
                >
                  Campaign Detail
                </h3>
                <div className="mt-2">
                  <div className="my-4 flex justify-center items-center flex-wrap overflow-x-auto">
                    {campaign.PostImages.map((image, index) => (
                      <div className="flex-shrink-0 m-2" key={index}>
                        <img
                          src={image.postImg}
                          alt={`Campaign pic ${index + 1}`}
                          className="object-cover w-48 h-48 rounded"
                          style={{ flexShrink: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mb-3">
                    <strong>Title:</strong> {campaign.title}
                  </p>
                  <p className="mb-3">
                    <strong>Description:</strong> {campaign.description}
                  </p>
                  <p className="mb-3">
                    <strong>Location:</strong> {campaign.location}
                  </p>
                  <p className="mb-3">
                    <strong>Goal:</strong> {campaign.goal}
                  </p>
                  <p className="mb-3">
                    <strong>Progress:</strong> {campaign.progress}%
                  </p>
                  <p className="mb-3">
                    <strong>Donated Items:</strong> {campaign.donatedItem}
                  </p>
                  <p className="mb-3">
                    <strong>Author Name:</strong> {campaign.User.username}
                  </p>
                  <p className="mb-3">
                    <strong>Expiration Date: </strong>
                    {formatDate(campaign.expirationDate)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-0 right-0 m-3 text-gray-900"
                >
                  <GrClose size={18} />
                </button>
              </div>
            </div>
          </div>
          {/* <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailModal;
