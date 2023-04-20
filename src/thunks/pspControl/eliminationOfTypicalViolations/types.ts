export type Getters<Type, Prefix extends string> = {
  [Property in keyof Type as `${Prefix}_${string & Property}`]: Type[Property];
};
