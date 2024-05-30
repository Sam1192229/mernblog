/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        //Our fall animation keyframes              
        fall: {
            // '0%': { transform: 'translate(-50%,0%) skewX(0deg)' },
            '0%': { transform: 'translate(0%,-10%)', opacity:.5, color:'white' },
            //'50%': { transform: 'translate(5%,0%)', opacity:.5 },
            '100%': { transform: 'translate(0%,10%) ', color:'teal' },

          },
          fall2: {
            // '0%': { transform: 'translate(-50%,0%) skewX(0deg)' },
            '0%': { transform: 'translate(20%, 0%)', },
            //'50%': { transform: 'translate(5%,0%)', opacity:.5 },
            '100%': { transform: 'translate(0%,0%) ', },

          },
        },
    
    animation:{
      fall: 'fall 0.5s ease-in-out forwards',
      fall2: 'fall 1s ease-in-out forwards'

    }
 
  },
  plugins: [],
}
}
