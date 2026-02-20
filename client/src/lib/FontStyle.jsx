import React from 'react'

const FontStyle = () => {
  return (
     <style>{`
    html, body, #root {
      height: 100%;
      overflow: hidden;
    }
    .no-scroll::-webkit-scrollbar { display: none; }
    .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes pulseglow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.06); }
    }
    @keyframes spinslow    { to { transform: translate(-50%,-50%) rotate(360deg);  } }
    @keyframes spinreverse { to { transform: translate(-50%,-50%) rotate(-360deg); } }
    @keyframes floata { 0%,100%{transform:translateY(0)   rotate(20deg)}  50%{transform:translateY(-12px) rotate(22deg)}}
    @keyframes floatb { 0%,100%{transform:translateY(0)}                  50%{transform:translateY(-8px)}}
    @keyframes floatc { 0%,100%{transform:translateY(0)   rotate(-15deg)} 50%{transform:translateY(-10px) rotate(-17deg)}}
    .pulse-glow   { animation: pulseglow  4s ease-in-out infinite; }
    .spin-slow    { animation: spinslow   22s linear    infinite; }
    .spin-reverse { animation: spinreverse 17s linear    infinite; }
    .float-a      { animation: floata     5s ease-in-out infinite; }
    .float-b      { animation: floatb     4s ease-in-out infinite; }
    .float-c      { animation: floatc     6s ease-in-out infinite; }
  `}</style>
  )
}

export default FontStyle