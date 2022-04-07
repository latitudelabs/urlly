export interface ReplaceOptions {
  replaceState?: boolean;
  keepfocus?: boolean;
  noscroll?: boolean;
  state?: any;
}

export type ReplaceFunction = (url: string, options?: ReplaceOptions) => void;

export function safeParseJSON(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

function canBeJSON(obj: any): boolean {
  const res = Object.prototype.toString.call(obj);
  return res === "[object Object]" || res === "[object Array]";
}

export function defaultGoto(url: string) {
  location.href = url;
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
    updateURLParams: (newParams: Record<string, any>) => {
      const searchParams = new URLSearchParams(location.search);
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          const params = canBeJSON(value)
            ? JSON.stringify(value)
            : encodeURIComponent(value);

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
