// import { useState, useEffect } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import Sidenav from "./Sidenav";
// import { RootState } from "../../store/store";
// import Footer from "../footer";
// import { useSelector } from "react-redux";


// const { Header: AntHeader, Content, Sider } = Layout;

// function Main({ children }:any) {
//   const [visible, setVisible] = useState(false);
//   const [placement, setPlacement] = useState("right");
//   const [sidenavColor, setSidenavColor] = useState("#1890ff");
//   const [sidenavType, setSidenavType] = useState("transparent");
//   const [breadCrumbText, setBreadCrumbText] = useState("");
//   const [fixed, setFixed] = useState(false);

//   const openDrawer = () => setVisible(!visible);
//   const handleSidenavType = (type:any) => setSidenavType(type);
//   const handleSidenavColor = (color:any) => setSidenavColor(color);
//   const handleFixedNavbar = (type:any) => setFixed(type);
//   const role = useSelector((state: RootState) => state.token.user?.role);

//   let { pathname } = useLocation();
//   pathname = pathname.replace("/", "");

//   useEffect(() => {
//     if (pathname === "rtl") {
//       setPlacement("left");
//     } else {
//       setPlacement("right");
//     }
//   }, [pathname]);

//   /*if(role != "Admin") {
//     return <Navigate to="/home" />
//   }*/

//   return (
//     <Layout
//       className={`layout-dashboard ${
//         pathname === "profile" ? "layout-profile" : ""
//       } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
//     >
//       <Drawer
//         title={false}
//         placement={placement === "right" ? "left" : "right"}
//         closable={false}
//         onClose={() => setVisible(false)}
//         visible={visible}
//         key={placement === "right" ? "left" : "right"}
//         width={250}
//         className={`drawer-sidebar ${
//           pathname === "rtl" ? "drawer-sidebar-rtl" : ""
//         } `}
//       >
//         <Layout
//           className={`layout-dashboard ${
//             pathname === "rtl" ? "layout-dashboard-rtl" : ""
//           }`}
//         >
//           <Sider
//             trigger={null}
//             width={250}
//             theme="light"
//             className={`sider-primary ant-layout-sider-primary ${
//               sidenavType === "#fff" ? "active-route" : ""
//             }`}
//             style={{ background: sidenavType }}
//           >
//             <Sidenav color={sidenavColor} />
//           </Sider>
//         </Layout>
//       </Drawer>
//       <Sider
//         breakpoint="lg"
//         collapsedWidth="0"
//         onCollapse={(collapsed, type) => {
//           console.log(collapsed, type);
//         }}
//         trigger={null}
//         width={250}
//         theme="light"
//         className={`sider-primary ant-layout-sider-primary ${
//           sidenavType === "#fff" ? "active-route" : ""
//         }`}
//         style={{ background: sidenavType }}
//       >
//         <Sidenav color={sidenavColor} />
//       </Sider>
//       <Layout>
//         {fixed ? (
//           <Affix>
//             <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
//               <Header
//                 onPress={openDrawer}
//                 name={pathname}
//                 subName={pathname}
//                 handleSidenavColor={handleSidenavColor}
//                 handleSidenavType={handleSidenavType}
//                 handleFixedNavbar={handleFixedNavbar}
//               />
//             </AntHeader>
//           </Affix>
//         ) : (
//           <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
//             <Header
//               onPress={openDrawer}
//               name={pathname}
//               subName={pathname}
//               handleSidenavColor={handleSidenavColor}
//               handleSidenavType={handleSidenavType}
//               handleFixedNavbar={handleFixedNavbar}
//             />
//           </AntHeader>
//         )}
//         {/* <Content className="content-ant">{children}</Content> */}
//           <Outlet />
//         <Footer />
//       </Layout>
//     </Layout>
//   );
// }

// export default Main;
