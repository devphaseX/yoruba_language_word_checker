import { LicensedDataSubscriber } from '../../store/type';
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
        immutableState[key] = partialDeepStateUpdate(
          target[key],
          source[key] as StateReplacement<
            State[keyof State]
          >
        );
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
      return !new RegExp(`^${path}$`).test(curPath);
    } else {
      return !path.startsWith(curPath);
    }
  }

  return allowedPath.some((path) =>
    isPathEligibleForRevalidate(curPath, path)
  );
}

export function take<
  State,
  Parts extends PropertyKeyArray<State>
>(parts: Parts, state: State): Pick<State, Parts[number]> {
  const pickedState = {} as any;
  parts.forEach((key) => {
    pickedState[key] = state[key];
  });

  return pickedState;
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
  return take(dKey, state);
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
): LicensedDataSubscriber<State, DKey> {
  const accessKey = generateSudoId();
  return {
    id: accessKey,
    dataSubscriber: {
      subscriber: cb,
      dataKeys,
    },
  };
}

export function sortByAscending(list: Array<number>) {
  return [...list].sort((first, second) => first - second);
}
