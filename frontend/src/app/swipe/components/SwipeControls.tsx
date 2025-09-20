'use client';

interface SwipeControlsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  disabled: boolean;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({ 
  onPass, 
  onLike, 
  onSuperLike, 
  disabled 
}) => {
  return (
    <div className="swipe-controls">
      <button 
        className="control-button pass" 
        onClick={onPass}
        disabled={disabled}
        title="Pass"
      >
        ✕
      </button>
      
      <button 
        className="control-button super-like" 
        onClick={onSuperLike}
        disabled={disabled}
        title="Super Like"
      >
        ⭐
      </button>
      
      <button 
        className="control-button like" 
        onClick={onLike}
        disabled={disabled}
        title="Like"
      >
        ♥
      </button>
    </div>
  );
};

export default SwipeControls;