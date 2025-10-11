
import React, { Suspense } from 'react';

const Adult = React.lazy(() => import('./icons/Adult'));
const AdultDress = React.lazy(() => import('./icons/AdultDress'));
const Child = React.lazy(() => import('./icons/Child'));
const ChildDress = React.lazy(() => import('./icons/ChildDress'));
const ShowerWc = React.lazy(() => import('./icons/ShowerWc'));
const Awning = React.lazy(() => import('./icons/Awning'));
const Radiator = React.lazy(() => import('./icons/Radiator'));
const RearCam = React.lazy(() => import('./icons/RearCam'));
const Slideout = React.lazy(() => import('./icons/Slideout'));
const TransmissionAutomatic = React.lazy(() => import('./icons/TransmissionAutomatic'));
const TransmissionManual = React.lazy(() => import('./icons/TransmissionManual'));
const Africa = React.lazy(() => import('./icons/Africa'));
const Australia = React.lazy(() => import('./icons/Australia'));
const Canada = React.lazy(() => import('./icons/Canada'));
const Europe = React.lazy(() => import('./icons/Europe'));
const NewZealand = React.lazy(() => import('./icons/NewZealand'));
const USA = React.lazy(() => import('./icons/USA'));
const SendArrow = React.lazy(() => import('./icons/SendArrow'));
const Microphone = React.lazy(() => import('./icons/Microphone'));
const SpeechBubble = React.lazy(() => import('./icons/SpeechBubble'));

interface ColorIconProps {
  name: string;
  color?: string;
  color1?: string;
  color2?: string;
}

const iconMap: { [key: string]: React.LazyExoticComponent<React.ElementType> } = {
  adult: Adult,
  africa: Africa,
  australia: Australia,
  canada: Canada,
  europe: Europe,
  'new-zealand': NewZealand,
  usa: USA,
  shower_wc: ShowerWc,
  adult_dress: AdultDress,
  child: Child,
  child_dress: ChildDress,
  'send-arrow': SendArrow,
  microphone: Microphone,
  awning: Awning,
  radiator: Radiator,
  rear_cam: RearCam,
  slideout: Slideout,
  automatic: TransmissionAutomatic,
  manual: TransmissionManual,
  'speech-bubble': SpeechBubble,
};

const ColorIcon: React.FC<ColorIconProps> = ({ name, color, color1, color2 }) => {
  const Icon = iconMap[name];

  if (!Icon) {
    console.warn(`Icon with name "${name}" not found.`);
    return null;
  }

  return (
    <div
      className="w-7 h-7"
      style={{
        '--color': color || 'currentColor',
        '--color1': color1 || 'currentColor',
        '--color2': color2 || 'currentColor',
      } as React.CSSProperties}
    >
      <Suspense fallback={<div>...</div>}>
        <Icon />
      </Suspense>
    </div>
  );
};

export default ColorIcon;
