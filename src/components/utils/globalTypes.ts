export type _PickOwn<Own, Keys> = Pick<
  Own,
  Extract<Keys, keyof Own>
>;

export type DeepPartial<State> = {
  [K in keyof State]?: DeepPartial<State[K]>;
};

export type SlicedGlobalState<State, Keys> = _PickOwn<
  State,
  Keys
>;
