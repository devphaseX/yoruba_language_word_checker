import {
  Component,
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import style from '../../styles/experiment.module.css';

interface FeatureComponent<P> {
  component: FC<P>;
  componentProps: P;
}
interface ExperimentalFeatureProps<P> {
  featureDisabler: () => void;
  message: string;
  renderComponent: FeatureComponent<P>;
}

interface ExperimentalFeature {
  <P>(
    props: PropsWithChildren<ExperimentalFeatureProps<P>>
  ): ReactElement<any, any> | null;
}

const ExperimentalFeature: ExperimentalFeature = ({
  featureDisabler,
  message,
  renderComponent,
}) => {
  const target = useRef(null);
  useEffect(() => {
    const currentTarget = target.current! as HTMLDivElement;

    currentTarget.addEventListener(
      'click',
      featureDisabler,
      true
    );
    return () =>
      currentTarget.removeEventListener(
        'click',
        featureDisabler,
        true
      );
  });
  return (
    <div
      className={style.experimentalFeature}
      onClick={featureDisabler}
      ref={target}
    >
      <div className={style.experimentalLabel}>
        {message}
      </div>
      {renderComponent && (
        <div>
          <Component {...renderComponent.componentProps} />
        </div>
      )}
    </div>
  );
};

export default ExperimentalFeature;
