export type _PickOwn<Own, Keys> = Pick<
  Own,
  Extract<Keys, keyof Own>
>;

export type DeepPartial<State> = {
  [K in keyof State]?: State[K] extends object
    ? DeepPartial<State[K]>
    : State[K];
};

export type SlicedGlobalState<State, Keys> = _PickOwn<
  State,
  Keys
>;

export type PropertyKeyArray<State> = Array<keyof State>;

export type PropertyKey<State> = keyof State;

export type UnwrapArray<ListType extends Array<any>> =
  ListType[number];
