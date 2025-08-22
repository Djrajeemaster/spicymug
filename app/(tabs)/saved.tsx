import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, Filter, Trash2, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/Header';
import { DealCard } from '@/components/DealCard';
import { router } from 'expo-router';

export default function SavedScreen() {
  const [isGuest, setIsGuest] = useState(true);
  const [savedDeals, setSavedDeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sampleSavedDeals = [
    {
      id: 1,
      title: "Premium Wireless Headphones - Flash Sale",
      description: "Sony WH-1000XM5 with industry-leading noise cancellation. Limited time offer!",
      price: "$149.99",
      originalPrice: "$299.99",
      category: "electronics",
      location: "Best Buy Downtown",
      distance: "0.5 miles",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 124, down: 3 },
      comments: 28,
      isPinned: true,
      status: 'approved',
      postedBy: "TechDeals2024",
      isVerified: true,
      timeAgo: "2 hours ago",
      savedAt: "Yesterday"
    },
    {
      id: 2,
      title: "Designer Denim Warehouse Sale",
      description: "End of season clearance on premium designer jeans from top brands.",
      price: "$39.99",
      originalPrice: "$120.00",
      category: "clothing",
      location: "Fashion District Outlet",
      distance: "2.1 miles",
      image: "https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 67, down: 5 },
      comments: 12,
      isPinned: false,
      status: 'approved',
      postedBy: "StyleHunter",
      isVerified: true,
      timeAgo: "1 day ago",
      savedAt: "3 days ago"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', count: sampleSavedDeals.length },
    { id: 'electronics', name: 'Electronics', count: 1 },
    { id: 'clothing', name: 'Clothing', count: 1 },
    { id: 'food', name: 'Food', count: 0 },
  ];

  const handleAuth = () => {
    if (isGuest) {
      setIsGuest(false);
      setSavedDeals(sampleSavedDeals);
      Alert.alert("Welcome!", "You're now logged in. Here are your saved deals!");
    } else {
      setIsGuest(true);
      setSavedDeals([]);
      Alert.alert("Logged Out", "You've been logged out successfully.");
    }
  };

  const handleVote = (dealId, voteType) => {
    setSavedDeals(prevDeals => 
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

  const handleRemoveFromSaved = (dealId) => {
    Alert.alert(
      "Remove from Saved",
      "Are you sure you want to remove this deal from your saved list?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setSavedDeals(prev => prev.filter(deal => deal.id !== dealId));
            Alert.alert("Removed", "Deal removed from your saved list.");
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    if (savedDeals.length === 0) return;
    
    Alert.alert(
      "Clear All Saved Deals",
      "Are you sure you want to remove all saved deals? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            setSavedDeals([]);
            Alert.alert("Cleared", "All saved deals have been removed.");
          }
        }
      ]
    );
  };

  const filteredDeals = selectedCategory === 'all' 
    ? savedDeals 
    : savedDeals.filter(deal => deal.category === selectedCategory);

  if (isGuest) {
    return (
      <View style={styles.container}>
        <Header 
          isGuest={isGuest}
          onAuthPress={handleAuth}
          onPostPress={() => router.push('/post')}
          onAlertsPress={() => router.push('/alerts')}
        />
        
        <View style={styles.guestContainer}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6', '#d946ef']}
            style={styles.guestGradient}
          >
            <View style={styles.guestContent}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.guestIconContainer}
              >
                <Bookmark size={48} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.guestTitle}>Save Your Favorite Deals</Text>
              <Text style={styles.guestDescription}>
                Sign in to bookmark deals and never miss out on amazing savings!
              </Text>
              
              <View style={styles.featuresContainer}>
                {[
                  { emoji: '💾', text: 'Save deals for later' },
                  { emoji: '🔔', text: 'Get expiry reminders' },
                  { emoji: '📊', text: 'Track your savings' }
                ].map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.joinButtonWrapper}
                onPress={handleAuth}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.joinButton}
                >
                  <Text style={styles.joinButtonText}>Sign In to Save Deals</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

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
          colors={['#8b5cf6', '#7c3aed']}
          style={styles.headerGradient}
        >
          <View style={styles.titleContainer}>
            <Bookmark size={24} color="#FFFFFF" />
            <Text style={styles.pageTitle}>Saved Deals</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.subtitle}>
              {savedDeals.length} saved deals
            </Text>
            {savedDeals.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                <Trash2 size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {savedDeals.length > 0 && (
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryWrapper}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  {selectedCategory === category.id ? (
                    <LinearGradient
                      colors={['#6366f1', '#4f46e5']}
                      style={styles.categoryButton}
                    >
                      <Text style={styles.categoryTextActive}>
                        {category.name} ({category.count})
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.categoryButtonInactive}>
                      <Text style={styles.categoryText}>
                        {category.name} ({category.count})
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.dealsContainer} showsVerticalScrollIndicator={false}>
        {filteredDeals.map(deal => (
          <View key={deal.id} style={styles.savedDealContainer}>
            <DealCard
              deal={deal}
              isGuest={isGuest}
              onVote={handleVote}
            />
            <View style={styles.savedDealActions}>
              <Text style={styles.savedDate}>Saved {deal.savedAt}</Text>
              <View style={styles.dealActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => Alert.alert("Share", "Sharing deal...")}
                >
                  <Share2 size={16} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleRemoveFromSaved(deal.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        {filteredDeals.length === 0 && savedDeals.length > 0 && (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#f8fafc', '#f1f5f9']}
              style={styles.emptyStateContainer}
            >
              <Text style={styles.emptyStateEmoji}>🔍</Text>
              <Text style={styles.emptyStateText}>No deals in this category</Text>
              <Text style={styles.emptyStateSubtext}>
                Try selecting a different category to see your saved deals
              </Text>
            </LinearGradient>
          </View>
        )}

        {savedDeals.length === 0 && (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#f8fafc', '#f1f5f9']}
              style={styles.emptyStateContainer}
            >
              <Text style={styles.emptyStateEmoji}>📌</Text>
              <Text style={styles.emptyStateText}>No saved deals yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start browsing and save deals you're interested in!
              </Text>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.browseButtonText}>Browse Deals</Text>
              </TouchableOpacity>
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
  guestContainer: {
    flex: 1,
  },
  guestGradient: {
    flex: 1,
  },
  guestContent: {
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
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
  },
  categoryFilter: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  categoryWrapper: {
    marginRight: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryButtonInactive: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealsContainer: {
    flex: 1,
  },
  savedDealContainer: {
    marginBottom: 8,
  },
  savedDealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: -8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  savedDate: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  dealActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
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
  browseButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  },
});