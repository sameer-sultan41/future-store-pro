import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TAdminStats = {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalTraffic: number;
  recentOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
};

export type TAdminDashboardState = {
  stats: TAdminStats | null;
  isLoading: boolean;
  lastUpdated: string | null;
};

const initialState: TAdminDashboardState = {
  stats: null,
  isLoading: false,
  lastUpdated: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setStats: (state: TAdminDashboardState, action: PayloadAction<TAdminStats>) => {
      state.stats = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state: TAdminDashboardState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearStats: (state: TAdminDashboardState) => {
      state.stats = null;
      state.lastUpdated = null;
    },
  },
});

export const { setStats, setLoading, clearStats } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
