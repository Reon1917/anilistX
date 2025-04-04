# Jikan API Integration

## Current Implementation

We are currently using two Jikan API client libraries:

### Primary: @tutkli/jikan-ts

A modern TypeScript wrapper for the Jikan API with built-in types, caching, and structured client architecture.

```typescript
import { JikanClient } from '@tutkli/jikan-ts';

const client = new JikanClient({
  enableLogging: false, // Enable for debugging
});

// Access through specialized sub-clients
const animeData = await client.anime.getAnimeById(1);
const topAnime = await client.top.getTopAnime({ page: 1, limit: 25 });
const seasonalAnime = await client.seasons.getSeason(2023, 'winter', { page: 1 });
```

#### Features
- Fully typed responses
- Built-in HTTP caching with axios-cache-interceptor
- Organized client structure
- ESM with tree-shaking support

Our implementation includes fallback mechanisms for API inconsistencies and proper error handling to ensure reliability.

### Secondary: @mateoaranda/jikanjs

Used as a fallback for certain operations or when needed.

```typescript
import jikanjs from '@mateoaranda/jikanjs';

// Using raw method for direct API access
const response = await jikanjs.raw(['anime', id]);
```

## Current Issues

### "listener" Error in Secondary Pages

We're currently experiencing an error with the jikanjs implementation:

```
Error: The "listener" argument must be of type Function. Received type object

lib\jikan.ts (194:26) @ getSeasonalAnime

  192 |       } else {
  193 |         // Default to current season
> 194 |         response = await jikanjs.raw(['seasons', 'now'], {
      |                          ^
  195 |           page: page,
  196 |           limit: limit
  197 |         });
```

This error occurs in the `getSeasonalAnime` function when trying to fetch seasonal anime data. It appears the jikanjs library is expecting a function as a parameter for its event handling, but is receiving a configuration object.

### API Integration Status
- Main homepage: Working (using jikan-ts implementation)
- Secondary pages: Not working (using jikanjs implementation with "listener" error)

### Next Steps
1. Fix parameter format in jikanjs.raw() calls
2. Complete migration to jikan-ts for all pages
3. Add better error handling and fallbacks

