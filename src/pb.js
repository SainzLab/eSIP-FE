import PocketBase from 'pocketbase'

const pbUrl = import.meta.env.VITE_PB_URL || 'https://pbcdn.sainzlab.my.id'
const pb = new PocketBase(pbUrl)
// const url = 'http://163.61.58.220:8090'
// const pb = new PocketBase(url)

pb.autoCancellation(false)

export default pb
