# URLLY

Utility to safely get and update browser url params with ease 😋.

## TODO

- [X] add usage/example
- [ ] describe the API
- [ ] add more tests cases

## Usage

1. Import and init

```ts
import urlly from "@latitudelabs/urlly";

const { updateURLParams, getSearchParams } = urlly();
```

2. Can properly encode to url params.

```ts
let url = new URL('https://www.example.com');
const qps = { date: new Date(), filter: "videos", sortBy: "date", sortOrder: "desc" };

updateURLParams(qps, url.searchParams)

// url with query param :=> https://www.example.com?date=2022-06-05T09%253A20%253A18.678Z&filter=videos&sortBy=date&sortOrder=desc
```

3. Can properly decode from url params.

```ts
const url  = 'https://www.example.com?date=2022-06-05T09%253A20%253A18.678Z&filter=videos&sortBy=date&sortOrder=desc'

assert(getSearchParams("sortBy", url.searchParams), 'date') // :=> true
```

4. Can properly decode query params with nested objects.

```ts
let url = new URL('https://www.example.com');
const payload = { date: new Date(), filter: "videos", sortBy: "date", sortOrder: "desc" };
const qps = { props: payload }; // nest the payload in props

updateURLParams(qps, url.searchParams) 

// url with query param :=> https://www.example.com?props=%7B%22date%22%3A%222022-06-05T09%3A27%3A08.110Z%22%2C%22filter%22%3A%22videos%22%2C%22sortBy%22%3A%22date%22%2C%22sortOrder%22%3A%22desc%22%7D

assertDeep(getSearchParams("props", url.searchParams), payload) // :=> true
```
