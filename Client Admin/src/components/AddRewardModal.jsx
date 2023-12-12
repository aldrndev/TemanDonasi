import { useState } from 'react';
import { useRewardStore } from '../stores/store';
import { useNavigate } from 'react-router-dom';

const AddRewardModal = ({ onAdd, onCancel, rewardCategories }) => {
  const [formInput, setFormInput] = useState({
    name: '',
    redeemPoint: '',
    rewardCategoryId: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const { addReward } = useRewardStore((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addReward(formInput);
      onAdd();
    } catch (error) {
      console.error('Failed to add reward:', error);
    }
  };

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-white bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Add New Reward
                </h3>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="rewardName"
                    >
                      Reward Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formInput.name}
                      onChange={handleInputChange}
                      className="form-input mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition duration-150"
                      placeholder="Enter reward name"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="rewardPoints"
                    >
                      Reward Points
                    </label>
                    <input
                      type="number"
                      name="redeemPoint"
                      value={formInput.redeemPoint}
                      onChange={handleInputChange}
                      className="form-input mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition duration-150"
                      placeholder="Enter reward points"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="categoryName"
                    >
                      Category Name
                    </label>
                    <select
                      name="rewardCategoryId"
                      value={formInput.rewardCategoryId}
                      onChange={handleInputChange}
                      className="form-select mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 transition duration-150"
                      required
                    >
                      <option value="" hidden disabled>
                        Select a category
                      </option>
                      {rewardCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRewardModal;
