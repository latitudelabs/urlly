import test from 'ava'
import persistUrlParams from "../lib/index.js";

const baseURL = 'https://lumiere.is';
export function goto(url) {
    location.href += url;
}

test.beforeEach(() => {
    location.href = baseURL;
});

const { getSearchParams, updateURLParams } = persistUrlParams(goto);
const url = new URL(baseURL);

test('can update url query params', (t) => {
    t.notThrows(() => updateURLParams({ filter: "videos" }, url.searchParams))
    t.is(location.href, baseURL + '?filter=videos')
})

test('can fetch query param from url', (t) => {
    t.notThrows(() => updateURLParams({ filter: "videos" }, url.searchParams))
    t.is(getSearchParams("filter", url.searchParams), 'videos')
})