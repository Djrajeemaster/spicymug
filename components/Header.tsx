import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import { Bell, ChevronDown, LogIn, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { UserBadge } from '@/components/UserBadge';
import { UserRole, getRolePrivileges } from '@/types/user';

import { router } from 'expo-router';

interface HeaderProps {
  isGuest: boolean;
  onAuthPress: () => void;
  onPostPress?: () => void;
  onAlertsPress?: () => void;
  userRole?: UserRole;
  reputation?: number;
}

export function Header({ isGuest, onAuthPress, onPostPress, onAlertsPress, userRole = 'user', reputation = 4.2 }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [alertCount, setAlertCount] = useState(2);
  const [showAdminButton, setShowAdminButton] = useState(true); // Always show for testing
  
  const privileges = getRolePrivileges(userRole, reputation);

  const handleLoginPress = () => {
    Alert.alert(
      "Demo Mode",
      "In demo mode - tap again to simulate login/logout",
      [{ text: "OK", onPress: onAuthPress }]
    );
  };

  const handlePostPress = () => {
    if (!privileges.canPost) {
      Alert.alert(
        "Posting Restricted",
        userRole === 'guest' 
          ? "Please sign in to post deals"
          : `Your current role (${userRole}) doesn't allow posting. Build your reputation to unlock this feature.`,
        [{ text: "OK" }]
      );
      return;
    }
    
    if (onPostPress) {
      onPostPress();
    }
  };

  const handleAlertsPress = () => {
    if (onAlertsPress) {
      onAlertsPress();
    } else {
      Alert.alert("Alerts", "Navigate to alerts page");
    }
  };

  const handleAdminAccess = () => {
    Alert.alert(
      "Admin Access",
      "Enter admin mode?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Enter Admin", onPress: () => router.push('/admin') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030849', '#1e40af', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.mainRow}>
          <View style={styles.leftSection}>
            <LinearGradient
              colors={['#fbbf24', '#f59e0b', '#d97706']}
              style={styles.logo}
            >
              <Sparkles size={18} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.appName}>SpicyBeats</Text>
          </View>
          
          <View style={styles.rightSection}>
            {showAdminButton && (
              <TouchableOpacity style={styles.adminButton} onPress={handleAdminAccess}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.adminButtonGradient}
                >
                  <Text style={styles.adminButtonText}>Admin</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            {!isGuest && (
              <TouchableOpacity 
                style={[styles.postButton, !privileges.canPost && styles.disabledButton]} 
                onPress={handlePostPress}
              >
                <LinearGradient
                  colors={privileges.canPost ? ['#10b981', '#059669'] : ['#94a3b8', '#64748b']}
                  style={styles.postButtonGradient}
                >
                  <Text style={styles.postButtonText}>+ Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.alertButton} onPress={handleAlertsPress}>
              <View style={styles.alertIconContainer}>
                <Bell size={22} color="#FFFFFF" />
                {alertCount > 0 && (
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertBadgeText}>{alertCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            {isGuest ? (
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLoginPress}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.loginGradient}
                >
                  <LogIn size={18} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Join</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.userButton}
                onPress={() => setShowUserMenu(!showUserMenu)}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>U</Text>
                </LinearGradient>
                <UserBadge role={userRole} size="small" showText={false} reputation={reputation} />
                <ChevronDown size={14} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.navRow}>
          {[
            { id: 'discover', name: 'Discover', active: true, route: '/' },
            { id: 'trending', name: 'Trending', active: false, route: '/updeals' },
            { id: 'nearby', name: 'Nearby', active: false, route: '/nearby' },
            { id: 'saved', name: 'Saved', active: false, route: '/saved' }
          ].map(nav => (
            <TouchableOpacity
              key={nav.id}
              style={[styles.navItem, nav.active && styles.navItemActive]}
              onPress={() => {
                if (nav.route && nav.route !== '/') {
                  router.push(nav.route);
                }
              }}
            >
              <Text style={[styles.navText, nav.active && styles.navTextActive]}>{nav.name}</Text>
              {nav.active && <View style={styles.navIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#030849',
  },
  gradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : 8,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  postButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  alertButton: {
    marginRight: 16,
  },
  alertIconContainer: {
    position: 'relative',
    padding: 8,
  },
  alertBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  adminButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  adminButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  navItem: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  navItemActive: {
    // Active styling handled by indicator
  },
  navText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  navTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#fbbf24',
    borderRadius: 2,
  },
});

export { Header }