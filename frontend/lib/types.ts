export type StoredFile = {
  id: string // S3 object key
  filename: string // original filename
  bucket: string // S3 bucket name
  size: number // bytes
  contentType: string | null
  lastModified: string // ISO string
  url: string | null // optional pre-signed URL for viewing/downloading
}

export type ListFilesResponse = {
  files: StoredFile[]
}

export type SingleFileResponse = {
  file: StoredFile
}

export type DeleteFileResponse = {
  success: boolean
}
