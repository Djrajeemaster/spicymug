import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert 
} from 'react-native';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  MapPin, 
  Star,
  Clock,
  Shield,
  Flame,
  Eye
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserBadge } from '@/components/UserBadge';
import { UserRole, getRolePrivileges } from '@/types/user';

import { router } from 'expo-router';

interface Deal {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  category: string;
  location: string;
  distance: string;
  image: string;
  votes: { up: number; down: number };
  comments: number;
  isPinned: boolean;
  status: string;
  postedBy: string;
  isVerified: boolean;
  timeAgo: string;
  posterRole?: UserRole;
  posterReputation?: number;
}

interface DealCardProps {
  deal: Deal;
  isGuest: boolean;
  onVote: (dealId: number, voteType: 'up' | 'down') => void;
  userRole?: UserRole;
}

export function DealCard({ deal, isGuest, onVote, userRole = 'guest' }: DealCardProps) {
  const privileges = getRolePrivileges(userRole);
  
  const handleActionPress = (action: string) => {
    if (isGuest) {
      Alert.alert(
        "Join SpicyBeats",
        `Sign in to ${action} and connect with the community!`,
        [{ text: "Maybe Later" }, { text: "Sign In", style: "default" }]
      );
      return;
    }
  };

  const handleVote = (voteType: 'up' | 'down') => {
    if (!privileges.canVote) {
      handleActionPress('vote on deals');
      return;
    }
    onVote(deal.id, voteType);
  };

  const handleComment = () => {
    if (!privileges.canComment) {
      handleActionPress('comment on deals');
      return;
    }
    Alert.alert(
      "Comments",
      `View ${deal.comments} comments for "${deal.title}"`,
      [{ text: "OK" }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      "Share Deal",
      `Share "${deal.title}" with friends?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Copy Link", onPress: () => Alert.alert("Link Copied!", "Deal link copied to clipboard") },
        { text: "Share", onPress: () => Alert.alert("Shared!", "Deal shared successfully") }
      ]
    );
  };

  const handleDealPress = () => {
    router.push({
      pathname: '/deal-details',
      params: {
        id: deal.id.toString(),
        title: deal.title,
        description: deal.description,
        price: deal.price,
        originalPrice: deal.originalPrice || '',
        location: deal.location,
        distance: deal.distance,
        image: deal.image,
        upvotes: deal.votes.up.toString(),
        downvotes: deal.votes.down.toString(),
        comments: deal.comments.toString(),
        postedBy: deal.postedBy,
        timeAgo: deal.timeAgo,
        isVerified: deal.isVerified.toString()
      }
    });
  };

  const discountPercentage = deal.originalPrice ? 
    Math.round((1 - parseFloat(deal.price.replace('$', '')) / parseFloat(deal.originalPrice.replace('$', ''))) * 100) : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={handleDealPress} activeOpacity={0.95}>
      {deal.isPinned && (
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pinnedBanner}
        >
          <Flame size={16} color="#FFFFFF" />
          <Text style={styles.pinnedText}>Hot Deal</Text>
        </LinearGradient>
      )}
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: deal.image }} style={styles.image} />
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}
        </View>
        
        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>{deal.title}</Text>
            {deal.isVerified && (
              <View style={styles.verifiedBadge}>
                <Shield size={14} color="#10B981" />
              </View>
            )}
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {deal.description}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{deal.price}</Text>
            {deal.originalPrice && (
              <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
            )}
          </View>
          
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <MapPin size={12} color="#6366f1" />
            </View>
            <Text style={styles.locationText}>{deal.location} • {deal.distance}</Text>
          </View>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaLeft}>
              <Clock size={12} color="#94A3B8" />
              <Text style={styles.timeText}>{deal.timeAgo}</Text>
              <View style={styles.postedByContainer}>
                <Text style={styles.postedBy}>by {deal.postedBy}</Text>
                {deal.posterRole && (
                  <UserBadge 
                    role={deal.posterRole} 
                    size="small" 
                    showText={false}
                    reputation={deal.posterReputation}
                  />
                )}
              </View>
            </View>
            <View style={styles.viewsContainer}>
              <Eye size={12} color="#94A3B8" />
              <Text style={styles.viewsText}>1.2k</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <View style={styles.votingContainer}>
          <TouchableOpacity
            style={[styles.voteButton, styles.upvoteButton]}
            onPress={() => handleVote('up')}
            disabled={!privileges.canVote}
          >
            <LinearGradient
              colors={!privileges.canVote ? ['#f1f5f9', '#e2e8f0'] : ['#10b981', '#059669']}
              style={styles.voteGradient}
            >
              <ChevronUp size={18} color={!privileges.canVote ? '#cbd5e1' : '#FFFFFF'} />
            </LinearGradient>
            <Text style={[styles.voteCount, !privileges.canVote && styles.voteCountDisabled]}>
              {deal.votes.up}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.voteButton, styles.downvoteButton]}
            onPress={() => handleVote('down')}
            disabled={!privileges.canVote}
          >
            <View style={[styles.voteGradient, styles.downvoteGradient, !privileges.canVote && styles.disabledGradient]}>
              <ChevronDown size={18} color={!privileges.canVote ? '#cbd5e1' : '#ef4444'} />
            </View>
            <Text style={[styles.voteCount, !privileges.canVote && styles.voteCountDisabled]}>
              {deal.votes.down}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleComment}
          disabled={!privileges.canComment}
        >
          <MessageCircle size={18} color={!privileges.canComment ? '#cbd5e1' : '#6366f1'} />
          <Text style={[styles.commentCount, !privileges.canComment && styles.commentCountDisabled]}>
            {deal.comments}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  pinnedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  discountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    padding: 4,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 6,
    marginRight: 8,
  },
  postedBy: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
    marginRight: 6,
  },
  postedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  votingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  upvoteButton: {
    // Specific styling for upvote
  },
  downvoteButton: {
    // Specific styling for downvote
  },
  voteGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  downvoteGradient: {
    backgroundColor: '#fef2f2',
  },
  disabledGradient: {
    backgroundColor: '#f1f5f9',
  },
  voteCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  voteCountDisabled: {
    color: '#cbd5e1',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  commentCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 6,
  },
  commentCountDisabled: {
    color: '#cbd5e1',
  },
  shareButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});