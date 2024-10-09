import React from 'react';
import { usePage, router  } from '@inertiajs/react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'profile',
      title: 'Profile',
      icon: <DashboardIcon />,
    },
    {
      segment: 'page-2',
      title: 'Page 2',
      icon: <TimelineIcon />,
    },
  ];

  const customTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#F9F9FE',
            paper: '#EEEEF9',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#2A4364',
            paper: '#112E4D',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

export default function Authenticated({ header, children, ...props }) {
    const user = usePage().props.auth.user;
    const { window } = props;
    const navigate = (path) => {
        Inertia.visit(path); // Use Inertia to navigate
    };

    const [pathname, setPathname] = React.useState(() => {
        // Retrieve the pathname from localStorage on initial load
        return usePage().url;
    });

  const routerNav = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {router.visit(path);},
    };
  }, [pathname]);
    
    return (

        <AppProvider
            navigation={NAVIGATION}
            router={routerNav}
            theme={customTheme}
        >

    <DashboardLayout>                
        <main>{children}</main>
    </DashboardLayout>
        
    </AppProvider>
        // <div className="min-h-screen bg-gray-100">
        //     <nav className="bg-white border-b border-gray-100">
        //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        //             <div className="flex justify-between h-16">
        //                 <div className="flex">
        //                     <div className="shrink-0 flex items-center">
        //                         <Link href="/">
        //                             <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
        //                         </Link>
        //                     </div>

        //                     <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
        //                         <NavLink href={route('dashboard')} active={route().current('dashboard')}>
        //                             Dashboard
        //                         </NavLink>
        //                     </div>
        //                 </div>

        //                 <div className="hidden sm:flex sm:items-center sm:ms-6">
        //                     <div className="ms-3 relative">
        //                         <Dropdown>
        //                             <Dropdown.Trigger>
        //                                 <span className="inline-flex rounded-md">
        //                                     <button
        //                                         type="button"
        //                                         className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
        //                                     >
        //                                         {user.name}

        //                                         <svg
        //                                             className="ms-2 -me-0.5 h-4 w-4"
        //                                             xmlns="http://www.w3.org/2000/svg"
        //                                             viewBox="0 0 20 20"
        //                                             fill="currentColor"
        //                                         >
        //                                             <path
        //                                                 fillRule="evenodd"
        //                                                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        //                                                 clipRule="evenodd"
        //                                             />
        //                                         </svg>
        //                                     </button>
        //                                 </span>
        //                             </Dropdown.Trigger>

        //                             <Dropdown.Content>
        //                                 <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
        //                                 <Dropdown.Link href={route('logout')} method="post" as="button">
        //                                     Log Out
        //                                 </Dropdown.Link>
        //                             </Dropdown.Content>
        //                         </Dropdown>
        //                     </div>
        //                 </div>

        //                 <div className="-me-2 flex items-center sm:hidden">
        //                     <button
        //                         onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
        //                         className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
        //                     >
        //                         <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        //                             <path
        //                                 className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
        //                                 strokeLinecap="round"
        //                                 strokeLinejoin="round"
        //                                 strokeWidth="2"
        //                                 d="M4 6h16M4 12h16M4 18h16"
        //                             />
        //                             <path
        //                                 className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
        //                                 strokeLinecap="round"
        //                                 strokeLinejoin="round"
        //                                 strokeWidth="2"
        //                                 d="M6 18L18 6M6 6l12 12"
        //                             />
        //                         </svg>
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
        //             <div className="pt-2 pb-3 space-y-1">
        //                 <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
        //                     Dashboard
        //                 </ResponsiveNavLink>
        //             </div>

        //             <div className="pt-4 pb-1 border-t border-gray-200">
        //                 <div className="px-4">
        //                     <div className="font-medium text-base text-gray-800">{user.name}</div>
        //                     <div className="font-medium text-sm text-gray-500">{user.email}</div>
        //                 </div>

        //                 <div className="mt-3 space-y-1">
        //                     <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
        //                     <ResponsiveNavLink method="post" href={route('logout')} as="button">
        //                         Log Out
        //                     </ResponsiveNavLink>
        //                 </div>
        //             </div>
        //         </div>
        //     </nav>

        //     {header && (
        //         <header className="bg-white shadow">
        //             <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
        //         </header>
        //     )}

        //     <main>{children}</main>
        // </div>
    );
}
