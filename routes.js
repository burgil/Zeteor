const routes = [
    {
        main: true,
        title: 'Zeteor 👽 - Discord Bot Interface',
        address: '/',
        file: 'index',
        components_bottom: [
            'modal-popup',
        ],
    },
    {
        main: true,
        title: 'Zeteor 👽 - Persona Creation',
        address: '/personas',
        file: 'personas',
    },
    {
        main: true,
        title: 'Zeteor 👽 - Settings',
        address: '/settings',
        file: 'settings',
    },
    {
        title: 'Zeteor 👽 - Image Generation',
        address: '/ai',
        components_top: [
            'notifications',
            'achievements',
            '<main>',
            'sidebar',
            '<section class="content">',
            '<div class="left-content">',
        ],
        file: 'ai',
        components_bottom: [
            '</div>',
            '<div class="right-content">',
            '<h2>hi there, come back later...</h2>',
            '</div>',
            '</section>',
            '</main>',
        ],
        custom_header: 'main-header',
        custom_footer: 'main-footer',
    },
];

const main_top_components = [
    'notifications',
    'achievements',
    '<main>',
    'sidebar',
    '<section class="content">',
    '<div class="left-content">',
];

const main_bottom_components = [
    '</div>',
    '<div class="right-content">',
    'right-content',
    '</div>',
    '</section>',
    '</main>',
];

for (const route of routes) {
    if (route.main) {
        if (route.components_top) {
            route.components_top = [
                ...main_top_components,
                ...route.components_top,
            ];
        } else {
            route.components_top = main_top_components;
        }
        if (route.components_bottom) {
            route.components_bottom = [
                ...main_bottom_components,
                ...route.components_bottom,
            ];
        } else {
            route.components_bottom = main_bottom_components;
        }
        route.custom_header = 'main-header';
        route.custom_footer = 'main-footer';
    }
}

const fs = require('fs');
const path = require('path');
const components = {};

function filePath(file) {
    return path.join(__dirname + '/private/' + file + '.html');
}

function templatePath(template) {
    return path.join(__dirname + '/private-templates/' + template + '.html');
}

function componentPath(component) {
    return path.join(__dirname + '/private-components/' + component + '.html');
}

function load(file_path) {
    return fs.readFileSync(file_path, 'utf8');
}

function loadComponent(component) {
    if (!components[component]) {
        if (component.includes('<') || component.includes('/') || component.includes('>')) {
            components[component] = component;
            return;
        }
        const componentFile = componentPath(component);
        if (!fs.existsSync(componentFile)) {
            console.warn('Component (Bottom) File Not Found!', componentFile);
            return;
        }
        components[component] = load(componentFile);
    }
}

for (const route of routes) {
    if (route.components_top) {
        for (const component of route.components_top) {
            loadComponent(component);
        }
    }
    if (route.components_bottom) {
        for (const component of route.components_bottom) {
            loadComponent(component);
        }
    }
    if (route.custom_header) loadComponent(route.custom_header);
    if (route.custom_footer) loadComponent(route.custom_footer);
}
const header = load(templatePath('header'));
const footer = load(templatePath('footer'));
const page_open = `</head>
<body>`;
const page_close = `</body>
</html>`
const pages = {};

for (const route of routes) {
    let routeHTML = '';
    const routeFile = filePath(route.file);
    if (!fs.existsSync(routeFile)) {
        console.warn('Route File Not Found!', routeFile);
        continue;
    }
    // Header
    routeHTML += header;
    if (route.title) routeHTML += `<title>${route.title}</title>`;
    const headerFilePath = filePath(route.file + '-header');
    if (fs.existsSync(headerFilePath)) {
        const headerFile = load(headerFilePath);
        routeHTML += headerFile;
    }
    if (route.custom_header) routeHTML += components[route.custom_header];
    routeHTML += page_open;
    // Components Top:
    if (route.components_top) {
        for (const component of route.components_top) {
            routeHTML += components[component];
        }
    }
    // Body:
    routeHTML += load(routeFile);
    // Components Bottom:
    if (route.components_bottom) {
        for (const component of route.components_bottom) {
            routeHTML += components[component];
        }
    }
    // Footer:
    if (route.custom_footer) routeHTML += components[route.custom_footer];
    const footerFilePath = filePath(route.file + '-footer');
    if (fs.existsSync(footerFilePath)) {
        const footerFile = load(footerFilePath);
        routeHTML += footerFile;
    }
    routeHTML += footer;
    routeHTML += page_close;
    pages[route.address] = routeHTML;
}

function setupFrontendRoutes(app) {
    for (const page in pages) {
        const pageHTML = pages[page];
        app.get(page, (req, res) => {
            res.send(pageHTML);
        });
    }
}

module.exports = {
    setupFrontendRoutes
}