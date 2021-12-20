type DataMap<State, K extends keyof State> = {
  '[[_data_]]': State[K];
  mapper?: (prev: State[K], cur: State[K]) => State[K];
};
export type StateReplacement<State> = Partial<{
  [K in keyof State]:
    | DataMap<State, K>
    | StateReplacement<State[K]>;
}>;

export function partialDeepStateUpdate<State>(
  target: State | State[keyof State],
  source: StateReplacement<State>
) {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  const stateUpdateKeys = Reflect.ownKeys(source) as Array<
    keyof State
  >;

  const immutableState = Array.isArray(target)
    ? [...target]
    : { ...target };

  stateUpdateKeys.forEach((key) => {
    let sourceValue = source[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      '[[_data_]]' in sourceValue
    ) {
      const { '[[_data_]]': data, mapper } =
        sourceValue as DataMap<State, typeof key>;
      if (mapper) {
        //@ts-ignore
        immutableState[key] = mapper(target[key], data);
      } else {
        //@ts-ignore
        immutableState[key] = data;
      }
    } else {
      //@ts-ignore
      immutableState[key] = partialDeepStateUpdate(
        //@ts-ignore
        target[key],
        //@ts-ignore
        source[key]
      );
    }
  });

  return immutableState;
}

const b = { a: { b: { c: 1, d: 2 } } };
// const me = partialDeepStateUpdate2(b, {
//   a: { b: { '[[_data_]]': { c: 1, d: 2 } } },
// });

// console.log(me);
// export function partialDeepStateUpdate<State>(
//   target: State | State[keyof State],
//   source: DeepPartial<State>,
//   stateMapper?:
//     | PendState<typeof target>
//     | StateMapper<typeof target>
// ) {
//   if (
//     typeof source !== 'object' ||
//     Array.isArray(source) ||
//     source === null
//   ) {
//     if (stateMapper && typeof stateMapper === 'function') {
//       return stateMapper(target, source);
//     } else {
//       return source;
//     }
//   }
//   const updateStateKeys = Reflect.ownKeys(source) as Array<
//     keyof typeof target
//   >;
//   if (!updateStateKeys.length) return {};

//   const immutableState = { ...target };

//   updateStateKeys.forEach((key) => {
//     const targetValue = target[key];
//     immutableState[key] = partialDeepStateUpdate(
//       targetValue as any,
//       source[key] as typeof targetValue,
//       stateMapper
//         ? typeof stateMapper !== 'function'
//           ? (stateMapper[key] as any)
//           : stateMapper
//         : undefined
//     );
//   });

//   return immutableState as State;
// }
