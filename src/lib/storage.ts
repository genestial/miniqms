import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner'
import { put as vercelPut, del as vercelDel, list as vercelList } from '@vercel/blob'

// Check if using Vercel Blob
const USE_VERCEL_BLOB = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_STORAGE === 'true'

// Initialize S3 client based on environment (only if not using Vercel Blob)
let s3Client: S3Client | null = null
if (!USE_VERCEL_BLOB) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT, // For S3-compatible services like MinIO
    credentials: process.env.AWS_ACCESS_KEY_ID ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    } : undefined,
  })
}

const BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.BLOB_STORAGE_BUCKET || 'miniqms'

/**
 * Upload a file to S3-compatible storage or Vercel Blob
 * @param file - File buffer or stream
 * @param tenantId - Tenant ID for organization
 * @param module - Module name (e.g., 'evidence', 'audits', 'reviews')
 * @param entityId - Entity ID (e.g., evidence ID, audit ID)
 * @param filename - Original filename
 * @returns Storage key (e.g., 'tenantId/module/entityId/filename')
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  tenantId: string,
  module: string,
  entityId: string,
  filename: string
): Promise<string> {
  // Validate inputs
  if (!tenantId || !module || !entityId || !filename) {
    throw new Error('All parameters are required for file upload')
  }

  // Sanitize filename
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  
  // Generate storage key: tenantId/module/entityId/filename
  const storageKey = `${tenantId}/${module}/${entityId}/${sanitizedFilename}`

  // Use Vercel Blob if configured
  if (USE_VERCEL_BLOB) {
    await vercelPut(storageKey, file, {
      access: 'private',
      contentType: getContentType(filename),
    })
    return storageKey
  }

  // Otherwise use S3
  if (!s3Client) {
    throw new Error('S3 client not initialized. Check your storage configuration.')
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: storageKey,
    Body: file,
    ContentType: getContentType(filename),
  })

  await s3Client.send(command)

  return storageKey
}

/**
 * Delete a file from S3-compatible storage or Vercel Blob
 * @param storageKey - Storage key to delete
 */
export async function deleteFile(storageKey: string): Promise<void> {
  if (!storageKey) {
    throw new Error('Storage key is required for file deletion')
  }

  // Use Vercel Blob if configured
  if (USE_VERCEL_BLOB) {
    const blobs = await vercelList({ prefix: storageKey })
    for (const blob of blobs.blobs) {
      if (blob.pathname === storageKey) {
        await vercelDel(blob.url)
        return
      }
    }
    throw new Error(`Blob not found: ${storageKey}`)
  }

  // Otherwise use S3
  if (!s3Client) {
    throw new Error('S3 client not initialized. Check your storage configuration.')
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: storageKey,
  })

  await s3Client.send(command)
}

/**
 * Generate a signed URL for secure file access
 * @param storageKey - Storage key
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getSignedUrl(
  storageKey: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!storageKey) {
    throw new Error('Storage key is required for signed URL generation')
  }

  // Use Vercel Blob if configured
  if (USE_VERCEL_BLOB) {
    const blobs = await vercelList({ prefix: storageKey })
    const blob = blobs.blobs.find(b => b.pathname === storageKey)
    
    if (!blob) {
      throw new Error(`Blob not found: ${storageKey}`)
    }

    // Vercel Blob URLs are already signed for private blobs
    return blob.url
  }

  // Otherwise use S3
  if (!s3Client) {
    throw new Error('S3 client not initialized. Check your storage configuration.')
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: storageKey,
  })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Get content type from filename
 */
function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
  }
  return contentTypes[ext || ''] || 'application/octet-stream'
}

/**
 * Validate storage key format
 */
export function validateStorageKey(storageKey: string): boolean {
  // Format: tenantId/module/entityId/filename
  const parts = storageKey.split('/')
  return parts.length >= 4 && parts.every(part => part.length > 0)
}
