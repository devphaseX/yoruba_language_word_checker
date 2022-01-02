import { SubscriberUpdateRequirement } from '../../store/type';
import {
  PropertyKeyArray,
  SlicedGlobalState,
} from './globalTypes';

type DataMap<State, K extends keyof State> = {
  '[[_data_]]': State[K];
  mapper?: (prev: State[K], cur: State[K]) => State[K];
};
export type StateReplacement<State> = Partial<{
  [K in keyof State]:
    | DataMap<State, K>
    | StateReplacement<State[K]>;
}>;

interface PartialDeepStateUpdateFn {
  <State>(
    target: State,
    source: StateReplacement<State>
  ): State;
}

export const partialDeepStateUpdate: PartialDeepStateUpdateFn =
  (target, source) => {
    if (typeof source !== 'object' || source === null) {
      return source;
    }

    type State = typeof target;
    const stateUpdateKeys = Reflect.ownKeys(
      source
    ) as Array<keyof State>;

    const immutableState = clone(target);

    stateUpdateKeys.forEach((key) => {
      let sourceValue = source[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        '[[_data_]]' in sourceValue
      ) {
        const { '[[_data_]]': data, mapper } =
          sourceValue as DataMap<State, typeof key>;
        immutableState[key] = mapper
          ? mapper(target[key], data)
          : data;
      } else {
        if (key in immutableState) {
          immutableState[key] = partialDeepStateUpdate(
            target[key],
            source[key] as StateReplacement<
              State[keyof State]
            >
          );
        }
      }
    });

    return immutableState;
  };

function clone<State>(value: State) {
  return (
    Array.isArray(value) ? [...value] : { ...value }
  ) as State;
}

export interface RoutePath {
  path: string;
  exact: boolean;
}
export function isPathEligibleForRevalidate(
  curPath: string,
  allowedPath: RoutePath | Array<RoutePath>
): boolean {
  if (!Array.isArray(allowedPath)) {
    const { exact, path } = allowedPath;
    if (exact) {
      return new RegExp(
        `^${escapeRegexMetaChar(path)}$`
      ).test(curPath);
    } else {
      return path.startsWith(curPath);
    }
  }

  function doesPassRouteCheck(
    definedPath: Array<RoutePath>,
    userNavPath: string
  ) {
    return !definedPath.some((path) =>
      isPathEligibleForRevalidate(userNavPath, path)
    );
  }

  return doesPassRouteCheck(allowedPath, curPath);
}

function escapeRegexMetaChar(value: string) {
  return value.replace(
    /[.*+\-/?^${}()|[\]\\]/g,
    String.raw`\$&`
  );
}

export function pick<
  State,
  Parts extends PropertyKeyArray<State>
>(parts: Parts, state: State): Pick<State, Parts[number]> {
  const pickedState = {} as any;
  parts.forEach((key) => {
    pickedState[key] = state[key];
  });

  return pickedState;
}

export function takeFromList<T>(
  list: Array<T>,
  offset: number,
  length: number
): Array<T> {
  return list.slice(offset, length);
}

export function generateSudoId(): string {
  return Math.random().toString(32).slice(2);
}

export function sliceObject<
  State = Record<PropertyKey, any>,
  DKey extends PropertyKeyArray<State> = PropertyKeyArray<State>
>(
  state: State,
  dKey: DKey
): SlicedGlobalState<State, DKey> {
  return pick(dKey, state);
}

type StateMapper<State> = () => State;

export function getStateSnapshot<SnapShotState = any>(
  mapper: StateMapper<SnapShotState>
) {
  return function (): SnapShotState {
    return JSON.parse(JSON.stringify(mapper()));
  };
}

export function createIdAccessfn<
  State,
  DKey extends PropertyKeyArray<State>
>(
  cb: (state: SlicedGlobalState<State, DKey>) => void,
  dataKeys: DKey
): SubscriberUpdateRequirement<State, DKey> {
  const accessKey = generateSudoId();
  return {
    id: accessKey,
    dataSubscriber: {
      subscriber: cb,
      dataKeys,
    },
  };
}

type ComparerFn<T> = (first: T, second: T) => number;

