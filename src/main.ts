import { Client, fetchExchange } from '@urql/svelte'
import { offlineExchange } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
import schema from './schema.json' with { type: 'json' }
import { IDMedia, UserLists } from './queries'

function deferred () {
  let resolve: () => void
  const promise = new Promise<void>(_resolve => { resolve = _resolve })
  // @ts-expect-error resolve is always defined
  return { resolve, promise }
}

const storagePromise = deferred()

const storage = makeDefaultStorage({
  idbName: 'graphcache-v3',
  onCacheHydrated: () => storagePromise.resolve(),
  maxAge: 14 // The maximum age of the persisted data in days
})

const client = new Client({
  url: 'https://graphql.anilist.co',
  exchanges: [
    offlineExchange({
      schema: schema as Parameters<typeof offlineExchange>[0]['schema'],
      logger: (...args) => console.log(...args),
      storage,
      keys: {
        FuzzyDate: () => null,
        PageInfo: () => null,
        Page: () => null,
        MediaTitle: () => null,
        MediaCoverImage: () => null,
        AiringSchedule: () => null,
        MediaListCollection: e => e.user?.id as string | null,
        MediaListGroup: e => e.name as string,
        UserAvatar: () => null
      }
    }),
    fetchExchange
  ],
  requestPolicy: 'cache-and-network'
})

await storagePromise?.promise

client.query(UserLists, { id: 1 }).subscribe(res => {
  console.log(res)
  client.query(IDMedia, { id: 1 }).toPromise()
})
