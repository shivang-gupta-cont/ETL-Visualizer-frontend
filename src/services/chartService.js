import API from './api'

// Fetching dsaType data - GET /cb/${bucket}/${source}/${collection}/documents/dsaTypeData
// Expected body: {}
// Expected response: [{"drawing":2, "engineering":1}]
export const fetchDSATypeData = (bucket, source, collection) =>
    API.get(`/cb/${bucket}/${source}/${collection}/documents/dsaTypeData`)

// Fetching dsaType data - GET /cb/${bucket}/${source}/${collection}/documents/total
// Expected body: {}
// Expected response: {"count": 2}
export const fetchDocumentsCount = (bucket, source, collection) =>
    API.get(`/cb/${bucket}/${source}/${collection}/documents/total`)