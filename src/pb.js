import PocketBase from 'pocketbase'

const url = 'https://pbcdn.sainzcloud.my.id'
const pb = new PocketBase(url)

pb.autoCancellation(false)

export default pb