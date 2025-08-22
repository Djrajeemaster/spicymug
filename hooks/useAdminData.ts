import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { UserRole } from '@/types/user';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: 'active' | 'banned' | 'suspended';
  joinDate: string;
  totalPosts: number;
  reputation: number;
}

export interface AdminCategory {
  id: number;
  name: string;
  emoji: string;
  isActive: boolean;
  dealCount: number;
}

export interface AdminBanner {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  priority: number;
  image: string;
}

export interface AdminDeal {
  id: number;
  title: string;
  user: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  flagged: boolean;
  reportCount: number;
}

export interface AdminStats {
  totalUsers: number;
  activeDeals: number;
  pendingReviews: number;
  totalRevenue: string;
  dailyActiveUsers: number;
  conversionRate: string;
}

export interface SystemSettings {
  autoApproveVerifiedUsers: boolean;
  requireModeration: boolean;
  allowGuestPosting: boolean;
  maxDailyPosts: number;
  minReputationToPost: number;
}

const initialUsers: AdminUser[] = [
  { id: 1, username: 'john_dealseeker', email: 'john@email.com', role: 'user', status: 'active', joinDate: '2024-01-15', totalPosts: 12, reputation: 4.8 },
  { id: 2, username: 'deal_hunter_pro', email: 'hunter@email.com', role: 'moderator', status: 'active', joinDate: '2024-02-01', totalPosts: 45, reputation: 4.9 },
  { id: 3, username: 'business_owner', email: 'biz@email.com', role: 'business', status: 'active', joinDate: '2024-01-20', totalPosts: 28, reputation: 4.6 },
  { id: 4, username: 'verified_user', email: 'verified@email.com', role: 'verified', status: 'active', joinDate: '2024-02-15', totalPosts: 18, reputation: 4.3 },
  { id: 5, username: 'spammer_user', email: 'spam@email.com', role: 'user', status: 'banned', joinDate: '2024-03-10', totalPosts: 2, reputation: 1.2 }
];

const initialCategories: AdminCategory[] = [
  { id: 1, name: 'Electronics', emoji: '📱', isActive: true, dealCount: 156 },
  { id: 2, name: 'Food & Dining', emoji: '🍕', isActive: true, dealCount: 89 },
  { id: 3, name: 'Clothing', emoji: '👕', isActive: true, dealCount: 67 },
  { id: 4, name: 'Home & Garden', emoji: '🏠', isActive: false, dealCount: 23 }
];

const initialBanners: AdminBanner[] = [
  { id: 1, title: 'Black Friday Mega Sale', description: 'Up to 80% off on electronics', isActive: true, priority: 1, image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, title: 'Holiday Food Deals', description: 'Best restaurant offers this season', isActive: true, priority: 2, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, title: 'Spring Fashion Sale', description: 'New arrivals at amazing prices', isActive: false, priority: 3, image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400' }
];

const initialDeals: AdminDeal[] = [
  { id: 1, title: 'iPhone 15 Pro Max 50% Off', user: 'deal_master', category: 'Electronics', status: 'pending', flagged: false, reportCount: 0 },
  { id: 2, title: 'Free Pizza Every Day Forever', user: 'suspicious_user', category: 'Food', status: 'pending', flagged: true, reportCount: 5 },
  { id: 3, title: 'Designer Shoes Clearance', user: 'fashion_guru', category: 'Clothing', status: 'pending', flagged: false, reportCount: 1 }
];

const initialStats: AdminStats = {
  totalUsers: 1247,
  activeDeals: 342,
  pendingReviews: 23,
  totalRevenue: '$12,450',
  dailyActiveUsers: 856,
  conversionRate: '3.2%'
};

const initialSettings: SystemSettings = {
  autoApproveVerifiedUsers: true,
  requireModeration: true,
  allowGuestPosting: false,
  maxDailyPosts: 5,
  minReputationToPost: 2.0
};

export const useAdminData = () => {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
  const [banners, setBanners] = useState<AdminBanner[]>(initialBanners);
  const [pendingDeals, setPendingDeals] = useState<AdminDeal[]>(initialDeals);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(initialSettings);

  // Memoized computed values
  const adminStats = useMemo<AdminStats>(() => ({
    ...initialStats,
    totalUsers: users.length,
    pendingReviews: pendingDeals.length,
  }), [users.length, pendingDeals.length]);

  // User management actions
  const handleUserAction = useCallback((userId: number, action: 'Ban' | 'Unban') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    Alert.alert(
      `${action} User`,
      `Are you sure you want to ${action.toLowerCase()} ${user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action, 
          style: action === 'Ban' ? 'destructive' : 'default',
          onPress: () => {
            setUsers(prev => prev.map(u => 
              u.id === userId 
                ? { ...u, status: action === 'Ban' ? 'banned' : 'active' }
                : u
            ));
            Alert.alert('Success', `User ${action.toLowerCase()}ned successfully`);
          }
        }
      ]
    );
  }, [users]);

  // Deal management actions
  const handleDealAction = useCallback((dealId: number, action: 'Approve' | 'Reject') => {
    const deal = pendingDeals.find(d => d.id === dealId);
    if (!deal) return;
    
    Alert.alert(
      `${action} Deal`,
      `${action} "${deal.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action,
          onPress: () => {
            setPendingDeals(prev => prev.filter(d => d.id !== dealId));
            Alert.alert('Success', `Deal ${action.toLowerCase()}d successfully`);
          }
        }
      ]
    );
  }, [pendingDeals]);

  // Category management actions
  const toggleCategory = useCallback((categoryId: number) => {
    setCategories(prev => prev.map(c => 
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    ));
  }, []);

  const addNewCategory = useCallback(() => {
    Alert.alert(
      'Add New Category',
      'This would open a form to add a new category',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Category', 
          onPress: () => {
            const newCategory: AdminCategory = {
              id: Date.now(),
              name: 'New Category',
              emoji: '📦',
              isActive: true,
              dealCount: 0
            };
            setCategories(prev => [...prev, newCategory]);
            Alert.alert('Success', 'Category added successfully');
          }
        }
      ]
    );
  }, []);

  // Banner management actions
  const toggleBanner = useCallback((bannerId: number) => {
    setBanners(prev => prev.map(b => 
      b.id === bannerId ? { ...b, isActive: !b.isActive } : b
    ));
  }, []);

  const addNewBanner = useCallback(() => {
    Alert.alert(
      'Add New Banner',
      'This would open a form to create a new promotional banner',
      [{ text: 'OK' }]
    );
  }, []);

  // Settings management
  const updateSetting = useCallback(<K extends keyof SystemSettings>(
    key: K, 
    value: SystemSettings[K]
  ) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    // Data
    users,
    categories,
    banners,
    pendingDeals,
    systemSettings,
    adminStats,
    
    // Actions
    handleUserAction,
    handleDealAction,
    toggleCategory,
    addNewCategory,
    toggleBanner,
    addNewBanner,
    updateSetting,
  };
};