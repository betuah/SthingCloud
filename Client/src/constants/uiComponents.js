// optional `menuName` overrides default name for menu item if it's defined
// hideInMenu hides item in menu
// hideInOverview hides item in Overview page

export const CARDS = [
  {
    name: 'Card - Cards',
    menuName: 'Cards',
    desc: 'A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.',
    path: '/app/card/cards'
  },
  {
    name: 'Card - Image Cards',
    menuName: 'Image Cards',
    desc: 'Card component for displaying image and related content',
    path: '/app/card/image-cards'
  },
  {
    name: 'Card - Form Cards',
    menuName: 'Form Cards',
    desc: 'Card component for displaying form content',
    path: '/app/card/form-cards'
  },
  {
    name: 'Card - Blog Cards (Grid)',
    menuName: 'Blog Cards (Grid)',
    desc: 'Card component for displaying blog content',
    path: '/app/card/blog-cards-grid'
  },
  {
    name: 'Card - Blog Cards (List)',
    menuName: 'Blog Cards (List)',
    desc: 'Card component for displaying blog content',
    path: '/app/card/blog-cards-list'
  },
  {
    name: 'Card - Number Cards',
    menuName: 'Number Cards',
    desc: 'Card component for displaying number and related content',
    path: '/app/card/number-cards'
  },
  {
    name: 'Card - Portfolio Cards',
    menuName: 'Portfolio Cards',
    desc: 'Card component for displaying profile content',
    path: '/app/card/portfolio-cards'
  },
  {
    name: 'Card - Icon Cards',
    menuName: 'Icon Cards',
    desc: 'Card component for displaying Icon and related content',
    path: '/app/card/icon-cards'
  },
  {
    name: 'Card - Product Cards (Grid)',
    menuName: 'Product Cards (Grid)',
    desc: 'Card component for displaying products',
    path: '/app/card/product-cards-grid'
  },
  {
    name: 'Card - Product Cards (List)',
    menuName: 'Product Cards (List)',
    desc: 'Card component for displaying products',
    path: '/app/card/product-cards-list'
  },
  {
    name: 'Card - Profile Cards',
    menuName: 'Profile Cards',
    desc: 'Card component for displaying portfolio',
    path: '/app/card/profile-cards'
  },
]

export const USER = [
  {
    name: 'Profile',
    path: '/app/user/profile'
  }, 
  {
    name: 'Settings',
    path: '/app/user/settings'
  },
  {
    name: 'Account Upgrade',
    path: '/app/user/upgrade'
  }
]

export const RESOURCES = [
  {
    name: 'Shop',
    path: '/resource/shop'
  },
  {
    name: 'Documentation',
    path: 'https://seamolec.org'
  },
  {
    name: 'Community',
    path: '/resource/community'
  },
  {
    name: 'Github Libraries',
    path: '/resource/git'
  }
]

// for UI Overview page
const COMPONENTS = [
  ...CARDS,
  ...RESOURCES
];

export default COMPONENTS;

