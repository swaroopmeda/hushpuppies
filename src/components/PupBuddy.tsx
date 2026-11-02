import { Art } from '@/components/Art';
import { pupBow, pupPeek, pupSit, pupSnug } from '@/data/art';

const POSES = { sit: pupSit, peek: pupPeek, bow: pupBow, snug: pupSnug };

type PupBuddyProps = {
  pose?: keyof typeof POSES;
  facing?: 'left' | 'right';
  className?: string;
  label?: string;
  // A stop is a place on the page the roaming pup walks to.
  stop?: boolean;
  act?: string;
  behind?: boolean;
  // Stays visible on phones, where Teddy peeks in from the edges instead of walking.
  lane?: boolean;
};

// Teddy the mascot, either standing on his own or marking a stop for PupJourney.
export function PupBuddy({ pose = 'sit', facing = 'right', className = '', label, stop, act, behind, lane }: PupBuddyProps) {
  const buddy = (
    <div className={`pup-buddy ${stop ? '' : className}`} data-facing={facing}>
      <Art svg={POSES[pose]} label={label ?? 'Teddy, the TeddyPups puppy'} />
      <span aria-hidden="true" className="pup-bubble" data-show="false" />
    </div>
  );
  if (!stop) return buddy;
  return (
    <div
      data-pup-stop="true"
      data-pose={pose}
      data-facing={facing}
      data-act={act}
      data-behind={behind || undefined}
      data-lane={lane || undefined}
      className={`pup-stop ${className}`}
    >
      {buddy}
    </div>
  );
}
