import { FC, useEffect, useRef } from 'react';
import useNetworkStatus, {
  NetworkConnection,
} from '../../hooks/useNetwork';
import style from '../../styles/networkStatus.module.css';
import useForceUpdate from '../../hooks/useForceUpdate';

interface NetworkStatusProps {
  onlineStatusMessage: string;
  offlineStatusMessage: string;
}

interface StatusMessageOption {
  status: NetworkConnection['status'];
  shouldShowBackOnlineMsg: boolean;
  hideConnectionStatusMsg: 'hide' | 'unhide';
  timersId?: Set<number>;
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
    hideConnectionStatusMsg: 'unhide',
    initialRender: true,
  });

  function showConnectionOnStatusChange(ms: number) {
    const { hideConnectionStatusMsg } =
      statusMessageOption.current;

    if (hideConnectionStatusMsg === 'hide') {
      statusMessageOption.current.hideConnectionStatusMsg =
        'unhide';
    }
    const timerId = window.setTimeout(() => {
      if (
        statusMessageOption.current
          .hideConnectionStatusMsg === 'unhide'
      ) {
        statusMessageOption.current.hideConnectionStatusMsg =
          'hide';
      }

      markTimerAsComplete(timerId);
      forceUpdate();
    }, ms);
    forceUpdate();
    queueTimerId(timerId);
  }

  function queueTimerId(id: number) {
    const timersId = statusMessageOption.current.timersId;
    return void (timersId
      ? timersId.add(id)
      : (statusMessageOption.current.timersId = new Set([
          id,
        ])));
  }

  let currentMessage =
    status === 'online'
      ? onlineStatusMessage
      : offlineStatusMessage;
  let backOnlineMessage = `connection is back, you are check for yoruba word.`;

  const statusClasses = [
    style.statusBox,
    style[status],
    style[
      statusMessageOption.current.hideConnectionStatusMsg
    ],
  ];

  //set the back online message when user connection transist from offline to online
  currentMessage = statusMessageOption.current
    .shouldShowBackOnlineMsg
    ? backOnlineMessage
    : currentMessage;

  function markTimerAsComplete(timerId: number) {
    const timerIds = statusMessageOption.current.timersId;
    if (timerIds) {
      return timerIds.delete(timerId);
    }
  }

  function showBackOnlineMessage() {
    statusMessageOption.current.shouldShowBackOnlineMsg =
      true;

    const timerId = window.setTimeout(() => {
      statusMessageOption.current.shouldShowBackOnlineMsg =
        false;

      showConnectionOnStatusChange(5000);
      markTimerAsComplete(timerId);
    }, 2000);

    forceUpdate();

    queueTimerId(timerId);
  }

  function unRegisterTimeout() {
    const { timersId } = statusMessageOption.current;
    if (timersId) {
      return timersId.forEach((id) => {
        window.clearTimeout(id);
        timersId.delete(id);
      });
    }
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
