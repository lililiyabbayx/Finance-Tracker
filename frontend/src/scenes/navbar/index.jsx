// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   useTheme,
// } from '@mui/material';
// import {
//   HomeOutlined,
//   AnalyticsOutlined,
//   MonetizationOnOutlined,
//   ReceiptLongOutlined,
//   AutorenewOutlined,
//   InsightsOutlined,
//   FlightTakeoffOutlined,
//   WidgetsOutlined,
// } from '@mui/icons-material';

// const navItems = [
//   {
//     text: "Home",
//     icon: <HomeOutlined />,
//     path: "/business-dashboard"
//   },
//   {
//     text: "Analytics",
//     icon: <AnalyticsOutlined />,
//     path: "/business-dashboard/analytics"
//   },
//   {
//     text: "Revenue & Expense",
//     icon: <MonetizationOnOutlined />,
//     path: "/business-dashboard/revenue-expense"
//   },
//   {
//     text: "Transactions",
//     icon: <ReceiptLongOutlined />,
//     path: "/business-dashboard/transactions"
//   },
//   {
//     text: "Recurrent Entries",
//     icon: <AutorenewOutlined />,
//     path: "/business-dashboard/recurrent-entries"
//   },
//   {
//     text: "Financial Insights",
//     icon: <InsightsOutlined />,
//     path: "/business-dashboard/financial-insights"
//   },
//   {
//     text: "Travel Expenses",
//     icon: <FlightTakeoffOutlined />,
//     path: "/business-dashboard/travel-expenses"
//   },
//   {
//     text: "Financial Widgets",
//     icon: <WidgetsOutlined />,
//     path: "/business-dashboard/financial-widgets"
//   }
// ];

// const Navbar = () => {
//   const theme = useTheme();
//   const location = useLocation();

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: 240,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: 240,
//           boxSizing: 'border-box',
//           backgroundColor: theme.palette.background.alt,
//           borderRight: 'none',
//         },
//       }}
//     >
//       <Box sx={{ overflow: 'auto', mt: "64px" }}>
//         <List>
//           {navItems.map(({ text, icon, path }) => {
//             const isActive = location.pathname === path;
            
//             return (
//               <ListItem
//                 key={text}
//                 component={Link}
//                 to={path}
//                 sx={{
//                   backgroundColor: isActive ? theme.palette.secondary[300] : "transparent",
//                   color: isActive ? theme.palette.primary[600] : theme.palette.secondary[100],
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     color: isActive ? theme.palette.primary[600] : theme.palette.secondary[200],
//                   }}
//                 >
//                   {icon}
//                 </ListItemIcon>
//                 <ListItemText>
//                   <Typography variant="h6" sx={{ fontSize: "1rem" }}>
//                     {text}
//                   </Typography>
//                 </ListItemText>
//               </ListItem>
//             );
//           })}
//         </List>
//       </Box>
//     </Drawer>
//   );
// };

// export default Navbar;
