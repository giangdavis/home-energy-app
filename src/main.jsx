import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from "@chakra-ui/provider"
import './index.css';
import App from './App.jsx';

console.log(ChakraProvider);

// 2. build your theme and config
const theme = {
  // ... your system-ui theme
  config: {
    useSystemColorMode: false, // or true
    initialColorMode: "light", // or "dark"
    cssVarPrefix: "chakra", // any string
  }
}

createRoot(document.getElementById('root')).render(
    <ChakraProvider theme = {theme}>
      <App />
    </ChakraProvider>
);