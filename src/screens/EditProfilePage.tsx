import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {auth, storage} from "../utils/firebase";
import {updateProfile, updateEmail} from "firebase/auth";
import {useTheme} from "../hooks/useTheme";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/Navigation";

import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import {v4 as uuidv4} from "uuid";

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;
type SettingsScreenRouteProp = RouteProp<RootStackParamList, "Settings">;

const EditProfilePage = () => {
  const user = auth.currentUser;
  const {colors} = useTheme();
  const [initialName, setInitialName] = useState(user?.displayName || "");
  const [initialEmail, setInitialEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");

  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const route = useRoute<SettingsScreenRouteProp>();

  const handleDiscard = () => {
    setName(initialName);
    setEmail(initialEmail);
    Alert.alert("Discarded", "Changes have been reverted.");
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      if (name !== user.displayName) {
        await updateProfile(user, {displayName: name});
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      Alert.alert("Success", "Profile updated successfully.");

      navigation.navigate("Settings", {refresh: true});
    } catch (error: any) {
      console.error(error);
      let message = "Failed to update profile.";
      if (error.code === "auth/requires-recent-login") {
        message = "Please log in again before changing email.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }
      Alert.alert("Error", message);
    }
  };
  const photo =
    user?.photoURL != null ? (
      <View style={styles.container}>
        <Image
          source={{
            uri: user?.photoURL || "",
          }}
        />
      </View>
    ) : (
      <Text style={styles.avatarText}>
        {user?.displayName?.charAt(0).toUpperCase() || "U"}
      </Text>
    );
    const [imageUri, setImageUri] = useState("");
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    };

    const uriToBlob = async (uri: string): Promise<Blob> => {
      const response = await fetch(uri);
      return await response.blob();
    };

    const uploadImage = async (uri: string) => {

      if (!uri || !auth.currentUser) return;

      try {
        setUploading(true);
        const blob = await uriToBlob(uri);
        const fileRef = ref(
          storage,
          `profilePhotos/${auth.currentUser.uid}.jpg`
        );
        console.log(fileRef);
        await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(fileRef);

        // Update Firebase Auth user photoURL
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        });

        Alert.alert("Success", "Profile photo uploaded!");
      } catch (err) {
        console.error("Upload error:", err);
        Alert.alert("Error", "Failed to upload image.");
      } finally {
        setUploading(false);
      }
    };
  return (
    
    <View style={[styles.container, {backgroundColor: colors.background}]}>
       <View style={styles.avatarContainer}>
  <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
    {photo}

    {/* Overlay Icon */}
    <TouchableOpacity style={styles.cameraOverlay} onPress={pickImage}>
      <Ionicons name="camera" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
</View>

      <Text style={[styles.title, {color: colors.text}]}>Edit Profile</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        placeholderTextColor={colors.textSecondary}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.accent}]}
        onPress={handleSave}>
        <Text style={[styles.buttonText, {color: colors.primary}]}>
          Save Changes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.discardButton]}
        onPress={handleDiscard}>
        <Text style={[styles.buttonText, {color: colors.danger}]}>
          Discard Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  discardButton: {
    marginTop: 10,
  },

  header: {
    marginVertical: 30,
  },

  subtitle: {
    fontSize: 16,
  },

  avatarContainer: {
    marginBottom: 16,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    textAlign: "center",
  },

  section: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(153,221,200,0.15)",
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  themeToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  versionText: {
    textAlign: "center",
    fontSize: 14,
    // marginTop: 10,
    marginBottom: 30,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
});

export default EditProfilePage;
