import {
  StyleSheet, View, StatusBar, TouchableOpacity, SafeAreaView,
  ScrollView, Image, Text, ActivityIndicator, Alert,
  PermissionsAndroid, Platform,
} from 'react-native';
import React, { useState } from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';
import GalleryIcon from '../assets/images/GalleryIcon.svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useUserContext } from '../context/UserContext';
import { analyzePropertyImage, formatAnalysisForDescription } from '../utils/imageAnalysis';
import Toast from 'react-native-simple-toast';

const ClerkAddImageAnalysis = ({ navigation, route }) => {
  const { setRecordingPath } = useUserContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const contextName = route?.params?.contextName || '';
  const goBackScreen = route?.params?.goBackScreen || 'ClerkInspection';

  /**
   * Request camera permission on Android.
   * Returns true if granted, false otherwise.
   */
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera access to take property photos.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  /**
   * Request gallery/media permission on Android.
   * Uses READ_MEDIA_IMAGES on Android 13+ (API 33+),
   * falls back to READ_EXTERNAL_STORAGE on older versions.
   * Returns true if granted, false otherwise.
   */
  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      // Android 13+ (API 33) uses granular media permissions
      const apiLevel = Platform.Version;
      const permission =
        apiLevel >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Gallery Permission',
        message: 'This app needs access to your photos for property image analysis.',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Gallery permission error:', err);
      return false;
    }
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: false,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Camera Error', response.errorMessage);
          return;
        }
        const asset = response.assets[0];
        setSelectedImage({
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        });
        setAnalysisResult(null);
      },
    );
  };

  const handleGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery permission is required to select photos.');
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Gallery Error', response.errorMessage);
          return;
        }
        const asset = response.assets[0];
        setSelectedImage({
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        });
        setAnalysisResult(null);
      },
    );
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) { Toast.show('Please select an image first.'); return; }
    setIsAnalyzing(true);
    try {
      const result = await analyzePropertyImage(selectedImage.uri, contextName);
      if (result.success) {
        setAnalysisResult(result.data); Toast.show('Image analysis completed!');
      } else {
        Toast.show(result.error || 'Analysis failed.');
      }
    } catch (error) { Toast.show('Error during analysis.'); }
    setIsAnalyzing(false);
  };

  const saveAnalysis = () => {
    if (analysisResult) {
      const formattedText = formatAnalysisForDescription({ success: true, data: analysisResult });
      setRecordingPath(formattedText);
      Toast.show('Analysis saved as description!');
      navigation.navigate(goBackScreen);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#EF1010'; case 'High': return '#FF6600';
      case 'Medium': return '#D06100'; case 'Low': return '#FFC107';
      default: return '#666';
    }
  };
