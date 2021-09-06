import React from 'react';
import { StylesProvider } from "@material-ui/core/styles";
import ReactDOM from 'react-dom';
import Pad from './Pad';
import './index.css';

ReactDOM.render(
  <StylesProvider injectFirst>
  <Pad /></StylesProvider>,
  document.getElementById('root')
);
