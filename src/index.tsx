import 'react-tippy/dist/tippy.css';
import './datetime';
import './i18n';
import './index.css';

import { render } from 'react-dom';

import PagesRouter from './pages-router';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

(function () {
  render(<PagesRouter />, document.getElementById('root'));
  serviceWorkerRegistration.unregister();
})();
