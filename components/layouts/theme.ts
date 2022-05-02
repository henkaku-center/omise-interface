import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        background: `
          linear-gradient(123.35deg, #EBF3D0 0%, rgba(235, 243, 208, 0) 18.4%),
          radial-gradient(29.9% 70.94% at 44.25% 86.96%, #fafafa 0%, rgba(220, 141, 220, 0) 100%),
          radial-gradient(33.83% 53.57% at 35.87% 100%, #c177c1 0%, rgba(220, 141, 220, 0) 100%),
          radial-gradient(42.66% 49.72% at 45.56% 44.65%, #fafafa 0%, rgba(194, 166, 241, 0) 100%),
          linear-gradient(134.59deg, #ffffff 20.63%, rgba(205, 249, 232, 0) 47.84%),
          linear-gradient(216.44deg, rgba(192, 169, 240, 0) -16.52%, #C0A9F0 -1.04%,
           rgba(192, 169, 240, 0) 16.99%),
           linear-gradient(128.53deg, rgba(192, 169, 240, 0) 28.63%, #C0A9F0 38.5%,
          rgba(192, 169, 240, 0) 50.26%),radial-gradient(40.75% 97.37% at 90.75% 40.15%, #FFFDB1 0%,
             #FEE4BF 34.46%, #e7c5d2 69.5%, rgba(255, 129, 38, 0) 100%),#d7c8f0
        `,
      },
      html: {
        height: '100%'
      }
    }
  }
})
