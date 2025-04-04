import RouteNames from "@/constants/routeNames";
import { Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

const VaccineDetail = () => {
  return (
    <Content style={{ 
      minHeight: "85vh",
      padding: '0 48px',
    }}>
      <Breadcrumb
        className="!py-4"
        items={[
          {
            title: <Link to={RouteNames.HOME}>Home</Link>,
          },
          {
            title: <Link to={RouteNames.VACCINE_LIST}>Vaccine List</Link>,          
          },
          {
            title: "Vaccine Detail",
          },
        ]}
      />
    </Content>
  )
}

export default VaccineDetail;
