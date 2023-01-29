export interface ReplaceOptions {
  replaceState?: boolean;
  keepFocus?: boolean;
  noscroll?: boolean;
  state?: any;
}
export type ReplaceFunction = (url: string, options?: ReplaceOptions) => void;
export type UpdateQueryParams<T extends string> = {
  [K in T]?: any;
};

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export function isDateString(v: string): boolean {
  return isoDateRegex.test(v);
}
export function isDate(v: any): v is Date {
  return (
    v instanceof Date || Object.prototype.toString.call(v) === "[object Date]"
  );
}

export function dateReviver(_: any, value: any) {
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

export function canBeJSON(obj: any) {
  const res = Object.prototype.toString.call(obj);
  return res === "[object Object]" || res === "[object Array]";
}

export function defaultGoto(url: string, opt: ReplaceOptions = {}) {
  location.href += url;
  if (opt.replaceState) {
    history.replaceState({}, "", url);
  }
}

export default function urlly<T extends string>(
  goto: ReplaceFunction = defaultGoto
) {
  let currentQuery = "";
  const updateURL = (query: string) => {
    if (currentQuery == query) return;
    currentQuery = query;
    goto(`?${query}`, {
      replaceState: true,
      keepFocus: true,
    });
  };

  return {
    updateQueryParams: (
      newParams: UpdateQueryParams<T>,
      searchParams: URLSearchParams = new URLSearchParams(location.search)
    ) => {
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          const params = canBeJSON(value)
            ? JSON.stringify(value)
            : encodeURIComponent(
                isDate(value) ? value.toISOString() : String(value)
              );

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
