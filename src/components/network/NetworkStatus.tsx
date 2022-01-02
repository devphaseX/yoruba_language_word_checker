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
  });

  function showConnectionOnStatusChange() {
    if (status !== statusMessageOption.current.status) {
      statusMessageOption.current.hideConnectionStatusMsg =
        'unhide';
      checkLabelVisibility(5000);
      statusMessageOption.current.status = status;
    }
  }

  function checkLabelVisibility(ms: number) {
    if (status !== statusMessageOption.current.status) {
      const timerId = window.setTimeout(() => {
        statusMessageOption.current.hideConnectionStatusMsg =
          'hide';
        forceUpdate();
      }, ms);
      queueTimerId(timerId);
    }
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

  showConnectionOnStatusChange();
  const statusClasses = [
    style[status],
    statusMessageOption.current.hideConnectionStatusMsg,
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
    forceUpdate();

    const timerId = window.setTimeout(() => {
      statusMessageOption.current.shouldShowBackOnlineMsg =
        false;

      markTimerAsComplete(timerId);
    }, 5000);

    queueTimerId(timerId);
  }

  function unRegisterTimeout() {
    const { timersId } = statusMessageOption.current;
    if (timersId) {
      return timersId.forEach((id) => {
        window.clearTimeout(id);
      });
    }
  }

  useEffect(() => {
    if (statusMessageOption.current.status !== status) {
      if (
        statusMessageOption.current.status === 'offline'
      ) {
        showBackOnlineMessage();
      }
    }
    return unRegisterTimeout;
  }, [status]);

  return (
    <div className={statusClasses.join(' ')}>
      {currentMessage}
    </div>
  );
};

export default NetworkStatus;
