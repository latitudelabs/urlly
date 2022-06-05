import test from 'ava'
import urlly, { isDateString } from "../lib/index.js";

const baseURL = 'https://www.example.com';
let url = new URL(baseURL);
location.href = baseURL;

test.afterEach.always(() => {
    location.href = baseURL;
    url = new URL(baseURL);
})

const { getSearchParams, updateQueryParams } = urlly();

const dateToInput = (d) => new Date(d).toISOString()

test('can update url query params', (t) => {
    t.notThrows(() => updateQueryParams({ filter: "videos" }, url.searchParams))
    t.is(location.href, baseURL + '?filter=videos')
})

test('can fetch query param from url', (t) => {
    t.notThrows(() => updateQueryParams({ filter: "videos" }, url.searchParams))
    t.is(getSearchParams("filter", url.searchParams), 'videos')
})

test('can update and fetch date query param from url', (t) => {
    const date = dateToInput(new Date())

    t.notThrows(() => updateQueryParams({ date: date }, url.searchParams))
    t.is(getSearchParams("date", url.searchParams), date )
})

test('can properly encode and decode a date object', (t) => {
    const date = new Date()

    t.notThrows(() => updateQueryParams({ date: date }, url.searchParams))
    t.is(getSearchParams("date", url.searchParams), dateToInput(date) )
})

test('returned date value is a date string', (t) => {
    const date = new Date()

    t.notThrows(() => updateQueryParams({ date: date }, url.searchParams))
    t.is(isDateString(getSearchParams("date", url.searchParams)), true )
})

test('can update and fetch a deep nested props query param from url', (t) => {
    const date = new Date()
    const payload = { date: date, filter: "videos", sortBy: "date" }

    t.notThrows(() => updateQueryParams({ props: payload }, url.searchParams))
    t.deepEqual(getSearchParams("props", url.searchParams), payload)
})