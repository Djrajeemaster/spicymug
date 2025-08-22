import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Filter, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/Header';
import { DealCard } from '@/components/DealCard';
import { router } from 'expo-router';

export default function NearbyScreen() {
  const [isGuest, setIsGuest] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [radius, setRadius] = useState(5); // miles
  const [nearbyDeals, setNearbyDeals] = useState([]);

  const radiusOptions = [1, 2, 5, 10, 25];

  const sampleNearbyDeals = [
    {
      id: 1,
      title: "Coffee Shop BOGO - Walking Distance!",
      description: "Buy one get one free on all specialty drinks. Perfect for your morning commute.",
      price: "$4.99",
      originalPrice: "$9.98",
      category: "food",
      location: "Brew & Bean Cafe",
      distance: "0.2 miles",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 45, down: 1 },
      comments: 12,
      isPinned: true,
      status: 'approved',
      postedBy: "CoffeeAddict",
      isVerified: true,
      timeAgo: "30 minutes ago",
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 2,
      title: "Pharmacy 20% Off Vitamins",
      description: "All vitamins and supplements 20% off. Stock up for the season!",
      price: "Starting $8.99",
      category: "health",
      location: "HealthPlus Pharmacy",
      distance: "0.4 miles",
      coordinates: { lat: 40.7140, lng: -74.0070 },
      image: "https://images.pexels.com/photos/356054/pexels-photo-356054.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 23, down: 0 },
      comments: 5,
      isPinned: false,
      status: 'approved',
      postedBy: "HealthyLiving",
      isVerified: false,
      timeAgo: "1 hour ago",
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: 3,
      title: "Dry Cleaning 50% Off",
      description: "Professional dry cleaning service. Bring 3 items, pay for 2!",
      price: "$15.99",
      originalPrice: "$31.98",
      category: "services",
      location: "Quick Clean Express",
      distance: "0.7 miles",
      coordinates: { lat: 40.7150, lng: -74.0080 },
      image: "https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 18, down: 2 },
      comments: 3,
      isPinned: false,
      status: 'approved',
      postedBy: "CleanAndFresh",
      isVerified: true,
      timeAgo: "2 hours ago",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    if (locationEnabled) {
      setNearbyDeals(sampleNearbyDeals.filter(deal => 
        parseFloat(deal.distance) <= radius
      ));
    } else {
      setNearbyDeals([]);
    }
  }, [locationEnabled, radius]);

  const handleLocationToggle = () => {
    if (!locationEnabled) {
      Alert.alert(
        "Enable Location",
        "Allow SpicyBeats to access your location to show nearby deals?",
        [
          { text: "Not Now", style: "cancel" },
          { 
            text: "Allow", 
            onPress: () => {
              setLocationEnabled(true);
              Alert.alert("Location Enabled", "Now showing deals near you!");
            }
          }
        ]
      );
    } else {
      setLocationEnabled(false);
      Alert.alert("Location Disabled", "Location services turned off.");
    }
  };

  const handleVote = (dealId, voteType) => {
    if (isGuest) {
      Alert.alert(
        "Join SpicyBeats",
        "Sign in to vote on nearby deals!",
        [
          { text: "Maybe Later", style: "cancel" },
          { text: "Sign In", onPress: () => setIsGuest(!isGuest) }
        ]
      );
      return;
    }

    setNearbyDeals(prevDeals => 
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          const newVotes = { ...deal.votes };
          if (voteType === 'up') {
            newVotes.up += 1;
          } else {
            newVotes.down += 1;
          }
          return { ...deal, votes: newVotes };
        }
        return deal;
      })
    );

    Alert.alert("Vote Recorded!", `Thanks for your ${voteType}vote!`);
  };

  const handleAuth = () => {
    Alert.alert(
      "Demo Mode",
      "In demo mode - tap to simulate login/logout",
      [
        { text: "Cancel", style: "cancel" },
        { text: isGuest ? "Login" : "Logout", onPress: () => setIsGuest(!isGuest) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        isGuest={isGuest}
        onAuthPress={handleAuth}
        onPostPress={() => router.push('/post')}
        onAlertsPress={() => router.push('/alerts')}
      />
      
      <View style={styles.headerSection}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.headerGradient}
        >
          <View style={styles.titleContainer}>
            <MapPin size={24} color="#FFFFFF" />
            <Text style={styles.pageTitle}>Nearby Deals</Text>
          </View>
          <Text style={styles.subtitle}>
            Discover amazing deals around you
          </Text>
        </LinearGradient>
      </View>

      {!locationEnabled ? (
        <View style={styles.locationPrompt}>
          <LinearGradient
            colors={['#f8fafc', '#f1f5f9']}
            style={styles.promptContainer}
          >
            <View style={styles.promptIcon}>
              <Navigation size={48} color="#6366f1" />
            </View>
            <Text style={styles.promptTitle}>Enable Location</Text>
            <Text style={styles.promptDescription}>
              Allow location access to discover amazing deals near you
            </Text>
            <TouchableOpacity style={styles.enableButton} onPress={handleLocationToggle}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.enableButtonGradient}
              >
                <Text style={styles.enableButtonText}>Enable Location</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <>
          {/* Radius Selector */}
          <View style={styles.radiusSection}>
            <Text style={styles.radiusLabel}>Search Radius</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.radiusOptions}>
                {radiusOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radiusOptionWrapper}
                    onPress={() => setRadius(option)}
                  >
                    {radius === option ? (
                      <LinearGradient
                        colors={['#6366f1', '#4f46e5']}
                        style={styles.radiusOption}
                      >
                        <Text style={styles.radiusOptionTextActive}>
                          {option} mi
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.radiusOptionInactive}>
                        <Text style={styles.radiusOptionText}>
                          {option} mi
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Location Banner */}
          <View style={styles.locationBanner}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.locationBannerGradient}
            >
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.locationBannerText}>
                Showing deals within {radius} miles of your location
              </Text>
              <TouchableOpacity onPress={handleLocationToggle}>
                <Text style={styles.disableLocationText}>Disable</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Deals List */}
          <ScrollView style={styles.dealsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.statsHeader}>
              <View style={styles.statsItem}>
                <Zap size={16} color="#10b981" />
                <Text style={styles.statsText}>
                  {nearbyDeals.length} deals nearby
                </Text>
              </View>
              <Text style={styles.sortText}>Sorted by distance</Text>
            </View>

            {nearbyDeals.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                isGuest={isGuest}
                onVote={handleVote}
              />
            ))}
            
            {nearbyDeals.length === 0 && locationEnabled && (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={['#f8fafc', '#f1f5f9']}
                  style={styles.emptyStateContainer}
                >
                  <Text style={styles.emptyStateEmoji}>📍</Text>
                  <Text style={styles.emptyStateText}>No deals found nearby</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Try increasing your search radius or check back later for new deals
                  </Text>
                  <TouchableOpacity 
                    style={styles.expandRadiusButton}
                    onPress={() => setRadius(Math.min(radius * 2, 25))}
                  >
                    <Text style={styles.expandRadiusText}>Expand Search Radius</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    marginBottom: 8,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  locationPrompt: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  promptContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginHorizontal: 16,
  },
  promptIcon: {
    backgroundColor: '#eef2ff',
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  promptDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  enableButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  enableButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  radiusSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  radiusLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  radiusOptions: {
    flexDirection: 'row',
  },
  radiusOptionWrapper: {
    marginRight: 12,
  },
  radiusOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  radiusOptionInactive: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  radiusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  radiusOptionTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  locationBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disableLocationText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'underline',
  },
  dealsContainer: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  emptyState: {
    padding: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  expandRadiusButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  expandRadiusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  },
});