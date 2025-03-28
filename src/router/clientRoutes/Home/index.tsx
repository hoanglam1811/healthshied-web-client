import { AndroidOutlined, LeftCircleOutlined, LeftOutlined, RightCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Carousel, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import logo from "@/assets/logo.png";
import { HeartIcon } from "lucide-react";

const CustomArrow = ({ className, style, onClick, direction }: any) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        fontSize: "24px",
        color: "black",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2
      }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );
};

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
    return (
    <Content style={{ minHeight: "85vh" }}>
      <div style={{ background: "url('https://cdn.tiemchunglongchau.com.vn/unsafe/1920x0/filters:quality(90):format(webp)/HEADER_BANNER_f8b8df36f0.png')",
        padding: '0 48px',
        minHeight: "85vh",
        backgroundSize: "100% 100%", /* Stretches the background to fully cover the element */
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 0%"
      }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}> */}
        {/*   <Breadcrumb.Item>Home</Breadcrumb.Item> */}
        {/* </Breadcrumb> */}
        <div
          style={{
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <img src={logo} alt="Logo" />
              What vaccine should I get
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Blogs
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Blogs
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
          </div>
          <div style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            <div className="grid grid-cols-6 gap-4 items-center !mt-3">
              <div className="col-span-4 h-[300px]" style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                border: "1px solid #f0f0f0",
              }}>
                <Carousel style={{ height: "100%" }} arrows
                  prevArrow={<CustomArrow direction="left" />}
                  nextArrow={<CustomArrow direction="right" />}
                  autoplay={{dotDuration: true}}
                  dots={{className: "custom-dots"}}
                >
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo" className="max-h-[300px]"/>
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo"  className="max-h-[300px]"/>
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo"  className="max-h-[300px]"/>
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo"  className="max-h-[300px]"/>
                  </div>
                </Carousel>
              </div>
              <Card className="col-span-2 h-[300px]">
                <img src={logo} alt="Logo" className="max-h-[200px]" />
                Vaccine List
              </Card>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center !px-[50px] !mt-3">
              <div className="flex gap-3 !border-r !border-black !border-dashed text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>
              <div className="flex gap-3 !border-r !border-black !border-dashed text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>
              <div className="flex gap-3 !border-r !border-black !border-dashed text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>   
              <div className="flex gap-3 text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !border-black !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <h3 className="!text-3xl !font-bold !text-black !mb-3">
          What vaccine should I get
          <span className="!text-3xl !font-bold !text-orange-500 underline !ml-2">this season
          </span>
          <HeartIcon className="!text-3xl !inline-block !text-orange-500 !ml-2" />
        </h3>

        <Card className="!px-[10%]">
          Bảo vệ bản thân khỏi sốt xuất huyết Dengue thế nào?
          Bảo vệ bản thân khỏi sốt xuất huyết Dengue thế nào?
          Sốt xuất huyết Dengue là bệnh truyền nhiễm cấp tính do virus Dengue gây ra, lây truyền qua vết đốt của muỗi vằn Aedes. Bệnh có thể gây sốt cao, đau đầu, đau cơ, buồn nôn, nôn, phát ban và có thể dẫn đến các biến chứng nguy hiểm như xuất huyết, sốc, suy tạng, thậm chí tử vong. Hiện nay, vắc xin Qdenga là loại vắc xin sống, giảm độc lực được sử dụng để phòng ngừa bệnh sốt xuất huyết, dành cho trẻ từ 4 tuổi và người lớn. Tiêm phòng vắc xin là biện pháp hiệu quả giúp bảo vệ sức khỏe cho bạn và cộng đồng.
        </Card>
      </div>
    </Content>
    )
}

export default Home;
