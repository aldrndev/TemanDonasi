import { GrClose } from 'react-icons/gr';

const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 text-center mb-3"
                  id="modal-title"
                >
                  User Detail
                </h3>
                <div className="mt-2">
                  <div className="my-4 flex justify-center items-center">
                    <img
                      src={user.Profile.profileImg}
                      alt={`User Pic ${user.id}`}
                      className="inline object-cover w-48 h-48 mr-2 rounded mb-3"
                    />
                  </div>
                  <p className="mb-3">
                    <strong>Nama Lengkap:</strong> {user.Profile.fullName}
                  </p>
                  <p className="mb-3">
                    <strong>No Telephone:</strong> {user.Profile.phoneNumber}
                  </p>
                  <p className="mb-3">
                    <strong>Alamat:</strong> {user.Profile.address}
                  </p>
                  <p className="mb-3">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="mb-3">
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p className="mb-3">
                    <strong>Role:</strong> {user.role}
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

export default UserDetailModal;
