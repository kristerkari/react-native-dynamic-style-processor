import { transform } from "css-viewport-units-transform";
import memoize from "micro-memoize";
import { process as mediaQueriesProcess } from "react-native-css-media-query-processor";

function omit(obj, omitKey) {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== omitKey) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

const omitMemoized = memoize(omit);

function viewportUnitsTransform(obj, matchObject) {
  const hasViewportUnits = "__viewportUnits" in obj;

  if (!hasViewportUnits) {
    return obj;
  }
  return transform(omitMemoized(obj, "__viewportUnits"), matchObject);
}

function mediaQueriesTransform(obj, matchObject) {
  const hasParsedMQs = "__mediaQueries" in obj;

  if (!hasParsedMQs) {
    return obj;
  }
  return mediaQueriesProcess(obj, matchObject);
}

export function process(obj, matchObject) {
  return viewportUnitsTransform(
    mediaQueriesTransform(obj, matchObject),
    matchObject
  );
}
