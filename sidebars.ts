import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'API',
      items: [
        'API/AGENTS_GUIDE',
        'API/API_CONTRACT',
        'API/ARCHITECTURE',
        'API/DATABASE_SCHEMA',
        'API/DEVELOPMENT_GUIDE',
        'API/DIRECTORY_STRUCTURE',
        'API/FEATURES_INDEX',
        'API/GOLDEN_RULES',
        {
          type: 'category',
          label: 'features',
          items: [
            'API/features/auth/auth',
            'API/features/auth/endpoints',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'APP',
      items: [
        'APP/AGENTS_GUIDE',
        'APP/ALERT_SYSTEM',
        'APP/API_CONTRACT',
        'APP/ARCHITECTURE',
        'APP/DEMO_SETUP',
        'APP/DEVELOPMENT_GUIDE',
        'APP/DIRECTORY_STRUCTURE',
        'APP/FEATURES_INDEX',
        'APP/GOLDEN_RULES',
        'APP/ROUTING',
        'APP/THEME_SYSTEM',
        {
          type: 'category',
          label: 'features',
          items: [
            'APP/features/home/home',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'WEB',
      items: [
        'WEB/AGENTS_GUIDE',
        'WEB/ALERT_SYSTEM',
        'WEB/API_CONTRACT',
        'WEB/ARCHITECTURE',
        'WEB/DEVELOPMENT_GUIDE',
        'WEB/DIRECTORY_STRUCTURE',
        'WEB/FEATURES_INDEX',
        'WEB/GOLDEN_RULES',
        'WEB/IMPLEMENTATION_REPORT',
        'WEB/ROUTING',
        'WEB/THEME_SYSTEM',
        {
          type: 'category',
          label: 'features',
          items: [
            'WEB/features/auth/auth',
            'WEB/features/home/home',
          ],
        },
      ],
    },
    ],
};

export default sidebars;
