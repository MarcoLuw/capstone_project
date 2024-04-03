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
                    id: 'Datasource',
                    title: 'Data Sources',
                    type: 'item',
                    url: '/datasource',
                    icon: 'feather icon-box'
                },
                // {
                //     id: 'Chatbot',
                //     title: 'Chatbot',
                //     type: 'item',
                //     url: '/chat-bot',
                //     classes: 'nav-item',
                //     icon: 'feather icon-message-square'
                // }
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
        }
    ]
};

export default menuItems;
