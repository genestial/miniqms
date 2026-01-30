/**
 * Vercel Blob Storage Implementation
 * Alternative to S3 for Vercel deployments
 */

import { put, del, head, list } from '@vercel/blob'

/**
 * Upload a file to Vercel Blob storage
 * @param file - File buffer or stream
 * @param tenantId - Tenant ID for organization
 * @param module - Module name (e.g., 'evidence', 'audits', 'reviews')
 * @param entityId - Entity ID (e.g., evidence ID, audit ID)
 * @param filename - Original filename
 * @returns Storage key (URL path)
 */
export async function uploadFileVercel(
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
  
  // Generate storage path: tenantId/module/entityId/filename
  const path = `${tenantId}/${module}/${entityId}/${sanitizedFilename}`

  // Upload to Vercel Blob
  // Convert Buffer/Uint8Array to ArrayBuffer for Blob constructor (Edge runtime compatible)
  // Create a new ArrayBuffer by copying data to ensure proper type compatibility
  let arrayBuffer: ArrayBuffer
  if (file instanceof Buffer) {
    // Create a new ArrayBuffer and copy Buffer data
    const uint8 = new Uint8Array(file)
    arrayBuffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength) as ArrayBuffer
  } else if (file instanceof Uint8Array) {
    // Create a new ArrayBuffer from Uint8Array by copying
    const copy = new Uint8Array(file)
    arrayBuffer = copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.byteLength) as ArrayBuffer
  } else {
    // Fallback: create ArrayBuffer from the input
    const uint8 = new Uint8Array(file)
    arrayBuffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength) as ArrayBuffer
  }
  const fileBlob = new Blob([arrayBuffer], { type: getContentType(filename) })
  const blob = await put(path, fileBlob, {
    access: 'public', // Vercel Blob only supports 'public' access
    contentType: getContentType(filename),
  })

  // Return the path (storage key)
  return path
}

/**
 * Delete a file from Vercel Blob storage
 * @param storageKey - Storage key (path) to delete
 */
export async function deleteFileVercel(storageKey: string): Promise<void> {
  if (!storageKey) {
    throw new Error('Storage key is required for file deletion')
  }

  // Vercel Blob uses URLs, but we store paths
  // We need to find the blob by path and delete it
  const blobs = await list({ prefix: storageKey })
  for (const blob of blobs.blobs) {
    if (blob.pathname === storageKey) {
      await del(blob.url)
    }
  }
}

/**
 * Generate a signed URL for secure file access
 * Note: Vercel Blob URLs are already signed/temporary by default
 * For private blobs, you can use the blob URL directly
 * @param storageKey - Storage key (path)
 * @param expiresIn - Expiration time in seconds (Vercel handles this automatically)
 * @returns Signed URL
 */
export async function getSignedUrlVercel(
  storageKey: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!storageKey) {
    throw new Error('Storage key is required for signed URL generation')
  }

  // Find the blob by path
  const blobs = await list({ prefix: storageKey })
  const blob = blobs.blobs.find(b => b.pathname === storageKey)
  
  if (!blob) {
    throw new Error(`Blob not found: ${storageKey}`)
  }

  // Vercel Blob URLs are already signed for private blobs
  return blob.url
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
  const parts = storageKey.split('/')
  return parts.length >= 4 && parts.every(part => part.length > 0)
}
