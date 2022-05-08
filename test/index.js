import test from 'ava'
import persistUrlParams from "../lib/index.js";

const baseURL = 'https://lumiere.is';

test.beforeEach(() => {
    location.href = baseURL;
});

const { getSearchParams, updateURLParams } = persistUrlParams();
const url = new URL(baseURL);

const dateToInput = (d) => new Date(d).toISOString()

test('can update url query params', (t) => {
    t.notThrows(() => updateURLParams({ filter: "videos" }, url.searchParams))
    t.is(location.href, baseURL + '?filter=videos')
})

test('can fetch query param from url', (t) => {
    t.notThrows(() => updateURLParams({ filter: "videos" }, url.searchParams))
    t.is(getSearchParams("filter", url.searchParams), 'videos')
})

test('can update and fetch date query param from url', (t) => {
    const date = dateToInput(new Date())

    t.notThrows(() => updateURLParams({ date: date }, url.searchParams))
    t.is(getSearchParams("date", url.searchParams), date )
})

test('can update and fetch a deep nested props query param from url', (t) => {
    const date = dateToInput(new Date())
    const payload = { date: date, filter: "videos", sortBy: "date" }

    t.notThrows(() => updateURLParams({ props: payload }, url.searchParams))
    t.deepEqual(getSearchParams("props", url.searchParams), payload)
})