import { FC, useEffect, useRef } from 'react';
import useNetworkStatus, {
  NetworkConnection,
} from '../../hooks/useNetwork';
import style from '../../styles/networkStatus.module.css';
import useForceUpdate from '../../hooks/useForceUpdate';
import { immutableSetOperation } from '../utils/index';

interface NetworkStatusProps {
  onlineStatusMessage: string;
  offlineStatusMessage: string;
}

type QueueId = number;

interface StatusMessageOption {
  status: NetworkConnection['status'];
  shouldShowBackOnlineMsg: boolean;
  visibilityStatus: 'hide' | 'unhide';
  timersId: Set<QueueId> | null;
  initialRender: boolean;
}

const NetworkStatus: FC<NetworkStatusProps> = ({
  onlineStatusMessage,
  offlineStatusMessage,
}) => {
  const { status } = useNetworkStatus();
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

  let currentMessage =
    status === 'online'
      ? onlineStatusMessage
      : offlineStatusMessage;
  let backOnlineMessage = `connection is back, you are check for yoruba word.`;

  const statusClasses = [
    style.statusBox,
    style[status],
    style[statusMessageOption.current.visibilityStatus],
  ];

  //set the back online message when user connection transist from offline to online
  currentMessage = statusMessageOption.current
    .shouldShowBackOnlineMsg
    ? backOnlineMessage
    : currentMessage;

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
    } else {
      showConnectionOnStatusChange(5000);
    }

    statusMessageOption.current.status = status;
    return unRegisterTimeout;
  }, [status]);

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
      {currentMessage}
    </div>
  );
};

export default NetworkStatus;
