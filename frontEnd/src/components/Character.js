import React from 'react';

const Character = ({ className = '' }) => {
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <img
        src={require('../images/pic1.png')}
        alt="Mocha and Milky Characters"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

export default Character;
