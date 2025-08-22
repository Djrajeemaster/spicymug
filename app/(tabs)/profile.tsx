import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Calendar, TrendingUp, MessageCircle, ThumbsUp, Settings, LogOut, Eye, Clock, CircleCheck as CheckCircle, Circle as XCircle, CreditCard as Edit3, Crown, Zap, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [isGuest, setIsGuest] = useState(true);
  const [activeTab, setActiveTab] = useState('approved');
  const [userVotes, setUserVotes] = useState([]);
  const [userActivity, setUserActivity] = useState([]);

  const userStats = {
    totalPosts: 12,
    approvalRate: 92,
    totalVotes: 156,
    memberSince: 'March 2024',
    reputation: 4.8,
    level: 'Gold Contributor'
  };

  const userDeals = {
    approved: [
      {
        id: 1,
        title: "Premium Wireless Headphones - Flash Sale",
        status: "approved",
        votes: { up: 124, down: 3 },
        comments: 28,
        timeAgo: "2 hours ago"
      },
      {
        id: 2,
        title: "Designer Denim Warehouse Sale",
        status: "approved", 
        votes: { up: 67, down: 5 },
        comments: 12,
        timeAgo: "1 day ago"
      }
    ],
    pending: [
      {
        id: 3,
        title: "Electronics Bundle Deal",
        status: "pending",
        votes: { up: 0, down: 0 },
        comments: 0,
        timeAgo: "30 minutes ago"
      }
    ],
    rejected: [
      {
        id: 4,
        title: "Too Good To Be True Sale",
        status: "rejected",
        votes: { up: 0, down: 0 },
        comments: 0,
        timeAgo: "3 days ago",
        rejectReason: "Duplicate content"
      }
    ]
  };

  const [recentActivity, setRecentActivity] = useState([
    { type: 'vote', action: 'Upvoted "Gaming Laptop Deal"', time: '1 hour ago' },
    { type: 'comment', action: 'Commented on "Pizza BOGO Deal"', time: '3 hours ago' },
    { type: 'post', action: 'Posted "Premium Headphones Deal"', time: '2 hours ago' },
  ]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Show loading state simulation
    Alert.alert(
      "Loading",
      `Loading ${tabId} deals...`,
      [{ text: "OK" }]
    );
  };

  const handleDealPress = (deal) => {
    Alert.alert(
      deal.title,
      `Status: ${deal.status}\nVotes: ${deal.votes.up} up, ${deal.votes.down} down\nComments: ${deal.comments}\n\nWhat would you like to do?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "View Details", onPress: () => Alert.alert("Deal Details", "Opening deal details...") },
        { text: "Edit Deal", onPress: () => Alert.alert("Edit Deal", "Opening edit form...") }
      ]
    );
  };

  const handleSettingsPress = () => {
    Alert.alert(
      "Account Settings",
      "Choose what to update:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Change Password", onPress: () => Alert.alert("Change Password", "Opening password change form...") },
        { text: "Profile Settings", onPress: () => Alert.alert("Profile Settings", "Opening profile settings...") },
        { text: "Notification Settings", onPress: () => Alert.alert("Notifications", "Opening notification settings...") }
      ]
    );
  };

  if (isGuest) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#d946ef']}
          style={styles.guestGradient}
        >
          <View style={styles.guestContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.guestIconContainer}
            >
              <User size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.guestTitle}>Join the SpicyBeats Community</Text>
            <Text style={styles.guestDescription}>
              Connect with deal hunters, build your reputation, and never miss amazing savings again!
            </Text>
            
            <View style={styles.benefitsContainer}>
              {[
                { icon: '🎯', text: 'Personalized deal alerts' },
                { icon: '⭐', text: 'Build your reputation' },
                { icon: '💰', text: 'Exclusive member deals' }
              ].map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Text style={styles.benefitEmoji}>{benefit.icon}</Text>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.joinButtonWrapper}
              onPress={() => setIsGuest(false)}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.joinButton}
              >
                <Text style={styles.joinButtonText}>Get Started Free</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.profileHeader}
        >
          <View style={styles.profileContent}>
            <LinearGradient
              colors={['#fbbf24', '#f59e0b']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>JS</Text>
            </LinearGradient>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.username}>john_dealseeker</Text>
                <View style={styles.verifiedContainer}>
                  <Shield size={16} color="#10B981" />
                </View>
              </View>
              
              <View style={styles.levelContainer}>
                <Crown size={14} color="#fbbf24" />
                <Text style={styles.levelText}>{userStats.level}</Text>
              </View>
              
              <View style={styles.memberInfo}>
                <Calendar size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.memberSince}>Member since {userStats.memberSince}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={22} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.statCard}
            >
              <Award size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{userStats.totalPosts}</Text>
              <Text style={styles.statLabel}>Deals Posted</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.statCard}
            >
              <Zap size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{userStats.approvalRate}%</Text>
              <Text style={styles.statLabel}>Approval Rate</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.statCard}
            >
              <ThumbsUp size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{userStats.totalVotes}</Text>
              <Text style={styles.statLabel}>Total Votes</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.statCard}
            >
              <Eye size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{userStats.reputation}</Text>
              <Text style={styles.statLabel}>Reputation</Text>
            </LinearGradient>
          </View>
        </View>

        {/* My Deals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Deals</Text>
          
          <View style={styles.tabContainer}>
            {[
              { id: 'approved', name: 'Live', count: userDeals.approved.length, color: '#10b981' },
              { id: 'pending', name: 'Review', count: userDeals.pending.length, color: '#f59e0b' },
              { id: 'rejected', name: 'Declined', count: userDeals.rejected.length, color: '#ef4444' }
            ].map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabWrapper}
                onPress={() => handleTabChange(tab.id)}
              >
                {activeTab === tab.id ? (
                  <LinearGradient
                    colors={[tab.color, `${tab.color}dd`]}
                    style={styles.tab}
                  >
                    <Text style={styles.tabTextActive}>{tab.name}</Text>
                    <View style={styles.tabBadgeActive}>
                      <Text style={styles.tabBadgeTextActive}>{tab.count}</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabInactive}>
                    <Text style={styles.tabText}>{tab.name}</Text>
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{tab.count}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dealsList}>
            {userDeals[activeTab].map(deal => (
              <TouchableOpacity 
                key={deal.id} 
                style={styles.dealItem}
                onPress={() => handleDealPress(deal)}
              >
                <View style={styles.dealHeader}>
                  <Text style={styles.dealTitle} numberOfLines={1}>{deal.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    deal.status === 'approved' && styles.statusApproved,
                    deal.status === 'pending' && styles.statusPending,
                    deal.status === 'rejected' && styles.statusRejected
                  ]}>
                    {deal.status === 'approved' && <CheckCircle size={12} color="#059669" />}
                    {deal.status === 'pending' && <Clock size={12} color="#d97706" />}
                    {deal.status === 'rejected' && <XCircle size={12} color="#dc2626" />}
                    <Text style={[
                      styles.statusText,
                      deal.status === 'approved' && styles.statusTextApproved,
                      deal.status === 'pending' && styles.statusTextPending,
                      deal.status === 'rejected' && styles.statusTextRejected
                    ]}>
                      {deal.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.dealMeta}>
                  <View style={styles.dealStats}>
                    <View style={styles.statItem}>
                      <ThumbsUp size={14} color="#10b981" />
                      <Text style={styles.dealStatText}>{deal.votes.up}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageCircle size={14} color="#6366f1" />
                      <Text style={styles.dealStatText}>{deal.comments}</Text>
                    </View>
                  </View>
                  <Text style={styles.dealTime}>{deal.timeAgo}</Text>
                </View>

                {deal.rejectReason && (
                  <View style={styles.rejectReasonContainer}>
                    <Text style={styles.rejectReason}>💡 {deal.rejectReason}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {userDeals[activeTab].length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>
                  {activeTab === 'approved' ? '🎯' : activeTab === 'pending' ? '⏳' : '❌'}
                </Text>
                <Text style={styles.emptyStateText}>No {activeTab} deals yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <LinearGradient
                colors={
                  activity.type === 'vote' ? ['#10b981', '#059669'] :
                  activity.type === 'comment' ? ['#3b82f6', '#2563eb'] :
                  ['#8b5cf6', '#7c3aed']
                }
                style={styles.activityIcon}
              >
                {activity.type === 'vote' && <ThumbsUp size={16} color="#FFFFFF" />}
                {activity.type === 'comment' && <MessageCircle size={16} color="#FFFFFF" />}
                {activity.type === 'post' && <Edit3 size={16} color="#FFFFFF" />}
              </LinearGradient>
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettingsPress}>
            <View style={styles.actionIcon}>
              <Settings size={20} color="#6366f1" />
            </View>
            <Text style={styles.actionButtonText}>Account Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => {
              Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Logout", onPress: () => setIsGuest(true) }
                ]
              );
            }}
          >
            <View style={styles.actionIconLogout}>
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  guestGradient: {
    flex: 1,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  guestDescription: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  benefitsContainer: {
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  joinButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 30,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: -0.3,
  },
  verifiedContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fbbf24',
    marginLeft: 6,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 12,
  },
  statsContainer: {
    padding: 20,
    marginTop: -20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabWrapper: {
    flex: 1,
    marginHorizontal: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 6,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
  tabBadge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabBadgeTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealsList: {
    marginTop: 8,
  },
  dealItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dealTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: '#dcfce7',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  statusTextApproved: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#d97706',
  },
  statusTextRejected: {
    color: '#dc2626',
  },
  dealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dealStatText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '600',
  },
  dealTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  rejectReasonContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  rejectReason: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionIcon: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 8,
    marginRight: 16,
  },
  actionIconLogout: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 8,
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutButtonText: {
    color: '#ef4444',
  },
  bottomPadding: {
    height: 100,
  },
});