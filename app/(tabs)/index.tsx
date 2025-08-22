import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import { 
  Search, 
  MapPin, 
  Filter, 
  Zap,
  TrendingUp,
  Navigation
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { DealCard } from '@/components/DealCard';
import { UserRole } from '@/types/user';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');
  const [userReputation, setUserReputation] = useState(4.2);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'services', name: 'Services' },
  ];

  const sampleDeals = [
    {
      id: 1,
      title: "Premium Wireless Headphones - Limited Flash Sale",
      description: "Sony WH-1000XM5 with industry-leading noise cancellation. Today only!",
      price: "$149.99",
      originalPrice: "$299.99",
      category: "electronics",
      location: "Best Buy Downtown",
      distance: "0.5 miles",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 124, down: 3 },
      comments: 28,
      isPinned: true,
      status: 'approved',
      postedBy: "TechDeals2024",
      isVerified: true,
      timeAgo: "2 hours ago",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      posterRole: 'verified' as UserRole,
      posterReputation: 4.8
    },
    {
      id: 2,
      title: "Artisan Pizza - Buy One Get One Free",
      description: "Hand-tossed wood-fired pizzas made with organic ingredients. All day Monday special.",
      price: "Starting $12.99",
      category: "food",
      location: "Mario's Authentic Pizzeria",
      distance: "1.2 miles",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 89, down: 2 },
      comments: 15,
      isPinned: false,
      status: 'approved',
      postedBy: "FoodieExplorer",
      isVerified: false,
      timeAgo: "5 hours ago",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      posterRole: 'user' as UserRole,
      posterReputation: 3.2
    },
    {
      id: 3,
      title: "Designer Denim Warehouse Sale",
      description: "End of season clearance on premium designer jeans from top brands. Multiple sizes available.",
      price: "$39.99",
      originalPrice: "$120.00",
      category: "clothing",
      location: "Fashion District Outlet",
      distance: "2.1 miles",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      image: "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 67, down: 5 },
      comments: 12,
      isPinned: false,
      status: 'approved',
      postedBy: "StyleHunter",
      isVerified: true,
      timeAgo: "1 day ago",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      posterRole: 'business' as UserRole,
      posterReputation: 4.5
    },
    {
      id: 4,
      title: "Smart Home Security System Bundle",
      description: "Complete home security package with cameras, sensors, and smart hub. Professional installation included.",
      price: "$299.99",
      originalPrice: "$599.99",
      category: "home",
      location: "Home Depot Central",
      distance: "3.5 miles",
      coordinates: { lat: 40.7282, lng: -74.0776 },
      image: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 45, down: 1 },
      comments: 8,
      isPinned: false,
      status: 'approved',
      postedBy: "HomeTechGuru",
      isVerified: true,
      timeAgo: "3 hours ago",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      posterRole: 'moderator' as UserRole,
      posterReputation: 4.9
    },
    {
      id: 5,
      title: "Professional Car Detailing Service",
      description: "Full interior and exterior detailing service. Includes wax, vacuum, and tire shine.",
      price: "$79.99",
      originalPrice: "$150.00",
      category: "automotive",
      location: "AutoSpa Premium",
      distance: "1.8 miles",
      coordinates: { lat: 40.7614, lng: -73.9776 },
      image: "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 32, down: 0 },
      comments: 5,
      isPinned: false,
      status: 'approved',
      postedBy: "CarCareExpert",
      isVerified: false,
      timeAgo: "6 hours ago",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      posterRole: 'user' as UserRole,
      posterReputation: 2.8
    }
  ];

  useEffect(() => {
    setDeals(sampleDeals);
    setFilteredDeals(sampleDeals);
  }, []);

  useEffect(() => {
    filterDeals();
  }, [deals, searchQuery, selectedCategory, sortBy, locationEnabled]);

  const filterDeals = () => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(deal => deal.category === selectedCategory);
    }

    // Sort deals
    filtered.sort((a, b) => {
      // Always show pinned deals first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'popularity':
          return (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down);
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return 0;
      }
    });

    setFilteredDeals(filtered);
  };

  const handleVote = (dealId, voteType) => {
    if (isGuest) {
      Alert.alert(
        "Join SpicyBeats",
        "Sign in to vote on deals and connect with the community!",
        [
          { text: "Maybe Later", style: "cancel" },
          { text: "Sign In", onPress: () => handleAuth() }
        ]
      );
      return;
    }

    setDeals(prevDeals => 
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

    // Show feedback
    Alert.alert(
      "Vote Recorded!",
      `Thanks for your ${voteType}vote! Your feedback helps the community find the best deals.`,
      [{ text: "Great!" }]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Add a new deal to simulate fresh content
      const newDeal = {
        id: Date.now(),
        title: "Flash Sale: Gaming Mouse 60% Off",
        description: "High-precision gaming mouse with RGB lighting. Limited time offer!",
        price: "$29.99",
        originalPrice: "$74.99",
        category: "electronics",
        location: "GameStop Plaza",
        distance: "0.8 miles",
        coordinates: { lat: 40.7580, lng: -73.9855 },
        image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=400",
        votes: { up: 0, down: 0 },
        comments: 0,
        isPinned: false,
        status: 'approved',
        postedBy: "GamerDeals",
        isVerified: true,
        timeAgo: "Just now",
        createdAt: new Date()
      };
      
      setDeals(prev => [newDeal, ...prev]);
      setIsRefreshing(false);
      
      Alert.alert(
        "🎉 New Deals Found!",
        "We found 1 new deal in your area!",
        [{ text: "Awesome!" }]
      );
    }, 1500);
  };

  const handleAuth = () => {
    if (isGuest) {
      // Simulate login with different roles for demo
      const roles: UserRole[] = ['user', 'verified', 'business', 'moderator', 'admin'];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      setCurrentUserRole(randomRole);
      setIsGuest(false);
      Alert.alert("Logged In", `Welcome! You are now logged in as: ${randomRole}`);
    } else {
      setCurrentUserRole('guest');
      setIsGuest(true);
      Alert.alert("Logged Out", "You have been logged out");
    }
  };

  const handleAuthOld = () => {
    Alert.alert(
      "Demo Mode",
      "In demo mode - tap to simulate login/logout",
      [
        { text: "Cancel", style: "cancel" },
        { text: isGuest ? "Login" : "Logout", onPress: () => setIsGuest(!isGuest) }
      ]
    );
  };

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
              setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC coordinates
              Alert.alert("Location Enabled", "Now showing deals near you!");
            }
          }
        ]
      );
    } else {
      setLocationEnabled(false);
      setUserLocation(null);
      Alert.alert("Location Disabled", "Location services turned off.");
    }
  };

  const navigateToTrending = () => {
    router.push('/updeals');
  };

  const navigateToPost = () => {
    router.push('/post');
  };

  return (
    <View style={styles.container}>
      <Header 
        isGuest={isGuest}
        onAuthPress={handleAuth}
        onPostPress={navigateToPost}
        onAlertsPress={() => router.push('/alerts')}
        userRole={currentUserRole}
        reputation={userReputation}
      />
      
      <View style={styles.searchSection}>
        <LinearGradient
          colors={['#f8fafc', '#ffffff']}
          style={styles.searchGradient}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#6366f1" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search amazing deals..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearButton}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <LinearGradient
                colors={showFilters ? ['#6366f1', '#4f46e5'] : ['#f1f5f9', '#e2e8f0']}
                style={styles.filterGradient}
              >
                <Filter size={20} color={showFilters ? '#FFFFFF' : '#64748b'} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleLocationToggle}
            >
              <LinearGradient
                colors={locationEnabled ? ['#10b981', '#059669'] : ['#f1f5f9', '#e2e8f0']}
                style={styles.locationGradient}
              >
                <Navigation size={20} color={locationEnabled ? '#FFFFFF' : '#64748b'} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.sortOptions}>
                  {[
                    { id: 'newest', name: 'Newest', icon: '🕐' },
                    { id: 'popularity', name: 'Popular', icon: '🔥' },
                    { id: 'distance', name: 'Distance', icon: '📍' }
                  ].map(sort => (
                    <TouchableOpacity
                      key={sort.id}
                      style={styles.sortOptionWrapper}
                      onPress={() => setSortBy(sort.id)}
                    >
                      {sortBy === sort.id ? (
                        <LinearGradient
                          colors={['#6366f1', '#4f46e5']}
                          style={styles.sortOption}
                        >
                          <Text style={styles.sortEmoji}>{sort.icon}</Text>
                          <Text style={styles.sortOptionTextActive}>
                            {sort.name}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.sortOptionInactive}>
                          <Text style={styles.sortEmojiInactive}>{sort.icon}</Text>
                          <Text style={styles.sortOptionText}>
                            {sort.name}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </LinearGradient>
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView
        style={styles.dealsContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            tintColor="#6366f1"
            colors={['#6366f1']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsHeader}>
          <View style={styles.statsItem}>
            <TrendingUp size={16} color="#10b981" />
            <Text style={styles.statsText}>
              {filteredDeals.length} active deals
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Zap size={16} color="#f59e0b" />
            <Text style={styles.statsText}>
              {filteredDeals.filter(d => d.isPinned).length} hot deals
            </Text>
          </View>
          <TouchableOpacity style={styles.statsItem} onPress={navigateToTrending}>
            <Text style={styles.trendingLink}>View Trending →</Text>
          </TouchableOpacity>
        </View>

        {locationEnabled && (
          <View style={styles.locationBanner}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.locationBannerGradient}
            >
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.locationBannerText}>
                Showing deals near New York, NY
              </Text>
            </LinearGradient>
          </View>
        )}

        {filteredDeals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            isGuest={isGuest}
            onVote={handleVote}
            userRole={currentUserRole}
          />
        ))}
        
        {filteredDeals.length === 0 && (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#f8fafc', '#f1f5f9']}
              style={styles.emptyStateContainer}
            >
              <Text style={styles.emptyStateEmoji}>🔍</Text>
              <Text style={styles.emptyStateText}>No deals found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters to discover amazing deals'}
              </Text>
              {searchQuery && (
                <TouchableOpacity 
                  style={styles.clearSearchButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
        )}

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
  searchSection: {
    backgroundColor: '#FFFFFF',
  },
  searchGradient: {
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  clearButton: {
    fontSize: 18,
    color: '#94a3b8',
    paddingHorizontal: 8,
  },
  filterButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
  },
  filterGradient: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  locationGradient: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sortLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOptionWrapper: {
    marginRight: 12,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sortOptionInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  sortEmojiInactive: {
    fontSize: 14,
    marginRight: 6,
    opacity: 0.7,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  sortOptionTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
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
  trendingLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
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
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  locationBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
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
  clearSearchButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  clearSearchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  },
});