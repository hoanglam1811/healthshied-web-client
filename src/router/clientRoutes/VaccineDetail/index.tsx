import RouteNames from "@/constants/routeNames";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Carousel, Divider } from "antd";
import { Content } from "antd/es/layout/layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import home1 from "@/assets/home1.png";
import home2 from "@/assets/home2.png";
import home3 from "@/assets/home3.png";
import home4 from "@/assets/home4.png";
import home5 from "@/assets/home5.png";
import { useEffect, useState } from "react";
import { getVaccineById } from "@/services/ApiServices/vaccineService";

const CustomArrow = ({ className, style, onClick, direction }: any) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        fontSize: "24px",
        color: "#399696",
        backgroundColor: "white",
        borderRadius: "50%",
        fontWeight: "bolder",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 2
      }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftOutlined  /> : <RightOutlined />}
    </div>
  );
};

const VaccineDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [vaccine, setVaccine] = useState<any>(null);

  const fetchVaccine = async () => {
    try{
      if(!id) return;
      const response = await getVaccineById(id);
      setVaccine(response);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchVaccine();
  }, [])

  if(!id) navigate(RouteNames.HOME);

  return (
    <Content style={{ 
      minHeight: "85vh",
      padding: '0 48px',
      background: "#F3F5F7"
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
      <Card styles={{ body: { width: "100%" }}} className="!w-full !rounded-3xl">
        <div className="!grid !grid-cols-8">
          <div className="!col-span-3">
            <Carousel style={{ height: "100%" }} arrows
              prevArrow={<CustomArrow direction="left" />}
              nextArrow={<CustomArrow direction="right" />}
              dots={{ className: "custom-dots" }}
              infinite={false}
            >
              <div className="!flex justify-center w-full">
                <img src={home1} alt="Logo" className="max-h-[300px]" />
              </div>
              <div className="!flex justify-center w-full">
                <img src={home2} alt="Logo" className="max-h-[300px]" />
              </div>
              <div className="!flex justify-center w-full">
                <img src={home3} alt="Logo" className="max-h-[300px]" />
              </div>
              <div className="!flex justify-center w-full">
                <img src={home4} alt="Logo" className="max-h-[300px]" />
              </div>
            </Carousel>
          </div>
          <div className="!col-span-5 !text-left !pl-4">
            <h3 className="!mb-2 !text-gray-500 !text-lg !font-semibold">{vaccine?.contraindications}</h3>
            <h2 className="!mb-3 !text-2xl !font-bold">{vaccine?.name}</h2>
            <div>
              <span className="!text-3xl !font-semibold !text-orange-500">{vaccine?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span> 
              <span>/ Tube</span>
            </div>
            <Divider style={{ background: "rgba(255, 255, 255, 0.2)" }} />
            <div>
              <p>{vaccine?.description}</p>
            </div>
          </div>
        
        </div>
      </Card>

      <Card styles={{ body: { width: "100%" }}} className="!w-full !text-left !rounded-3xl !mt-4">
        <p>{vaccine?.description}</p>
      </Card>
    </Content>
  )
}

export default VaccineDetail;
