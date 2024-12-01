import gql from './gql'

export const FullMediaList = gql(`
  fragment FullMediaList on MediaList @_unmask {
    id,
    status,
    progress,
    repeat,
    score(format: POINT_10),
    customLists(asArray: true)
  }
`)

export const FullMedia = gql(`
  fragment FullMedia on Media @_unmask {
id,
# mediaListEntry {
#   ...FullMediaList
# },
}`)

export const IDMedia = gql(`
  query IDMedia($id: Int) {
    Media(id: $id, type: ANIME) {
      ...FullMedia
    }
  }
`, [FullMedia])

export const UserLists = gql(`
  query UserLists($id: Int) {
    MediaListCollection(userId: $id, type: ANIME, forceSingleCompletedList: true, sort: UPDATED_TIME_DESC) {
      user {
        id
      }
      lists {
        name,
        status,
        entries {
          ...FullMediaList,
          media {
            id,
          }
          #   status,
          #   nextAiringEpisode {
          #     episode
          #   },
            # relations {
            #   edges {
            #     relationType(version:2)
            #     node {
            #       id
            #     }
            #   }
            # }
          # }
        }
      }
    }
  }
`, [FullMediaList])
