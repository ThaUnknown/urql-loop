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
idMal,
title {
  romaji,
  english,
  native,
  userPreferred
},
description(asHtml: false),
season,
seasonYear,
format,
status,
episodes,
duration,
averageScore,
genres,
isFavourite,
coverImage {
  extraLarge,
  medium,
  color,
},
source,
countryOfOrigin,
isAdult,
bannerImage,
synonyms,
nextAiringEpisode {
  id,
  timeUntilAiring,
  episode
},
startDate {
  year,
  month,
  day
},
trailer {
  id,
  site
},
# mediaListEntry {
#   ...FullMediaList
# },
studios(isMain: true) {
  nodes {
    id,
    name
  }
},
notaired: airingSchedule(page: 1, perPage: 50, notYetAired: true) {
  n: nodes {
    a: airingAt,
    e: episode
  }
},
aired: airingSchedule(page: 1, perPage: 50, notYetAired: false) {
  n: nodes {
    a: airingAt,
    e: episode
  }
},
relations {
  edges {
    relationType(version:2),
    node {
      id,
      title {userPreferred},
      coverImage {medium},
      type,
      status,
      format,
      episodes,
      synonyms,
      season,
      seasonYear,
      startDate {
        year,
        month,
        day
      },
      endDate {
        year,
        month,
        day
      }
    }
  }
}
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
