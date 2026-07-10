import { APIS } from '@/constants/api';
import { S3UploadPayload, S3UploadResponse } from '@/interface';
import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';



export const useUploadToS3 = () => {
    // const queryClient = useQueryClient();

    const { mutate, isPending, isError, error, data } = useMutation<
        S3UploadResponse,
        AxiosError,
        S3UploadPayload
    >({
        mutationKey: [APIS.fileUpload.new.Id],
        mutationFn: async (payload: S3UploadPayload) => {
            const formData = new FormData();
            formData.append('file', payload.file);

            // Append any additional fields if needed
            if (payload.folder) {
                formData.append('folder', payload.folder || "");
            }

            const res = await axiosInstance.post(
                APIS.fileUpload.new.Url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return res.data;
        },
        onSuccess: (res) => {
            // Invalidate any relevant queries if needed
            // queryClient.invalidateQueries({
            //     queryKey: ['some-query-key'],
            //     exact: false
            // });
            toast.success(res.message || 'File uploaded successfully');
        },
        onError: (error) => {
            console.log('File upload error:', error.code);
            if (error.code === "ERR_NETWORK")
                toast.error("Failed to upload file");
            else
                toast.error(error.message || "Failed to upload file");
        },
    });

    return {
        uploadToS3: mutate,
        isUploading: isPending,
        isUploadError: isError,
        uploadError: error,
        uploadData: data,
    };
};