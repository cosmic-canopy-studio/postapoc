/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../src/App';
import '../../src/phaserGame';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';

jest.mock('../../src/phaserGame', () => jest.fn());

describe('App', () => {
  it('matches the snapshot', () => {
    const app = render(<App />);

    expect(app).toMatchSnapshot();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
