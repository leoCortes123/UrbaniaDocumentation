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
    ],
};

export default sidebars;
