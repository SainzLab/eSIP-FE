import PocketBase from 'pocketbase'

const pbUrl = import.meta.env.VITE_PB_URL || 'http://192.168.8.10:8083'
const pb = new PocketBase(pbUrl)

pb.autoCancellation(false)

export default pb