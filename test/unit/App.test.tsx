/**
 * @jest-environment jsdom
 */

import ReactDOM from 'react-dom';
import App from '../../src/App';
import '../../src/phaserGame';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../src/phaserGame', () => jest.fn());

describe('App', () => {
    it('matches the snapshot', () => {
        const app = render(<App />);

        expect(app).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const div = document.createElement('div');
        act(() => {
            ReactDOM.render(<App />, div);
        });
        ReactDOM.unmountComponentAtNode(div);
        expect(div.innerHTML).toBe('');
    });
});
