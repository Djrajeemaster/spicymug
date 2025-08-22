import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, TrendingUp } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { DealCard } from '@/components/DealCard';
import { router } from 'expo-router';

export default function UpDealsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGuest, setIsGuest] = useState(true);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'services', name: 'Services' },
  ];

  const handleVote = (dealId, voteType) => {
    if (isGuest) {
      Alert.alert(
        "Join SpicyBeats",
        "Sign in to vote on trending deals!",
        [
          { text: "Maybe Later", style: "cancel" },
          { text: "Sign In", onPress: () => setIsGuest(!isGuest) }
        ]
      );
      return;
    }

    // Update vote count
    setTrendingDeals(prevDeals => 
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

    Alert.alert(
      "Vote Recorded!",
      `Thanks for your ${voteType}vote on this trending deal!`,
      [{ text: "Great!" }]
    );
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

  const [trendingDeals, setTrendingDeals] = useState([
    {
      id: 4,
      title: "Flash Sale: Gaming Laptop 40% Off",
      description: "High-performance gaming laptop with RTX graphics. Limited quantity!",
      price: "$899.99",
      originalPrice: "$1,499.99",
      category: "electronics",
      location: "TechWorld Megastore",
      distance: "3.2 miles",
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 87, down: 3 },
      comments: 24,
      isPinned: true,
      status: 'approved',
      postedBy: "GamerDeals",
      isVerified: true,
      timeAgo: "1 hour ago"
    },
    {
      id: 5,
      title: "All-You-Can-Eat Sushi Weekend",
      description: "Premium sushi buffet with fresh ingredients. Weekends only.",
      price: "$29.99",
      category: "food",
      location: "Sakura Sushi House",
      distance: "0.8 miles",
      image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
      votes: { up: 56, down: 2 },
      comments: 18,
      isPinned: false,
      status: 'approved',
      postedBy: "SushiLover99",
      isVerified: false,
      timeAgo: "3 hours ago"
    }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        isGuest={isGuest}
        onAuthPress={handleAuth}
        onPostPress={() => router.push('/post')}
        onAlertsPress={() => router.push('/alerts')}
      />
      
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <TrendingUp size={24} color="#030849" />
          <Text style={styles.pageTitle}>Trending UpDeals</Text>
        </View>
        <Text style={styles.subtitle}>
          Most popular deals right now
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trending deals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#64748B"
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#030849" />
        </TouchableOpacity>
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView style={styles.dealsContainer} showsVerticalScrollIndicator={false}>
        {trendingDeals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            isGuest={isGuest}
            onVote={handleVote}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#030849',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealsContainer: {
    flex: 1,
  },
});