export function sort(list: Array<number>): number[];
export function sort<T>(
  list: Array<T>,
  compareFn: ComparerFn<T>
): T[];

export function sort<T>(
  list: Array<T>,
  comparerFn?: ComparerFn<T>
): T[] | number[] {
  function sortDefault(first: number, second: number) {
    return first - second;
  }
  return comparerFn
    ? [...list].sort(comparerFn)
    : ([...list] as Array<any>).sort(sortDefault);
}

export function descendingOrder(x: number, y: number) {
  return x > y ? -1 : 1;
}

type MappableFn<A, B> = (value: A) => B;

export function pipe<A, B, C>(
  f: MappableFn<A, B>,
  g: MappableFn<B, C>
): MappableFn<A, C>;
export function pipe<A, B, C, D>(
  f: MappableFn<A, B>,
  g: MappableFn<B, C>,
  h: MappableFn<C, D>
): MappableFn<A, D>;
export function pipe<A, B, C, D, E>(
  f: MappableFn<A, B>,
  g: MappableFn<B, C>,
  h: MappableFn<C, D>,
  i: MappableFn<D, E>
): MappableFn<A, E>;
export function pipe<A, B, C, D, E, F>(
  f: MappableFn<A, B>,
  g: MappableFn<B, C>,
  h: MappableFn<C, D>,
  i: MappableFn<D, E>,
  j: MappableFn<E, F>
): MappableFn<A, F>;

export function pipe<
  Fns extends Array<MappableFn<any, any>>
>(...fns: Fns): any {
  return function (...args: any[]) {
    return fns.slice(1).reduce<any>((result, fn) => {
      return fn(result);
    }, fns[0].apply(null, args as any));
  };
}

type PartialAppliedFn<A extends any[], R> = (
  ...value: A
) => R;

type PresetFunction<Args extends any[], R> = (
  args: Args
) => R;
export function partialRight<A, R>(
  fn: PresetFunction<[A], R>,
  a: A
): PartialAppliedFn<[A], R>;
export function partialRight<A, B, R>(
  fn: PresetFunction<[A, B], R>,
  b: B
): PartialAppliedFn<[A, B], R>;
export function partialRight<A, B, C, R>(
  fn: PresetFunction<[A, B, C], R>,
  b: B,
  c: C
): PartialAppliedFn<[A, B, C], R>;
export function partialRight<A, B, C, D, R>(
  fn: PresetFunction<[A, B, C, D], R>,
  b: B,
  c: C,
  d: D
): PartialAppliedFn<[A, B, C, D], R>;

export function partialRight(
  fn: PresetFunction<any, any>,
  ...presets: any[]
): PartialAppliedFn<any[], any> {
  return function (...args) {
    const fullArgs = [...args, ...presets];
    return fn.apply(null, fullArgs as any);
  };
}

function get<O extends Object, K extends keyof O>(
  o: O,
  k: K
): O[K] {
  return o[k];
}

interface Payload<Data = any> {
  data: Data;
}
export function unwrappedData<
  D,
  WrappedData extends Payload<D> = Payload<D>
>(dataWrapper: WrappedData) {
  return get(dataWrapper, 'data');
}

type Predicate<T> = (value: T) => boolean;
export function findItem<T>(
  list: Array<T>,
  predicate: Predicate<T>
) {
  return list.find(predicate);
}

interface FallbackData {
  array: ArrayConstructor;
  object: ObjectConstructor;
  set: SetConstructor;
  map: MapConstructor;
}

type FallbakDataResolver = <D>(
  data: D,
  type: keyof FallbackData
) => NonNullable<D>;

let fallbackDataResolver: FallbakDataResolver;
{
  const fallbackData: FallbackData = {
    array: Array,
    object: Object,
    set: Set,
    map: Map,
  };

  fallbackDataResolver = (data, type) => {
    if (!(type in fallbackData)) {
      throw TypeError(
        "This data isn't supported for fallback data"
      );
    }

    if (!(data instanceof fallbackData[type])) {
      return new (fallbackData[type] as any)();
    }
    return data;
  };
}

export { fallbackDataResolver };

export function mergeArray<
  T extends any[],
  U extends any[]
>(arrayOne: T, arrayTwo: U) {
  return [...arrayOne, ...arrayTwo];
}
