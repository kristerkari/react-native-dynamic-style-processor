import { Dimensions } from "react-native";
import { transform } from "css-viewport-units-transform";
import { process as mediaQueriesProcess } from "react-native-css-media-query-processor";
import memoize from "micro-memoize";

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
  return omitMemoized(mediaQueriesProcess(obj, matchObject), "__mediaQueries");
}

export function process(obj) {
  const matchObject = getMatchObject();
  return viewportUnitsTransform(
    mediaQueriesTransform(obj, matchObject),
    matchObject
  );
}

function getMatchObject() {
  const win = Dimensions.get("window");
  return {
    width: win.width,
    height: win.height,
    orientation: win.width > win.height ? "landscape" : "portrait",
    "aspect-ratio": win.width / win.height,
    type: "screen"
  };
}
