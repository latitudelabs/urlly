import { expectType } from "tsd";
import persistUrlParams, { defaultGoto } from "../index";

export type QueryParamType = "filter" | "sort";
const { getSearchParams, updateURLParams } =
  persistUrlParams<QueryParamType>(defaultGoto);

expectType<string | Record<string, any>>(getSearchParams("filter"));
expectType<void>(updateURLParams({ filter: "filter" }));
