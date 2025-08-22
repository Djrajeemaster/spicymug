import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Share2, 
  Bookmark,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Shield,
  Navigation,
  Phone,
  Globe,
  Star
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DealDetailsScreen() {
  const params = useLocalSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [votes, setVotes] = useState({
    up: parseInt(params.upvotes as string) || 0,
    down: parseInt(params.downvotes as string) || 0
  });

  const deal = {
    id: parseInt(params.id as string),
    title: params.title as string,
    description: params.description as string,
    price: params.price as string,
    originalPrice: params.originalPrice as string,
    location: params.location as string,
    distance: params.distance as string,
    image: params.image as string,
    comments: parseInt(params.comments as string) || 0,
    postedBy: params.postedBy as string,
    timeAgo: params.timeAgo as string,
    isVerified: params.isVerified === 'true'
  };

  const discountPercentage = deal.originalPrice && deal.price ? 
    Math.round((1 - parseFloat(deal.price.replace('$', '')) / parseFloat(deal.originalPrice.replace('$', ''))) * 100) : 0;

  const handleVote = (voteType) => {
    if (userVote === voteType) {
      // Remove vote
      setVotes(prev => ({
        ...prev,
        [voteType]: prev[voteType] - 1
      }));
      setUserVote(null);
    } else {
      // Add new vote, remove old if exists
      setVotes(prev => {
        const newVotes = { ...prev };
        if (userVote) {
          newVotes[userVote] = newVotes[userVote] - 1;
        }
        newVotes[voteType] = newVotes[voteType] + 1;
        return newVotes;
      });
      setUserVote(voteType);
    }
    
    Alert.alert("Vote Recorded!", `Thanks for your ${voteType}vote!`);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? "Removed from Saved" : "Saved!",
      isBookmarked ? "Deal removed from your saved list" : "Deal saved to your favorites"
    );
  };

  const handleShare = () => {
    Alert.alert(
      "Share Deal",
      "How would you like to share this deal?",
      [
        { text: "Copy Link", onPress: () => Alert.alert("Link Copied!", "Deal link copied to clipboard") },
        { text: "Share via...", onPress: () => Alert.alert("Share", "Opening share menu...") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleGetDirections = () => {
    Alert.alert(
      "Get Directions",
      `Open directions to ${deal.location}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Maps", onPress: () => Alert.alert("Directions", "Opening maps app...") }
      ]
    );
  };

  const handleCallStore = () => {
    Alert.alert(
      "Call Store",
      `Call ${deal.location}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Alert.alert("Calling", "Opening phone app...") }
      ]
    );
  };

  const handleViewComments = () => {
    Alert.alert(
      "Comments",
      `View all ${deal.comments} comments for this deal?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "View Comments", onPress: () => Alert.alert("Comments", "Opening comments...") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#030849', '#1e40af']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Deal Details</Text>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction} onPress={handleShare}>
                <Share2 size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction} onPress={handleBookmark}>
                <Bookmark 
                  size={22} 
                  color={isBookmarked ? "#fbbf24" : "#FFFFFF"} 
                  fill={isBookmarked ? "#fbbf24" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Deal Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: deal.image }} style={styles.image} />
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}
        </View>

        {/* Deal Info */}
        <View style={styles.dealInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{deal.title}</Text>
            {deal.isVerified && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color="#10b981" />
              </View>
            )}
          </View>

          <Text style={styles.description}>{deal.description}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{deal.price}</Text>
            {deal.originalPrice && (
              <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
            )}
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#6366f1" />
              <Text style={styles.metaText}>{deal.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Navigation size={16} color="#10b981" />
              <Text style={styles.metaText}>{deal.distance}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#94a3b8" />
              <Text style={styles.metaText}>{deal.timeAgo}</Text>
            </View>
          </View>

          <View style={styles.postedBy}>
            <Text style={styles.postedByText}>
              Posted by <Text style={styles.postedByUser}>{deal.postedBy}</Text>
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.rating}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGetDirections}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.primaryButtonGradient}
            >
              <Navigation size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Get Directions</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleCallStore}>
            <Phone size={20} color="#6366f1" />
            <Text style={styles.secondaryButtonText}>Call Store</Text>
          </TouchableOpacity>
        </View>

        {/* Voting Section */}
        <View style={styles.votingSection}>
          <Text style={styles.sectionTitle}>How's this deal?</Text>
          <View style={styles.votingButtons}>
            <TouchableOpacity
              style={[styles.voteButton, userVote === 'up' && styles.voteButtonActive]}
              onPress={() => handleVote('up')}
            >
              <LinearGradient
                colors={userVote === 'up' ? ['#10b981', '#059669'] : ['#f8fafc', '#f1f5f9']}
                style={styles.voteButtonGradient}
              >
                <ChevronUp size={24} color={userVote === 'up' ? '#FFFFFF' : '#64748b'} />
                <Text style={[styles.voteCount, userVote === 'up' && styles.voteCountActive]}>
                  {votes.up}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, userVote === 'down' && styles.voteButtonActive]}
              onPress={() => handleVote('down')}
            >
              <LinearGradient
                colors={userVote === 'down' ? ['#ef4444', '#dc2626'] : ['#f8fafc', '#f1f5f9']}
                style={styles.voteButtonGradient}
              >
                <ChevronDown size={24} color={userVote === 'down' ? '#FFFFFF' : '#64748b'} />
                <Text style={[styles.voteCount, userVote === 'down' && styles.voteCountActive]}>
                  {votes.down}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <TouchableOpacity style={styles.commentsHeader} onPress={handleViewComments}>
            <View style={styles.commentsTitle}>
              <MessageCircle size={20} color="#6366f1" />
              <Text style={styles.sectionTitle}>Comments ({deal.comments})</Text>
            </View>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>

          <View style={styles.commentPreview}>
            <Text style={styles.commentText}>
              "Great deal! Just got mine and the quality is amazing. Thanks for sharing!"
            </Text>
            <Text style={styles.commentAuthor}>- dealHunter2024</Text>
          </View>
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
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dealInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 32,
  },
  verifiedBadge: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 6,
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#059669',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 20,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  metaInfo: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 15,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '500',
  },
  postedBy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedByText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  postedByUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  primaryButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginLeft: 8,
  },
  votingSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  votingButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  voteButton: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  voteButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  voteButtonGradient: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 80,
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 4,
  },
  voteCountActive: {
    color: '#FFFFFF',
  },
  commentsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  commentPreview: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  commentText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  bottomPadding: {
    height: 100,
  },
});