---

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mateoaranda/jikanjs/.github/workflows/node.js.yml?branch=master) ![Known Vulnerabilities](https://snyk.io/test/github/mateoaranda/jikanjs/badge.svg) 


JikanJS 
=======
this is a v4 version of [zuritor's jikanjs](https://github.com/zuritor/jikanjs)

## Installation

`npm install @mateoaranda/jikanjs --save`

## wrapped jikan Features

* [Anime](https://docs.api.jikan.moe/#tag/anime)
* [Character](https://docs.api.jikan.moe/#tag/characters)
* [Clubs](https://docs.api.jikan.moe/#tag/clubs)
* [Genres](https://docs.api.jikan.moe/#tag/genres)
* [Magazines](https://docs.api.jikan.moe/#tag/magazines)
* [Manga](https://docs.api.jikan.moe/#tag/manga)
* [People](https://docs.api.jikan.moe/#tag/people)
* [Producers](https://docs.api.jikan.moe/#tag/producers)
* [Random](https://docs.api.jikan.moe/#tag/random)
* [Recommendations](https://docs.api.jikan.moe/#tag/recommendations)
* [Reviews](https://docs.api.jikan.moe/#tag/reviews)
* [Anime Schedule](https://docs.api.jikan.moe/#tag/schedules)
* [Users](https://docs.api.jikan.moe/#tag/users)
* [Top](https://docs.api.jikan.moe/#tag/top)

## wrapped MAL Features
* [User Anime list](https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_animelist_get)
* [User Manga list](https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_mangalist_get)

## Usage

```javascript
const jikanjs = require('@mateoaranda/jikanjs');
```

## Modify API URL
It is possible to change the API Base URL

```javascript
jikanjs.settings.setBaseURL('apiurl'); // sets the API Base URL
```

## API Methods
* All API functions are promised Based
* Information of all possible parameters are located at the [documentation](https://docs.api.jikan.moe/)

```javascript
jikanjs.loadAnime(id [, request [, parameters]])
jikanjs.loadCharacter(id [, request])
jikanjs.loadClub(id [, request [, page]])
jikanjs.loadGenres(type [, page [, limit [, filter]]])
jikanjs.loadMagazines([page])
jikanjs.loadManga(id [, request [, page]])
jikanjs.loadPerson(id [, request])
jikanjs.loadProducers([page])
jikanjs.loadRandom(type)
jikanjs.loadRecommendations(type [, page])
jikanjs.loadReviews(type [, page])
jikanjs.loadSchedule(day [, page [, limit]])
jikanjs.loadUser(username [, request [, page]])
jikanjs.loadAnimelist(username [, limit [, offset]])
jikanjs.loadMangalist(username [, limit [, offset]])
jikanjs.loadSeason(year, season [, page])
jikanjs.loadSeasonArchive()
jikanjs.loadCurrentSeason([page])
jikanjs.loadUpcomingSeason([page])
jikanjs.loadTop(type [, page [, subtype [, filter]]])
jikanjs.search(type, query [, limit [, parameters]])
jikanjs.raw(urlParts [, queryParameters [, mal]])
```
## Examples

### loadAnime(id [, request [, parameters]])
`id`: Anime ID  
`request`: full, characters, staff, episodes, news, forum, videos, videosepisodes, pictures, statistics, moreinfo, recommendations, userupdates, reviews, relations, themes, external  
`parameters`: query parameters, check the docs for more info

```javascript
await jikanjs.loadAnime(31240); // Anime Information
await jikanjs.loadAnime(31240, 'episodes'); // All Episodes
await jikanjs.loadAnime(31240, 'episodes', 15); // Episode 15
await jikanjs.loadAnime(31240, 'forum', { filter: 'episode' });

```

### loadCharacter(id [, request])
`id`: Character ID  
`request`: full, anime, manga, voices, pictures

```javascript
await jikanjs.loadCharacter(118737); // Character information
await jikanjs.loadCharacter(118737, 'pictures'); // Character pictures
```

### loadClub(id [, request [, page]])
`id`: Club ID  
`request`: members, staff, relations  
`page`: Page number, available on `members` request, default: 1

```javascript
await jikanjs.loadClub(73113); // Club information
await jikanjs.loadClub(73113, 'members', 10); // 10th Page of this club members
```

### loadGenres(type [, filter])
`type`: either `anime` or `manga`  
`filter`: genres, explicit_genres, themes, demographics  

```javascript
await jikanjs.loadGenres('anime'); // All anime genres
await jikanjs.loadGenres('manga', 'explicit_genres'); // Manga explicit genres
```

### loadMagazines([page])
`page`: Page Number, default: 1

```javascript
await jikanjs.loadMagazines(); // Magazines collection
```

### loadManga(id [, request [, page]])
`id`: Manga ID  
`request`: full, characters, news, forum, pictures, statistics, moreinfo, recommendations, userupdates, reviews, relations, external  
`page`: Page Number, available on `news` `userupdates` `reviews` requests

```javascript
await jikanjs.loadManga(74697); // Manga information
await jikanjs.loadManga(74697, 'reviews', 1); // First page of reviews
```

### loadPerson(id [, request])
`id`: Person ID  
`request`: full, anime, voices, manga, pictures

```javascript
await jikanjs.loadPerson(34785); // Person information
await jikanjs.loadPerson(34785, 'voices'); // All Person's Voice Acting Roles
```

### loadProducers([page])
`page`: Page Number, default: 1  

```javascript
await jikanjs.loadProducers(); // Producers collection
```

### loadRandom(type)
`type`: anime, manga, characters, people, users

```javascript
await jikanjs.loadRandom('anime'); // Some random anime
```

### loadRecommendations(type [, page])
`type`: either `anime` or `manga`  
`page`: Page Number, default: 1  

```javascript
await jikanjs.loadRecommendations('anime'); // First page of recent anime recommendations
```

### loadReviews(type [, page])
`type`: either `anime` or `manga`  
`page`: Page Number, default: 1  
`preliminary`: Receive reviews tagged as preliminary? Default: false  
`spoiler`: Receive reviews tagged as a spoiler? Default: false

```javascript
await jikanjs.loadReviews('manga'); // First page of recent manga reviews
```

### loadSchedule(day [, page [, limit]])
`day`: monday, tuesday, wednesday, thursday, friday, saturday, sunday, other, unknown  
`page`: Page Number, default: 1  
`limit`: Result limit number  
`kids`: Filter entries with the Kids Genre, Default: false  
`sfw`: Filter entries with the Hentai Genre, Default: false  
`unapproved`: Include entries which are unapproved, Default: false

```javascript
await jikanjs.loadSchedule('monday'); // Monday's anime schedule
```

### loadUser(username [, request [, page]])
`username`: User's username  
`request`: full, statistics, favorites, userupdates, about, history, friends, reviews, recommendations, clubs, external  
`page`: Page number, available on `friends` `reviews` `recommendations` `clubs` requests

```javascript
await jikanjs.loadUser('pepito'); // Profile information
await jikanjs.loadUser('pepito', 'friends', 6); // 6th page of pepito's friends
```

### loadAnimelist(username [, limit [, offset]])
`username`: User's Username  
`limit`: Amount of elements to receive, Default: 1000  
`offset`: Offset, Default: 0

```javascript
await jikanjs.loadAnimelist('pepito'); // pepito's animelist
```

### loadMangalist(username [, limit [, offset]])
`username`: User's Username  
`limit`: Amount of elements to receive, Default: 1000  
`offset`: Offset, Default: 0

```javascript
await jikanjs.loadMangalist('pepito'); /// pepito's mangalist
```

### loadSeason(year, season [, page])
`year`: Season Year (1970-Now)  
`season`: winter, spring, summer, fall  
`page`: Page Number, default: 1  

```javascript
await jikanjs.loadSeason(2021, 'fall'); // First page of Fall 2021 animes
```

### loadSeasonArchive()
```javascript
await jikanjs.loadSeasonArchive(); // Seasons collection
```

### loadCurrentSeason([page])
`page`: Page Number, default: 1  

```javascript
await jikanjs.loadCurrentSeason(); // First page of the current season's animes
```


### loadUpcomingSeason([page])
`page`: Page Number, default: 1  

```javascript
await jikanjs.loadUpcomingSeason(3); // Third page of next season's animes
```

### loadTop(type [, page [, subtype [, filter]]])
`type`: anime, manga, people, characters, reviews  
`page`: Page Number, default: 1 (25 items per page)  
`subtype`:   
⠀⠀`anime`: tv, movie, ova, special, ona, music, cm, pv, tv_special  
⠀⠀`manga`: manga, novel, lightnovel, oneshot, doujin, manhwa, manhua  
`filter`:  
⠀⠀`anime`: airing, upcoming, bypopularity, favorite  
⠀⠀`manga`: publishing, upcoming, bypopularity, favorite  

```javascript
await jikanjs.loadTop('anime'); // Top 25 animes
await jikanjs.loadTop('anime', 1, 'movie'); // First page of top anime movies
```

### search(type, query [, limit [, parameters]])
`type`: anime, manga, people, characters, clubs  
`query`: search term  
`limit`: results limit number  
`parameters`: extra query parameters, see docs for more info on this

```javascript
await jikanjs.search('characters', 'Emilia', 1); // Search for a character named "Emilia"
``` 

### (EXTRA) raw(urlParts [, queryParameters [, mal]])
`urlParts`: Array with api endpoint path, e.g. [anime, 1] to load the anime with the id of 1  
`queryParameters`: query parameters, needs to be a key value pair like { page: 1 }  
`mal`: Request to MAL API? Default: false

```javascript
await jikanjs.raw(['anime', 1]); // Same as loadAnime(1);
```