import PocketBase from 'pocketbase'

const url = 'http://192.168.8.10:8083'
const pb = new PocketBase(url)

pb.autoCancellation(false)

export default pb