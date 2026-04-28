import PocketBase from 'pocketbase'

const pbUrl = import.meta.env.VITE_PB_URL || 'http://192.168.8.10:8083'
const pb = new PocketBase(pbUrl)
// const url = 'http://163.61.58.220:8090'
// const pb = new PocketBase(url)

pb.autoCancellation(false)

export default pb
