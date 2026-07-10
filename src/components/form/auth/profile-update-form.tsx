"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useUpdateUser } from "@/services/auth.service";
import { useUploadToS3 } from "@/services/file-upload.service";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  contact: z.string().min(10, {
    message: "Contact number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  pinCode: z.string().min(3, {
    message: "PIN code must be at least 3 characters.",
  }),
  photoURL: z.string().optional(),
});

interface UserFormProps {
  userData: {
    name: string;
    email: string;
    contact?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    photoURL?: string;
  };
}

export default function UpdateUserForm({ userData }: UserFormProps) {
  const router = useRouter();
  const { updateUser, isUpdatingUser, isUpdatingUserError, updateUserError } =
    useUpdateUser();
  const { uploadToS3, isUploading, uploadData } = useUploadToS3();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(userData.photoURL || "");
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name || "",
      email: userData.email || "",
      contact: userData.contact || "",
      address: userData.address || "",
      city: userData.city || "",
      state: userData.state || "",
      country: userData.country || "",
      pinCode: userData.pinCode || "",
      photoURL: userData.photoURL || "",
    },
  });

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please select an image file (JPG, PNG, GIF, etc.)"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Image size should be less than 5MB"
        });
        return;
      }

      setProfileImage(file);
      setIsUploadComplete(false);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      toast.info("Image selected", {
        description: "Click 'Update Profile' to upload and save changes"
      });
    }
  };

  // Handle upload to S3
  const handleImageUpload = async (): Promise<string | null> => {
    if (!profileImage) return null;

    const uploadToast = toast.loading("Uploading profile picture...");

    return new Promise<string | null>((resolve) => {
      uploadToS3({
        file: profileImage,
        folder: 'profile-pictures'
      }, {
        onSuccess: (response) => {
          // The URL is in response.data.url (nested structure)
          if (response?.data?.url) {
            const imageUrl = response.data.url;

            // Update form value
            form.setValue('photoURL', imageUrl);

            // Update local state
            setUploadedImageUrl(imageUrl);
            setIsUploadComplete(true);

            // Update preview with the actual S3 URL
            setImagePreview(imageUrl);

            toast.dismiss(uploadToast);
            toast.success("Image uploaded successfully!");

            resolve(imageUrl);
          } else {
            toast.dismiss(uploadToast);
            toast.error("Upload failed", {
              description: "No URL returned from upload service"
            });
            setIsUploadComplete(false);
            resolve(null);
          }
        },
        onError: (error) => {
          toast.dismiss(uploadToast);
          toast.error("Upload failed", {
            description: error.message || "Failed to upload image"
          });
          setIsUploadComplete(false);
          resolve(null);
        }
      });
    });
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const submitToast = toast.loading("Updating profile...");

    try {
      let finalPhotoURL = values.photoURL;

      // If a new image was selected, upload it first
      if (profileImage && !isUploadComplete) {
        toast.dismiss(submitToast);
        const uploadToast = toast.loading("Uploading image first...");

        const uploadedUrl = await handleImageUpload();
        toast.dismiss(uploadToast);

        if (uploadedUrl) {
          finalPhotoURL = uploadedUrl;
          toast.success("Image uploaded!");
        } else {
          toast.error("Failed to upload image", {
            description: "Please try selecting the image again"
          });
          return;
        }

        // Restore loading toast for profile update
        toast.loading("Updating profile...", { id: submitToast });
      } else if (uploadedImageUrl) {
        // Use the already uploaded URL
        finalPhotoURL = uploadedImageUrl;
      }

      // Prepare update data - send ALL fields including photoURL
      const updateData = {
        name: values.name,
        email: values.email,
        contact: values.contact,
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
        pinCode: values.pinCode,
        photoURL: finalPhotoURL || "",
      };

      // Send the update request
      updateUser(updateData, {
        onSuccess: (response) => {
          toast.dismiss(submitToast);
          toast.success("Profile updated successfully!", {
            description: "Your profile has been updated",
            action: {
              label: "View Dashboard",
              onClick: () => router.push("/dashboard")
            }
          });

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        },
        onError: (error) => {
          toast.dismiss(submitToast);
          toast.error("Failed to update profile", {
            description: error.message || "Please try again"
          });
        },
      });
    } catch (error) {
      toast.dismiss(submitToast);
      toast.error("An error occurred", {
        description: "Please try again"
      });
      console.error('Form submission error:', error);
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Update image preview when userData changes
  useEffect(() => {
    if (userData.photoURL) {
      setImagePreview(userData.photoURL);
    }
  }, [userData.photoURL]);

  return (
    <Card className="w-full mx-auto border-none shadow-none rounded-none flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Details</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Profile Preview"
                        fill
                        sizes="128px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Upload Button Overlay */}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploading || isUpdatingUser}
                  className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Change profile picture"
                >
                  {isUploading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  )}
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="profile-image-upload"
              />

              <div className="mt-4 text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  disabled={isUploading || isUpdatingUser}
                  className="text-sm"
                >
                  {isUploading ? "Uploading..." : "Change Profile Picture"}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB
                </p>
                {profileImage && !isUploadComplete && (
                  <p className="text-xs text-amber-600 mt-1">
                    * Image will be uploaded when you click "Update Profile"
                  </p>
                )}
              </div>
            </div>

            {/* Hidden field for photoURL */}
            <FormField
              control={form.control}
              name="photoURL"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Full Name *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Email Address *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Contact Field */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Contact Number *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <FormLabel className="text-sm font-medium text-gray-700 flex-1">
                        Address *
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Your street address"
                        className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </div>
                </FormItem>
              )}
            />

            {/* City, State, Country, PIN Code Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        City *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        State *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Country *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2 border border-gray-300 bg-white p-3 rounded-md">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        PIN Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PIN Code"
                          className="border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 w-full pt-4">
              <Button
                type="submit"
                disabled={isUpdatingUser || isUploading}
                className="bg-gray-900 hover:bg-gray-800 w-full"
              >
                {(isUpdatingUser || isUploading) ? "Updating..." : "Update Profile"}
              </Button>
            </div>

            {isUpdatingUserError && (
              <div className="text-red-600 text-sm text-center">
                {updateUserError?.message || "Failed to update profile"}
              </div>
            )}

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}