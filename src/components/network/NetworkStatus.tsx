import { FC, useEffect, useRef } from 'react';
import useNetworkStatus, {
  NetworkConnection,
} from '../../hooks/useNetwork';
import style from '../../styles/networkStatus.module.css';
import useForceUpdate from '../../hooks/useForceUpdate';
import { immutableSetOperation } from '../utils/index';

type QueueId = number;

interface StatusMessageOption {
  status: NetworkConnection['status'];
  shouldShowBackOnlineMsg: boolean;
  visibilityStatus: 'hide' | 'unhide';
  timersId: Set<QueueId> | null;
  initialRender: boolean;
}

interface ConnectionDetail {
  message: string;
}

type InternetStatus = 'active' | 'inactive';
type OnlineStatus = {
  [online in `online_${InternetStatus}`]: ConnectionDetail;
};

type OfflineStatus = { offline_inactive: ConnectionDetail };
type BackOnlineStatus = {
  back_online: ConnectionDetail;
};

type ConnectionDetectDetail = OnlineStatus &
  OfflineStatus &
  BackOnlineStatus;

const connectionDetectDetail: ConnectionDetectDetail = {
  online_active: {
    message:
      'you are connected to a network, which is active.',
  },

  online_inactive: {
    message:
      "we noticed you are connected to a network, but the network isn't active.",
  },

  offline_inactive: {
    message:
      'oops!, we noticed your network connection is inactive, search feature only works on active network !!!',
  },
  back_online: {
    message:
      'connection is back, you are check for yoruba word.',
  },
};

const NetworkStatus: FC = () => {
  const { status, isInternectActive } = useNetworkStatus();
  const forceUpdate = useForceUpdate();

  const statusMessageOption = useRef<StatusMessageOption>({
    status,
    shouldShowBackOnlineMsg: false,
    visibilityStatus: 'unhide',
    initialRender: true,
    timersId: null,
  });

  function showConnectionOnStatusChange(ms: number) {
    const { visibilityStatus, timersId } =
      statusMessageOption.current;

    if (visibilityStatus === 'hide') {
      statusMessageOption.current.visibilityStatus =
        'unhide';
    }

    const timerId = window.setTimeout(() => {
      if (
        statusMessageOption.current.visibilityStatus ===
        'unhide'
      ) {
        statusMessageOption.current.visibilityStatus =
          'hide';
      }

      statusMessageOption.current.timersId =
        removeTimerIdFromQueue(timerId, timersId);
      forceUpdate();
    }, ms);
    forceUpdate();

    statusMessageOption.current.timersId =
      addTimerIdToQueue(timerId, timersId);
  }

  const removeTimerIdFromQueue =
    immutableSetOperation<QueueId>(
      (queue, id) => (queue.delete(id), queue)
    );

  const addTimerIdToQueue = immutableSetOperation<QueueId>(
    (queue, id) => queue.add(id)
  );

  const internetStatus =
    status === 'online'
      ? isInternectActive
        ? 'active'
        : 'inactive'
      : 'inactive';

  let currentMessage: ConnectionDetail;
  if (statusMessageOption.current.shouldShowBackOnlineMsg) {
    currentMessage = connectionDetectDetail['back_online'];
  } else {
    console.log(`${status}_${internetStatus}`);
    currentMessage =
      connectionDetectDetail[
        `${status}_${internetStatus}` as keyof (OnlineStatus &
          OfflineStatus)
      ];
  }

  const statusClasses = [
    style.statusBox,
    style[status],
    style[statusMessageOption.current.visibilityStatus],
  ];

  function showBackOnlineMessage() {
    const { current } = statusMessageOption;
    current.shouldShowBackOnlineMsg = true;

    const timerId = window.setTimeout(() => {
      statusMessageOption.current.shouldShowBackOnlineMsg =
        false;

      showConnectionOnStatusChange(5000);
      current.timersId = removeTimerIdFromQueue(
        timerId,
        current.timersId
      );
    }, 2000);

    forceUpdate();

    statusMessageOption.current.timersId =
      addTimerIdToQueue(timerId, current.timersId);
  }

  function unRegisterTimeout() {
    const { current } = statusMessageOption;
    if (current.timersId) {
      return current.timersId.forEach((id) => {
        window.clearTimeout(id);
      });
    }

    current.timersId = null;
  }

  useEffect(() => {
    if (
      statusMessageOption.current.status === 'offline' &&
      status === 'online'
    ) {
      showBackOnlineMessage();
      console.log(isInternectActive);
    } else {
      showConnectionOnStatusChange(5000);
    }

    statusMessageOption.current.status = status;
    return unRegisterTimeout;
  }, [status, isInternectActive]);

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [status]);

  if (statusMessageOption.current.initialRender) {
    statusMessageOption.current.initialRender = false;
  }

  return (
    <div className={statusClasses.join(' ')}>
      {currentMessage.message}
    </div>
  );
};

export default NetworkStatus;
