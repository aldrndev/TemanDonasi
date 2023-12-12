import { create } from 'zustand';

const BASE_URL = 'https://temandonasi-backend.aldrincloud.com/admin';
const USER_URL = 'https://temandonasi-backend.aldrincloud.com/pub';

export const useCertificateStore = create((set) => ({
  loading: false,
  error: null,
  certificateById: {},

  fetchCertificateId: async (code) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${USER_URL}/certificate/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response, 'ini response');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      set({
        certificateById: data.data,
      });
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
export const useVerifyStore = create((set) => ({
  loading: false,
  error: null,
  isVerivied: {},

  updateIsVerified: async (verificationCode) => {
    set({ loading: true, error: null });

    try {
      console.log(verificationCode, 'store');
      const response = await fetch(`${USER_URL}/verify/${verificationCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response, 'ini response');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      set({
        isVerivied: data.data,
      });
    } catch (error) {
      set({
        error: error.message,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useAuthStore = create((set) => ({
  loading: false,
  error: null,

  login: async (email, password, navigateCallback) => {
    set({ loading: true, error: null });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    };

    try {
      const response = await fetch(`${BASE_URL}/login`, requestOptions);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('username', data.data.name);
        navigateCallback('/');
      } else {
        set({ error: data.message || 'Email atau password tidak ditemukan.' });
      }
    } catch (error) {
      set({
        error: 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.',
      });
    } finally {
      set({ loading: false });
    }
  },
  register: async (formData, navigateCallback) => {
    set({ loading: true, error: null });

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    const requestOptions = {
      method: 'POST',
      body: data,
    };

    try {
      const response = await fetch(`${BASE_URL}/register`, requestOptions);
      const responseData = await response.json();

      if (response.ok) {
        navigateCallback('/login');
      } else {
        set({
          error: responseData.message || 'Terjadi kesalahan saat registrasi.',
        });
      }
    } catch (error) {
      set({
        error: 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.',
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useCampaignStore = create((set) => ({
  campaigns: [],
  error: null,
  loading: false,

  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/post`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      set({ campaigns: data.data });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch data from server' });
    } finally {
      set({ loading: false });
    }
  },

  deleteCampaign: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/post/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      set((state) => ({
        campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to delete data from server' });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useUserDonationStore = create((set) => ({
  donations: [],
  error: null,
  loading: false,

  fetchDonations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/donation`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      set({ donations: data.data });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch data from server' });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useRewardStore = create((set) => ({
  rewards: [],
  error: null,
  loading: false,
  rewardCategories: [],

  fetchRewards: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/reward`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      set({ rewards: data.data });
    } catch (error) {
      set({
        error: error.message || 'There was a problem fetching the rewards',
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategoryReward: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/reward-category`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      set({ rewardCategories: data.data });
    } catch (error) {
      set({
        error: error.message || 'There was a problem fetching the rewards',
      });
    } finally {
      set({ loading: false });
    }
  },

  addReward: async (rewardData) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
        body: JSON.stringify(rewardData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
    } catch (error) {
      set({
        error: error.message || 'There was a problem adding the reward',
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteReward: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/reward/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      set((state) => ({
        rewards: state.rewards.filter((reward) => reward.id !== id),
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to delete data from server' });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useRedeemHistoryStore = create((set) => ({
  redeemHistory: [],
  loading: false,
  error: null,

  fetchRedeemHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/redeemHistory`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      set({ redeemHistory: data.data });
    } catch (error) {
      set({
        error:
          error.message || 'There was a problem fetching the redeem history',
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      set({ users: data.data });
    } catch (error) {
      set({
        error: error.message || 'There was a problem fetching the user data',
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to fetch data from server' });
    } finally {
      set({ loading: false });
    }
  },
}));