return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />
      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate(goBackScreen)}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Analyze Image</Text>
        </View>
        <ScrollView style={styles.container}>
          <Text style={styles.subtitel}>Select image for analysis</Text>
          <View style={styles.BtnGap}>
            <TouchableOpacity style={styles.StartBtn} onPress={handleCamera}>
              <CameraIcon width={50} height={50} />
              <Text style={styles.StartBtnTxt}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.StartBtn} onPress={handleGallery}>
              <GalleryIcon width={50} height={50} />
              <Text style={styles.StartBtnTxt}>Gallery</Text>
            </TouchableOpacity>
          </View>
{selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
              <View style={styles.imageContainerRgt}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedImage.fileName || 'Selected Image'}
                </Text>
                <Text style={styles.fileSize}>{formatFileSize(selectedImage.fileSize)}</Text>
              </View>
            </View>
          )}

          {selectedImage && (
            <TouchableOpacity
              style={[styles.NextBtn, isAnalyzing && { opacity: 0.6 }]}
              onPress={handleAnalyzeImage}
              disabled={isAnalyzing}>
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.NextBtnTxt}>Analyze Image with AI</Text>
              )}
            </TouchableOpacity>
          )}

          {analysisResult && (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>Analysis Results</Text>
              <View style={styles.conditionRow}>
                <Text style={styles.conditionLabel}>Condition:</Text>
                <View style={[styles.conditionBadge,
                  { backgroundColor: analysisResult.condition === 'Excellent' ? '#28A745' :
                    analysisResult.condition === 'Good' ? '#17A2B8' :
                    analysisResult.condition === 'Fair' ? '#FFC107' :
                    analysisResult.condition === 'Poor' ? '#FF6600' : '#EF1010' }]}>
                  <Text style={styles.conditionText}>{analysisResult.condition}</Text>
                </View>
              </View>
              {analysisResult.category && (
                <Text style={styles.categoryText}>Category: {analysisResult.category}</Text>
              )}
{analysisResult.disputes?.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Issues / Disputes Detected:</Text>
                  {analysisResult.disputes.map((dispute, idx) => (
                    <View key={idx} style={styles.disputeItem}>
                      <View style={styles.disputeHeader}>
                        <Text style={styles.disputeText}>{idx + 1}. {dispute.issue}</Text>
                        <View style={[styles.severityBadge,
                          { backgroundColor: getSeverityColor(dispute.severity) }]}>
                          <Text style={styles.severityText}>{dispute.severity}</Text>
                        </View>
                      </View>
                      <Text style={styles.disputeLocation}>Location: {dispute.location}</Text>
                    </View>
                  ))}
                </View>
              )}

              {analysisResult.recommendations?.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Recommendations:</Text>
                  {analysisResult.recommendations.map((rec, idx) => (
                    <Text key={idx} style={styles.recommendationText}>{idx + 1}. {rec}</Text>
                  ))}
                </View>
              )}

              {analysisResult.detailed_notes && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Detailed Notes:</Text>
                  <Text style={styles.notesText}>{analysisResult.detailed_notes}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.saveBtn} onPress={saveAnalysis}>
                <Text style={styles.saveBtnTxt}>Save Analysis as Description</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainBody: { flex: 1, backgroundColor: '#F1F2F6', paddingTop: 30 },
  Body: { flex: 1, width: '100%' },
  Header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  BackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', zIndex: 999 },
  backIcon: { marginRight: 20 },
  pagetitleTxt: { color: '#151313', fontSize: 19, fontFamily: 'BeVietnamPro-Medium', fontWeight: '500', textAlign: 'center', position: 'absolute', margin: 'auto', left: 0, right: 0 },
  container: { width: '100%', height: '100%', paddingLeft: 25, paddingRight: 25, paddingTop: 20 },
  subtitel: { color: '#151313', fontSize: 16, fontFamily: 'BeVietnamPro-Regular', fontWeight: '400', marginBottom: 15 },
  BtnGap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 25, marginBottom: 20 },
  StartBtn: { width: '47%', backgroundColor: '#fff', height: 150, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00218F47' },
  StartBtnTxt: { color: '#151313', fontSize: 19, fontFamily: 'BeVietnamPro-Regular', fontWeight: '400', textAlign: 'center', marginTop: 10 },
  imageContainer: { borderRadius: 8, borderWidth: 1, borderColor: '#00218F47', padding: 10, flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 20 },
  imagePreview: { width: 80, height: 80, borderRadius: 8 },
  imageContainerRgt: { flex: 1 },
  fileName: { fontSize: 14, color: '#353535', fontFamily: 'BeVietnamPro-Regular', marginBottom: 5 },
  fileSize: { fontSize: 12, color: '#8E8E8E', fontFamily: 'BeVietnamPro-Regular' },
  NextBtn: { backgroundColor: '#393D47', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, marginBottom: 20 },
  NextBtnTxt: { color: '#FFF', fontSize: 16, fontFamily: 'BeVietnamPro-SemiBold', fontWeight: '600' },
  analysisContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#00218F47' },
  analysisTitle: { fontSize: 20, fontFamily: 'BeVietnamPro-SemiBold', fontWeight: '600', color: '#151313', marginBottom: 15, textAlign: 'center' },
  conditionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  conditionLabel: { fontSize: 16, fontFamily: 'BeVietnamPro-Medium', color: '#434854' },
  conditionBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  conditionText: { color: '#FFF', fontSize: 14, fontFamily: 'BeVietnamPro-SemiBold', fontWeight: '600' },
  categoryText: { fontSize: 14, color: '#6D7D93', fontFamily: 'BeVietnamPro-Regular', marginBottom: 15 },
  sectionBlock: { marginTop: 15, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontFamily: 'BeVietnamPro-SemiBold', fontWeight: '600', color: '#151313', marginBottom: 8 },
  disputeItem: { backgroundColor: '#F8F9FA', padding: 10, borderRadius: 8, marginBottom: 8 },
  disputeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  disputeText: { fontSize: 14, color: '#434854', fontFamily: 'BeVietnamPro-Medium', flex: 1 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  severityText: { color: '#FFF', fontSize: 11, fontFamily: 'BeVietnamPro-SemiBold', fontWeight: '600' },
  disputeLocation: { fontSize: 12, color: '#8E8E8E', fontFamily: 'BeVietnamPro-Regular', marginLeft: 0 },
  recommendationText: { fontSize: 14, color: '#434854', fontFamily: 'BeVietnamPro-Regular', marginBottom: 5, lineHeight: 20 },
  notesText: { fontSize: 14, color: '#434854', fontFamily: 'BeVietnamPro-Regular', lineHeight: 22 },
  saveBtn: { backgroundColor: '#D97706', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, marginTop: 20 },
  saveBtnTxt: { color: '#FFF', fontSize: 16, fontFamily: 'BeVietnamPro-SemiBold', fontWeight: '600' },
});
export default ClerkAddImageAnalysis;
