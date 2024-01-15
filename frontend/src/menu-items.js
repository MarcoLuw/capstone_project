const menuItems = {
    items: [
        {
            id: 'Home',
            title: 'Home',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'Create',
                    title: 'Create',
                    type: 'item',
                    url: '/create',
                    icon: 'feather icon-plus-circle'
                },
                {
                    id: 'Browse',
                    title: 'Browse',
                    type: 'item',
                    url: '/browse',
                    icon: 'feather icon-folder'
                }
            ]
        },
        {
            id: 'Report',
            title: 'Report',
            type: 'group',
            icon: 'icon-charts',
            children: [
                {
                    id: 'Dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/dashboard',
                    icon: 'feather icon-bar-chart'
                },
                {
                    id: 'Forecast',
                    title: 'Forecast',
                    type: 'item',
                    url: '/forecast',
                    icon: 'feather icon-trending-up'
                },
                {
                    id: 'Chatbot',
                    title: 'Chatbot',
                    type: 'item',
                    url: '/chat-bot',
                    classes: 'nav-item',
                    icon: 'feather icon-message-square'
                }
            ]
        },
        {
            id: 'Support',
            title: 'Support',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'Instruction',
                    title: 'Instruction',
                    type: 'item',
                    url: '/basic/typography',
                    icon: 'feather icon-book'
                },
                {
                    id: 'FAQ',
                    title: 'FAQ',
                    type: 'item',
                    url: '/basic/tabs-pills',
                    icon: 'feather icon-help-circle'
                }
            ]
        },
        {
            id: 'Account',
            title: 'Account',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'signin-2',
                    title: 'Sign out',
                    type: 'item',
                    url: '/auth/signin-2',
                    target: true,
                    breadcrumbs: false,
                    icon: 'feather icon-log-out'
                }
            ]
        }
        // {
        //     id: 'ui-element',
        //     title: 'UI ELEMENT',
        //     type: 'group',
        //     icon: 'icon-ui',
        //     children: [
        //         {
        //             id: 'basic',
        //             title: 'Components',
        //             type: 'collapse',
        //             icon: 'feather icon-box',
        //             children: [
        //                 {
        //                     id: 'button',
        //                     title: 'Button',
        //                     type: 'item',
        //                     url: '/basic/button'
        //                 },
        //                 {
        //                     id: 'badges',
        //                     title: 'Badges',
        //                     type: 'item',
        //                     url: '/basic/badges'
        //                 },
        //                 {
        //                     id: 'breadcrumb',
        //                     title: 'Breadcrumb',
        //                     type: 'item',
        //                     url: '/basic/breadcrumb'
        //                 },
        //                 {
        //                     id: 'collapse',
        //                     title: 'Collapse',
        //                     type: 'item',
        //                     url: '/basic/collapse'
        //                 },
        //                 {
        //                     id: 'tabs-pills',
        //                     title: 'Tabs & Pills',
        //                     type: 'item',
        //                     url: '/basic/tabs-pills'
        //                 },
        //                 {
        //                     id: 'typography',
        //                     title: 'Typography',
        //                     type: 'item',
        //                     url: '/basic/typography'
        //                 },
        //                 {
        //                     id: 'forms',
        //                     title: 'Forms',
        //                     type: 'item',
        //                     url: '/forms/form-basic'
        
        //                 },
        //                 {
        //                     id: 'maps',
        //                     title: 'Maps',
        //                     type: 'item',
        //                     url: '/maps/google-map'
                           
        //                 },
        //                 {
        //                     id: 'bootstrap',
        //                     title: 'Bootstrap Table',
        //                     type: 'item',
        //                     url: '/tables/bootstrap'
                    
        //                 },
        //                 {
        //                     id: 'chat-bot',
        //                     title: 'Chatbot',
        //                     type: 'item',
        //                     url: '/chat-bot',
        //                     classes: 'nav-item'
                           
        //                 },
        //                 {
        //                     id: 'signup-2',
        //                     title: 'Sign UP (template)',
        //                     type: 'item',
        //                     url: '/auth/signup-2',
        //                     target: true,
        //                     breadcrumbs: false
        //                 },
        //                 {
        //                     id: 'signin-2',
        //                     title: 'Sign IN (template)',
        //                     type: 'item',
        //                     url: '/auth/signin-2',
        //                     target: true,
        //                     breadcrumbs: false
        //                 }
        //             ]
        //         }
        //     ]
        // }
    ]
};

export default menuItems;
