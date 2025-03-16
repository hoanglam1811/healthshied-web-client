// // import { Link } from "react-router-dom";
// // import navigation from "../../constants/multilingual/navigation";
// // import RouteNames from "../../constants/routeNames";
// // import DropdownNotification from "@/router/adminRoutes/Dashboard/components/Header/DropdownNotification";
// // import useMediaQuery from "@/hooks/useMediaQuery";
// // import { useState } from "react";

// // type NavItem = {
// //   text: string;
// //   to: string;
// // };
// // //User Guide
// // const navItems: NavItem[] = [
// //   {
// //     text: navigation.ABOUT_US,
// //     to: RouteNames.ABOUT_US,
// //   },
// //   {
// //     text: navigation.SCHOLARSHIP_PROGRAM,
// //     to: RouteNames.SCHOLARSHIP_PROGRAM,
// //   },
// //   {
// //     text: navigation.SERVICES,
// //     to: RouteNames.SERVICES,
// //   },
// //   {
// //     text: navigation.CHAT,
// //     to: RouteNames.CHAT,
// //   },
// //   {
// //     text: navigation.USER_GUIDE,
// //     to: RouteNames.USER_GUIDE,
// //   },
// // ];

// // const Navigation = () => {
// //   const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
// //   const flexBetween = "flex items-center justify-between";
// //   const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
// //   return (
// //     <nav>
// //       <div className="flex justify-between mr-10">
// //         <ul
// //           className=" text-xl font-normal flex justify-around gap-10"
// //           style={{ color: "#fff" }}
// //         >
// //           {navItems.map((item) => (
// //             <li key={item.text} className="group/nav">
// //               <Link className="text-xl" to={item.to}>
// //                 {item.text}
// //               </Link>
// //               <div className="h-[2px] bg-[#1eb2a6] scale-x-0 group-hover/nav:scale-x-100 transition" />
// //             </li>
// //           ))}
// //           <DropdownNotification />
// //         </ul>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navigation;

// import { Link } from "react-router-dom";
// import navigation from "../../constants/multilingual/navigation";
// import RouteNames from "../../constants/routeNames";
// import { Fragment, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import useMediaQuery from "../../hooks/useMediaQuery";

// type NavItem = {
//   text: string;
//   to: string;
// };

// //User Guide
// const navItems: NavItem[] = [
//   {
//     text: navigation.PRODUCTS,
//     to: RouteNames.PRODUCTS,
//   },
//   {
//     text: navigation.BRANDS,
//     to: RouteNames.BRANDS,
//   },
//   {
//     text: navigation.SKIN_QUIZ,
//     to: RouteNames.SKIN_QUIZ,
//   },
//   {
//     text: navigation.BEAUTY_BLOG,
//     to: RouteNames.BEAUTY_BLOG,
//   },
// ];

// const Navigation = () => {
//   const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
//   const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
//   const user = useSelector((state: RootState) => state.token.user);

//   return (
//     <nav>
//       <div>
//         {isAboveMediumScreens ? (
//           <div className="flex items-center justify-between w-full">
//             <ul
//               className=" text-xl font-normal flex items-center justify-between gap-10"
//               style={{ color: "#fff" }}
//             >
//             </ul>
//           </div>
//         ) : (
//           <div className="flex items-center justify-between gap-2">
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.5 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               variants={{
//                 hidden: { opacity: 0, x: 50 },
//                 visible: { opacity: 1, x: 0 },
//               }}
//             >
//               <button
//                 className="rounded-full bg-blue-500 p-2"
//                 onClick={() => setIsMenuToggled(!isMenuToggled)}
//               >
//                 <Bars3Icon className="h-6 w-6 text-white" />
//               </button>
//             </motion.div>
//           </div>
//         )}
//       </div>
//       {!isAboveMediumScreens && isMenuToggled && (
//         <div className="fixed right-0 bottom-0 z-40 h-full w-[50%] bg-blue-400 shadow drop-shadow-xl">
//           {/* CLOSE ICON */}
//           <div className="flex justify-end p-12">
//             <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
//               <XMarkIcon className="h-6 w-6 text-gray-500" />
//             </button>
//           </div>

//           {/* MENU ITEMS */}
//           <div className=" mr-10">
//             <ul
//               className=" lg:text-2xl text-xl flex justify-around flex-col gap-10"
//               style={{ color: "#fff" }}
//             >
//               {navItems.map((item) => (
//                 <li key={item.text} className="group/nav">
//                   <Link className="text-xl" to={item.to}>
//                     {item.text}
//                   </Link>
//                   <div className="h-[2px] bg-[#1eb2a6] scale-x-0 group-hover/nav:scale-x-100 transition" />
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navigation;
