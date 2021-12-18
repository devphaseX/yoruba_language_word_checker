export function partialDeepStateUpdate(
  target: any,
  source: any
) {
  if (typeof target !== 'object' || target === null)
    return source;
  const updatedDataKeys = Object.keys(source);
  if (updatedDataKeys.length < 1) return {};
  const immutableState = { ...target };
  updatedDataKeys.forEach((key) => {
    immutableState[key] = partialDeepStateUpdate(
      target[key],
      source[key]
    );
  });
  return immutableState;
}
