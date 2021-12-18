// export class MiniStore<State extends object> {
//     private _rootStore: State;
//     private _selectiveSubscribers: _SelectiveSubscribers<State> =
//       new Map();
//     private recentUpdated: Partial<State> | null = null;
//     private _isUpdatePublish: boolean = false;
//     private _priorityCbQueue: _CallPriorityQueue = new Map();

//     constructor(_initial: State) {
//       this._rootStore = _initial;
//       this.subscriber = this.subscriber.bind(this);
//       this.getCurrentStoreState =
//         this.getCurrentStoreState.bind(this);
//       this.updateSubscriber =
//         this.updateSubscriber.bind(this);
//       this.setStoreState = this.setStoreState.bind(this);
//     }

//     getCurrentStoreState() {
//       return { ...this._rootStore };
//     }

//     subscriber<
//       PickedKeys extends Partial<Array<keyof State>>
//     >(
//       sliceState: PickedKeys,
//       cb: (slice: _PickOwn<State, PickedKeys[number]>) => void
//     ) {
//       const _selectedDataSliceKeys = sliceState.filter(
//         (k): k is keyof State =>
//           this._rootStore.hasOwnProperty(k as PropertyKey)
//       );
//       const accessKey = this.prioprityBaseEnqueue(
//         cb,
//         _selectedDataSliceKeys
//       );
//       return this.dequeueCb(accessKey, true);
//     }

//     private prioprityBaseEnqueue(
//       cb: (state: any) => void,
//       subscribeKeys: Array<keyof State>
//     ) {
//       const accessKey = generateSudoId();
//       this._priorityCbQueue.set(accessKey, [
//         cb,
//         [subscribeKeys, null],
//       ]);

//       subscribeKeys.forEach((sbKey) => {
//         const subscribeRegister =
//           this._selectiveSubscribers.get(sbKey);
//         if (subscribeRegister) {
//           subscribeRegister.add(accessKey);
//         } else {
//           this._selectiveSubscribers.set(
//             sbKey,
//             new Set([accessKey])
//           );
//         }
//       });

//       return accessKey;
//     }

//     private dequeueCb(accessKey: string, defer?: boolean) {
//       const lazyDequeue = removeCbFromQueue.bind(
//         null,
//         accessKey,
//         this._priorityCbQueue,
//         this._selectiveSubscribers
//       );
//       if (defer) {
//         return lazyDequeue;
//       }
//       lazyDequeue();
//     }

//     setStoreState(
//       updatedStatePart: Partial<State>,
//       allowEmptyState?: boolean
//     ) {
//       if (
//         Object.keys(updatedStatePart).length ||
//         allowEmptyState
//       ) {
//         this._rootStore = Object.assign(
//           {},
//           this._rootStore,
//           updatedStatePart
//         );
//         this._isUpdatePublish = false;
//         this.recentUpdated = updatedStatePart;
//         this.updateSubscriber();
//       }
//     }

//     updateSubscriber() {
//       if (this.recentUpdated && !this._isUpdatePublish) {
//         const mutateParts = Object.keys(
//           this.recentUpdated
//         ) as Array<keyof State>;

//         this.cookState(
//           mutateParts,
//           (accessId, [subscriber, dataPreload]) => {
//             this._priorityCbQueue.set(accessId as any, [
//               subscriber,
//               dataPreload,
//             ]);
//           }
//         );

//         this.notifySubscribers();
//       }
//     }

//     private cookState(
//       mutateParts: Array<keyof State>,
//       cb: (
//         accessKey: PropertyKey,
//         cookedResult: QueueDataLoader
//       ) => void
//     ) {
//       for (const dataKey of mutateParts) {
//         const activeSubscriberIds =
//           this._selectiveSubscribers.get(
//             dataKey as keyof State
//           );

//         if (activeSubscriberIds) {
//           let cookedData: Partial<State> | null = {};
//           const cacheCheckedBooklet: Set<string> = new Set();

//           for (const accessId of activeSubscriberIds) {
//             let [subscriber, lastestSelfPath] =
//               this._priorityCbQueue.get(accessId)!;
//             [, cookedData] = lastestSelfPath;
//             let dataKeys = lastestSelfPath[0] as Array<
//               keyof State
//             >;

//             if (!cacheCheckedBooklet.has(accessId)) {
//               cookedData = Object.fromEntries(
//                 dataKeys.map((key) => [
//                   key,
//                   this._rootStore[key],
//                 ])
//               ) as State;
//               cacheCheckedBooklet.add(accessId);
//             }
//             cookedData = {
//               ...cookedData,
//               [dataKey]:
//                 this.recentUpdated![dataKey as keyof State],
//             };
//             cb(accessId, [
//               subscriber,
//               [dataKeys, cookedData],
//             ]);
//           }
//         }
//       }
//     }

//     private notifySubscribers() {
//       if (this._isUpdatePublish) return;
//       for (const [
//         accessKey,
//         [activeSubscriber, [dataKeys, patchedState]],
//       ] of this._priorityCbQueue) {
//         if (patchedState) {
//           activeSubscriber(patchedState);
//           this._priorityCbQueue.set(accessKey, [
//             activeSubscriber,
//             [dataKeys, null],
//           ]);
//         }
//       }
//       this._isUpdatePublish = true;
//       this.recentUpdated = null;
//     }
//   }

//   function removeCbFromQueue(
//     accessKey: string,
//     priorityQueue: _CallPriorityQueue,
//     selectiveQueue: _SelectiveSubscribers<any>
//   ) {
//     priorityQueue.delete(accessKey);
//     selectiveQueue.forEach((queueIndexer) => {
//       queueIndexer.delete(accessKey);
//     });
//   }

export {};
