// this file is used only for standalone simulation and is not part of the module-federation build
import React from 'react';
import { createRoot } from 'react-dom/client';

window.adapterName = 'weather-warnings';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <div style={{ padding: 16 }}>
                weather-warnings admin component – build target only. Use it inside the ioBroker admin via the
                jsonConfig <code>custom</code> field.
            </div>
        </React.StrictMode>,
    );
}
