import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Settings, MapPin, Mail, Smartphone, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

export default function AlertsScreen() {
  const [preferences, setPreferences] = useState({
    electronics: true,
    food: false,
    clothing: true,
    home: false,
    automotive: false,
    services: true,
    nearMe: true,
    weeklyDigest: false,
    pushNotifications: true,
    emailNotifications: false
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "New Electronics Deal Near You",
      description: "Gaming laptop 40% off at TechWorld - 3.2 miles away",
      time: "2 hours ago",
      isRead: false,
      category: "electronics"
    },
    {
      id: 2,
      title: "Weekly Deals Digest",
      description: "15 new deals this week in your favorite categories",
      time: "1 day ago",
      isRead: true,
      category: "digest"
    },
    {
      id: 3,
      title: "Popular Deal Trending",
      description: "Pizza BOGO deal is getting lots of votes!",
      time: "2 days ago",
      isRead: true,
      category: "food"
    }
  ]);

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'food', name: 'Food & Dining', icon: '🍕' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'home', name: 'Home & Garden', icon: '🏠' },
    { id: 'automotive', name: 'Automotive', icon: '🚗' },
    { id: 'services', name: 'Services', icon: '🔧' },
  ];

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Show feedback
    const newValue = !preferences[key];
    Alert.alert(
      "Preference Updated",
      `${key} notifications ${newValue ? 'enabled' : 'disabled'}`,
      [{ text: "OK" }]
    );
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    
    Alert.alert(
      "Alert Details",
      alerts.find(a => a.id === alertId)?.description || "Alert details",
      [{ text: "OK" }]
    );
  };

  const handleSettingsPress = () => {
    Alert.alert(
      "Notification Settings",
      "Advanced notification settings and preferences",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bell size={24} color="#030849" />
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Settings size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {alerts.map(alert => (
            <TouchableOpacity
              key={alert.id}
              style={[styles.alertItem, !alert.isRead && styles.alertItemUnread]}
              onPress={() => markAsRead(alert.id)}
            >
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, !alert.isRead && styles.alertTitleUnread]}>
                  {alert.title}
                </Text>
                <Text style={styles.alertDescription}>
                  {alert.description}
                </Text>
                <View style={styles.alertMeta}>
                  <Clock size={12} color="#94A3B8" />
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
              {!alert.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deal Categories</Text>
          <Text style={styles.sectionDescription}>
            Get notified about deals in categories you care about
          </Text>
          
          {categories.map(category => (
            <View key={category.id} style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.preferenceName}>{category.name}</Text>
              </View>
              <Switch
                value={preferences[category.id]}
                onValueChange={() => togglePreference(category.id)}
                trackColor={{ false: '#E5E7EB', true: '#030849' }}
                thumbColor={preferences[category.id] ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        {/* Location Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Proximity</Text>
          <Text style={styles.sectionDescription}>
            Control location-based notifications
          </Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <MapPin size={20} color="#64748B" style={styles.preferenceIcon} />
              <View>
                <Text style={styles.preferenceName}>Near Me Alerts</Text>
                <Text style={styles.preferenceSubtext}>
                  Get notified about deals within 5 miles
                </Text>
              </View>
            </View>
            <Switch
              value={preferences.nearMe}
              onValueChange={() => togglePreference('nearMe')}
              trackColor={{ false: '#E5E7EB', true: '#030849' }}
              thumbColor={preferences.nearMe ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Methods</Text>
          <Text style={styles.sectionDescription}>
            Choose how you want to receive notifications
          </Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Smartphone size={20} color="#64748B" style={styles.preferenceIcon} />
              <Text style={styles.preferenceName}>Push Notifications</Text>
            </View>
            <Switch
              value={preferences.pushNotifications}
              onValueChange={() => togglePreference('pushNotifications')}
              trackColor={{ false: '#E5E7EB', true: '#030849' }}
              thumbColor={preferences.pushNotifications ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Mail size={20} color="#64748B" style={styles.preferenceIcon} />
              <Text style={styles.preferenceName}>Email Notifications</Text>
            </View>
            <Switch
              value={preferences.emailNotifications}
              onValueChange={() => togglePreference('emailNotifications')}
              trackColor={{ false: '#E5E7EB', true: '#030849' }}
              thumbColor={preferences.emailNotifications ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Mail size={20} color="#64748B" style={styles.preferenceIcon} />
              <View>
                <Text style={styles.preferenceName}>Weekly Digest</Text>
                <Text style={styles.preferenceSubtext}>
                  Summary of top deals every Sunday
                </Text>
              </View>
            </View>
            <Switch
              value={preferences.weeklyDigest}
              onValueChange={() => togglePreference('weeklyDigest')}
              trackColor={{ false: '#E5E7EB', true: '#030849' }}
              thumbColor={preferences.weeklyDigest ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Status Summary */}
        <View style={styles.statusSection}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.statusText}>
            You will receive notifications for {Object.values(preferences).filter(Boolean).length} active preferences
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#030849',
    marginLeft: 8,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  alertItemUnread: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  alertTitleUnread: {
    fontWeight: '600',
    color: '#1E293B',
  },
  alertDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 6,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  preferenceIcon: {
    marginRight: 12,
  },
  preferenceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  preferenceSubtext: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
    flex: 1,
  },
});