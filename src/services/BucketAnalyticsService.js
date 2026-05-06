import API from './api'

// Fetching distribution data by key - GET /cb/${bucket}/${source}/${collection}/documents/{key}
// Expected body: {}
// Expected response:if key='dsaType' then [{"drawing":2, "engineering":1}]
export const getDistributionDataByKey = (bucket, source, collection, key) =>
    API.get(`/cb/${bucket}/${source}/${collection}/distribution-data/${key}`)

// Fetching totalDocuments count - GET /cb/${bucket}/${source}/${collection}/documents/total
// Expected body: {}
// Expected response: {"count": 2}
export const getDocumentsCount = (bucket, source, collection) =>
    API.get(`/cb/${bucket}/${source}/${collection}/documents-count`)

// Fetching valid keys - GET /cb/validKeys
// Expected response: {"dsaType", "srcType"}
export const getValidKeys = () =>
    API.get(`cb/validKeys`)

export const getDocumentIdsList = (bucket, source, collection, key, value) =>
    API.get(`/cb/${bucket}/${source}/${collection}/idList?key=${key}&value=${value}`)

export const getDocumentById = (bucket, source, collection, docId) =>
    API.get(`/cb/${bucket}/${source}/${collection}/document/${docId}`)