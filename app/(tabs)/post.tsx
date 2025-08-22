import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Camera, MapPin, DollarSign, Calendar, Shield, CircleCheck as CheckCircle, Sparkles, Upload, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function PostDealScreen() {
  const [isGuest, setIsGuest] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    location: '',
    expiryDate: '',
    rulesAccepted: false
  });

  const categories = [
    { id: 'electronics', name: 'Electronics', emoji: '📱' },
    { id: 'food', name: 'Food & Dining', emoji: '🍕' },
    { id: 'clothing', name: 'Clothing', emoji: '👕' },
    { id: 'home', name: 'Home & Garden', emoji: '🏠' },
    { id: 'automotive', name: 'Automotive', emoji: '🚗' },
    { id: 'services', name: 'Services', emoji: '🔧' },
  ];

  const handleImagePicker = () => {
    Alert.alert(
      "Add Photos",
      "Choose how to add photos",
      [
        { text: "📷 Camera", onPress: () => console.log("Camera pressed") },
        { text: "🖼️ Gallery", onPress: () => console.log("Gallery pressed") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = () => {
    if (isGuest) {
      Alert.alert(
        "Join SpicyBeats",
        "Sign in to share amazing deals with the community!",
        [
          { text: "Maybe Later" }, 
          { text: "Sign In", onPress: () => setIsGuest(false) }
        ]
      );
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      Alert.alert("Missing Information", "Please enter a deal title.");
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert("Missing Information", "Please enter a deal description.");
      return;
    }

    if (!formData.category) {
      Alert.alert("Missing Information", "Please select a category.");
      return;
    }

    if (!formData.location.trim()) {
      Alert.alert("Missing Information", "Please enter a store location.");
      return;
    }

    if (!formData.rulesAccepted) {
      Alert.alert(
        "Community Rules",
        "Please accept our community guidelines to continue.",
        [{ text: "OK" }]
      );
      return;
    }

    // Simulate posting
    Alert.alert(
      "🎉 Deal Posted!",
      formData.title.includes("verified") || Math.random() > 0.5 
        ? "Your deal is now live! Thanks for sharing with the community." 
        : "Your deal has been submitted for review. You'll be notified once it's approved!",
      [{ 
        text: "View My Deals", 
        onPress: () => router.push('/profile')
      }, {
        text: "Post Another",
        onPress: () => {
          setFormData({
            title: '',
            description: '',
            price: '',
            originalPrice: '',
            category: '',
            location: '',
            expiryDate: '',
            rulesAccepted: false
          });
        }
      }]
    );
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleRulesPress = () => {
    Alert.alert(
      "Community Guidelines",
      "• No offensive or illegal content\n• Deals must be legitimate and available\n• Include accurate pricing and location\n• No spam or duplicate posts\n• Be respectful to other users",
      [{ text: "Awesome!" }]
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
              <Sparkles size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.guestTitle}>Share Amazing Deals</Text>
            <Text style={styles.guestDescription}>
              Help your community save money by sharing the best deals you find!
            </Text>
            
            <View style={styles.featuresContainer}>
              {[
                { emoji: '⚡', title: 'Instant Publishing', desc: 'Verified users go live immediately' },
                { emoji: '🏆', title: 'Build Reputation', desc: 'Earn points for quality deals' },
                { emoji: '💎', title: 'Premium Features', desc: 'Access exclusive posting tools' }
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDesc}>{feature.desc}</Text>
                  </View>
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
                <Zap size={20} color="#FFFFFF" />
                <Text style={styles.joinButtonText}>Start Sharing Deals</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Share a Deal</Text>
        <Text style={styles.headerSubtitle}>
          Help your community save money
        </Text>
      </LinearGradient>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Deal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deal Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50% Off Premium Headphones"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us what makes this deal special..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Sale Price</Text>
              <View style={styles.inputWithIcon}>
                <View style={styles.inputIcon}>
                  <DollarSign size={18} color="#10b981" />
                </View>
                <TextInput
                  style={styles.inputWithPadding}
                  placeholder="29.99"
                  value={formData.price}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Original Price</Text>
              <View style={styles.inputWithIcon}>
                <View style={styles.inputIcon}>
                  <DollarSign size={18} color="#ef4444" />
                </View>
                <TextInput
                  style={styles.inputWithPadding}
                  placeholder="59.99"
                  value={formData.originalPrice}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, originalPrice: text }))}
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Category & Location</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryWrapper}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    {formData.category === category.id ? (
                      <LinearGradient
                        colors={['#6366f1', '#4f46e5']}
                        style={styles.categoryButton}
                      >
                        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                        <Text style={styles.categoryButtonTextActive}>{category.name}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.categoryButtonInactive}>
                        <Text style={styles.categoryEmojiInactive}>{category.emoji}</Text>
                        <Text style={styles.categoryButtonText}>{category.name}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Store Location *</Text>
            <View style={styles.inputWithIcon}>
              <View style={styles.inputIcon}>
                <MapPin size={18} color="#6366f1" />
              </View>
              <TextInput
                style={styles.inputWithPadding}
                placeholder="Store name or address"
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Photos & Details</Text>
          
          <TouchableOpacity style={styles.imageUploader} onPress={handleImagePicker}>
            <LinearGradient
              colors={['#f8fafc', '#f1f5f9']}
              style={styles.imageUploaderGradient}
            >
              <View style={styles.uploadIconContainer}>
                <Upload size={32} color="#6366f1" />
              </View>
              <Text style={styles.imageUploaderText}>Add Photos</Text>
              <Text style={styles.imageUploaderSubtext}>
                Show off the deal with great photos
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expiry Date (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <View style={styles.inputIcon}>
                <Calendar size={18} color="#f59e0b" />
              </View>
              <TextInput
                style={styles.inputWithPadding}
                placeholder="MM/DD/YYYY"
                value={formData.expiryDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, expiryDate: text }))}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.rulesContainer}
            onPress={() => setFormData(prev => ({ ...prev, rulesAccepted: !prev.rulesAccepted }))}
          >
            <View style={[
              styles.checkbox,
              formData.rulesAccepted && styles.checkboxActive
            ]}>
              {formData.rulesAccepted && (
                <CheckCircle size={20} color="#FFFFFF" />
              )}
            </View>
            <View style={styles.rulesTextContainer}>
              <Text style={styles.rulesText}>
                I agree to the <Text style={styles.rulesLink} onPress={handleRulesPress}>community guidelines</Text> and confirm this deal is legitimate
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButtonWrapper} onPress={handleSubmit}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.submitButton}
          >
            <Sparkles size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Share This Deal</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.verificationInfo}>
          <Shield size={16} color="#10b981" />
          <Text style={styles.verificationText}>
            ✨ Verified users see their posts go live instantly. New users need quick approval first.
          </Text>
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
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },
  joinButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  form: {
    flex: 1,
    marginTop: -20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    fontWeight: '500',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  inputIcon: {
    backgroundColor: '#eef2ff',
    padding: 12,
    marginRight: 12,
  },
  inputWithPadding: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 16,
    paddingRight: 16,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryWrapper: {
    marginRight: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  categoryButtonInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryEmojiInactive: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.7,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryButtonTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  imageUploader: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageUploaderGradient: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  uploadIconContainer: {
    backgroundColor: '#eef2ff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  imageUploaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 8,
  },
  imageUploaderSubtext: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
  },
  rulesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  rulesText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
  },
  rulesTextContainer: {
    flex: 1,
  },
  rulesLink: {
    color: '#6366f1',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  submitButtonWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  verificationText: {
    flex: 1,
    fontSize: 14,
    color: '#065f46',
    marginLeft: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
});