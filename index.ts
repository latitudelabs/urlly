export interface ReplaceOptions {
  replaceState?: boolean;
  keepfocus?: boolean;
  noscroll?: boolean;
  state?: any;
}

export type ReplaceFunction = (url: string, options?: ReplaceOptions) => void;

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export function isDateString(v: string): boolean {
  return isoDateRegex.test(v);
}

export function isDate(v: any): boolean {
  return (
    v instanceof Date || Object.prototype.toString.call(v) === "[object Date]"
  );
}

function dateReviver(_: any, value: any) {
  if (typeof value !== "string") return value;
  return isDateString(value) ? new Date(value) : value;
}

export function safeParseJSON(str: string) {
  try {
    return JSON.parse(str, dateReviver);
  } catch (e) {
    return str;
  }
}

export function canBeJSON(obj: any): boolean {
  const res = Object.prototype.toString.call(obj);
  return res === "[object Object]" || res === "[object Array]";
}

export function defaultGoto(url: string, opt: ReplaceOptions = {}) {
  location.href += url;
  if (opt.replaceState) {
    history.replaceState({}, "", url);
  }
}

export default function persistUrlParams<T extends string>(
  goto: ReplaceFunction = defaultGoto
) {
  let currentQuery = "";
  const updateURL = (query: string) => {
    if (currentQuery != query) {
      goto(`?${query}`, {
        replaceState: true,
        keepfocus: true,
      });
      currentQuery = query;
    }
  };

  return {
    updateURLParams: (
      newParams: Record<string, any>,
      searchParams: URLSearchParams = new URLSearchParams(location.search)
    ) => {
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          const params = canBeJSON(value)
            ? JSON.stringify(value)
            : encodeURIComponent(isDate(value) ? value.toISOString() : value);

          searchParams.set(key, params);
        } else if (searchParams.has(key)) {
          searchParams.delete(key);
        }
      }
      updateURL(searchParams.toString());
    },
    getSearchParams: (
      param: T,
      search: URLSearchParams = new URLSearchParams("")
    ): string | Record<string, any> =>
      safeParseJSON(decodeURIComponent(search.get(param) || '""')),
  };
}
