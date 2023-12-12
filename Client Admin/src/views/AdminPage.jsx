import { useEffect, useState } from 'react';
import UserTable from '../components/UserTable';
import { useUserStore } from '../stores/store';
import UserDetailModal from '../components/UserDetailModal';

const AdminPage = () => {
  const { users, error, loading, fetchUsers, deleteUser } = useUserStore(
    (state) => state
  );

  const filterUser = users.filter((user) => user.role === 'Admin');

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-600 ">User List</h2>
      </div>
      <UserTable
        users={filterUser}
        onDetail={handleOpenDetailModal}
        onDelete={handleDeleteUser}
      />

      {isDetailModalOpen && selectedUser && (
        <UserDetailModal user={selectedUser} onClose={handleCloseModals} />
      )}
    </div>
  );
};

export default AdminPage;
