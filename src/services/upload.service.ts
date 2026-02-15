import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

export const uploadService = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || "Upload failed";
            console.error("Cloudinary Error:", errorMessage);
            throw new Error(errorMessage);
        }
    },
};
