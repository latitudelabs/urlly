import { expectType } from "tsd";
import urlly, { defaultGoto } from "../index";

export type QueryParamType = "filter" | "sort";
const { getSearchParams, updateQueryParams } =
  urlly<QueryParamType>(defaultGoto);

expectType<string | Record<string, any>>(getSearchParams("filter"));
expectType<void>(updateQueryParams({ filter: "filter" }));
