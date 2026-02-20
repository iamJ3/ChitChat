import React from 'react'

const FontStyle = () => {
  return (
    <div>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
            * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
            input:-webkit-autofill,
            input:-webkit-autofill:focus {
              -webkit-text-fill-color: #F1F5F9 !important;
              -webkit-box-shadow: 0 0 0 40px #263346 inset !important;
            }
            @keyframes floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
            @keyframes floatB { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
            @keyframes floatC { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
            @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes spinReverse { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
            @keyframes pulseGlow { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.06)} }
            @keyframes slideInLeft  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
            @keyframes slideInRight { from{opacity:0;transform:translateX(16px)}  to{opacity:1;transform:translateX(0)} }
            .bubble-l { animation: slideInLeft  0.5s ease forwards; }
            .bubble-r { animation: slideInRight 0.5s ease forwards; }
            .float-a  { animation: floatA 5s ease-in-out infinite; }
            .float-b  { animation: floatB 7s ease-in-out infinite 1s; }
            .float-c  { animation: floatC 6s ease-in-out infinite 2s; }
            .spin-slow    { animation: spinSlow    22s linear infinite; }
            .spin-reverse { animation: spinReverse 18s linear infinite; }
            .pulse-glow   { animation: pulseGlow 3.5s ease-in-out infinite; }
          `}</style>
    </div>
  )
}

export default FontStyle