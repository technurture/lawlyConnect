// Cloudinary integration for media management
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary configuration incomplete. Some features may not work properly.');
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

export class CloudinaryService {
  // Upload file from buffer
  async uploadFile(
    fileBuffer: Buffer,
    options: {
      folder?: string;
      public_id?: string;
      resource_type?: 'image' | 'video' | 'raw' | 'auto';
      allowed_formats?: string[];
      transformation?: any;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'lawly',
            public_id: options.public_id,
            resource_type: options.resource_type || 'auto',
            allowed_formats: options.allowed_formats,
            transformation: options.transformation,
          },
          (error: any, result: any) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                original_filename: result.original_filename || '',
                format: result.format,
                resource_type: result.resource_type,
                bytes: result.bytes,
                width: result.width,
                height: result.height,
              });
            }
          }
        );

        const readable = Readable.from(fileBuffer);
        readable.pipe(uploadStream);
      });

      return result;
    } catch (error: any) {
      throw new Error(`Cloudinary upload error: ${error.message}`);
    }
  }

  // Upload legal document with specific transformations
  async uploadLegalDocument(
    fileBuffer: Buffer,
    filename: string,
    options: {
      userId: string;
      caseId?: string;
      documentType?: string;
    }
  ): Promise<CloudinaryUploadResult> {
    const folder = `lawly/documents/${options.userId}${options.caseId ? `/${options.caseId}` : ''}`;
    
    return this.uploadFile(fileBuffer, {
      folder,
      public_id: `${options.documentType || 'document'}_${Date.now()}`,
      resource_type: 'raw', // For PDFs and other documents
      allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
    });
  }

  // Upload profile image with transformations
  async uploadProfileImage(
    fileBuffer: Buffer,
    userId: string,
    userType: 'client' | 'lawyer'
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(fileBuffer, {
      folder: `lawly/profiles/${userType}s`,
      public_id: `profile_${userId}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });
  }

  // Upload verification documents for lawyers
  async uploadVerificationDocument(
    fileBuffer: Buffer,
    lawyerId: string,
    documentType: 'bar_certificate' | 'practicing_certificate' | 'enrollment_certificate' | 'id_document'
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(fileBuffer, {
      folder: `lawly/verification/${lawyerId}`,
      public_id: `${documentType}_${Date.now()}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    });
  }

  // Delete file by public_id
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      
      return result.result === 'ok';
    } catch (error: any) {
      throw new Error(`Cloudinary delete error: ${error.message}`);
    }
  }

  // Get optimized URL for an uploaded file
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      ...options,
      secure: true,
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
    });
  }

  // Generate thumbnail for document preview
  generateDocumentThumbnail(publicId: string): string {
    return cloudinary.url(publicId, {
      width: 300,
      height: 400,
      crop: 'fit',
      page: 1, // First page for PDFs
      format: 'jpg',
      quality: 'auto',
      secure: true,
    });
  }
}

export const cloudinaryService = new CloudinaryService();