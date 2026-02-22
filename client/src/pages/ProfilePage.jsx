import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, X, AlertCircle } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const minSize = 10 * 1024; // 10KB minimum

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.'
      };
    }

    // Check file size - too large
    if (file.size > maxSize) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `File size too large (${sizeInMB}MB). Maximum size allowed is 2MB.`
      };
    }

    // Check file size - too small (likely corrupted)
    if (file.size < minSize) {
      return {
        isValid: false,
        error: 'File size too small. The image may be corrupted or empty.'
      };
    }

    return { isValid: true, error: null };
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max width 600px)
          let { width, height } = img;
          if (width > 600) {
            const ratio = 600 / width;
            width = 600;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.7 quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            0.7
          );
        };
        
        img.onerror = reject;
      };
      
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error);
      e.target.value = '';
      return;
    }

    try {
      // Compress the image
      const compressedBase64 = await compressImage(file);
      setSelectedImg(compressedBase64);
      setUploadError(null);
      
      await updateProfile({ profilePic: compressedBase64 });
    } catch (error) {
      console.error('Image compression error:', error);
      const errorMessage = 'Failed to process image. Please try again.';
      setUploadError(errorMessage);
      setSelectedImg(null);
      e.target.value = '';
    }
  };

  const clearSelectedImage = () => {
    setSelectedImg(null);
    setUploadError(null);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              {selectedImg && (
              <button
                  onClick={clearSelectedImage}
                  className="absolute top-0 right-0 bg-error hover:bg-error/90 text-error-content p-1 rounded-full transition-colors duration-200"
                  title="Remove selected image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  onClick={(e) => {
                    if (isUpdatingProfile) {
                      e.preventDefault();
                    }
                  }}
                />
              </label>
            </div>
            
            {uploadError && (
              <div className="flex items-center gap-2 text-error-content bg-error/10 border border-error/30 rounded-lg px-3 py-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            
            <div className="text-center space-y-1">
              <p className="text-sm text-base-content/70">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
              <p className="text-xs text-base-content/60">
                Allowed formats: JPG, JPEG, PNG (Max 2MB, will be compressed)
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-base-content/70 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-base-content/70 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;